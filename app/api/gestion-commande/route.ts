import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getFestiveOrder, updateFestiveOrderAdditions, FestiveOrderItem } from '../../lib/db';
import {
    FORMULES_FETES,
    CARTE_FETES_ITEMS,
    isEarlyBirdFestivePromoActive
} from '../../data/menus-fetes';
import { parseRepasDate, getDiffCalendarDays } from '../../lib/festive-reminders';
import { buildEpcQrImageUrl } from '../../lib/festive-emails';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;

const ADJUSTABLE_ORDER_STATUSES = ['deposit_paid', 'solde_en_attente'] as const;

export type CanAdjustReason =
    | 'not_deposit_mode'
    | 'pending_payment'
    | 'fully_paid'
    | 'deadline_passed'
    | 'status_locked'
    | null;

// Vérifie si l'ajustement est encore possible (J-7 avant le retrait au plus tôt, fail-closed si date invalide)
function isAdjustmentAllowed(repasDateStr: string, currentDate: Date = new Date()): boolean {
    if (!repasDateStr || !repasDateStr.trim()) return false;

    const targetDate = parseRepasDate(repasDateStr);
    if (!targetDate) return false;

    // Date de retrait au plus tôt = la veille
    const earliestPickup = new Date(targetDate);
    earliestPickup.setDate(earliestPickup.getDate() - 1);

    const diffDays = getDiffCalendarDays(earliestPickup, currentDate);
    return diffDays >= 7;
}

function evaluateOrderAdjustability(
    order: { payment_mode: string; status: string; repas_date: string },
    currentDate: Date = new Date()
): { canAdjust: boolean; canAdjustReason: CanAdjustReason; adjustmentMessage: string | null } {
    if (order.payment_mode !== 'acompte_30') {
        return {
            canAdjust: false,
            canAdjustReason: 'not_deposit_mode',
            adjustmentMessage: 'Les modifications en ligne sont réservées aux commandes avec versement d\'acompte de 30 %.'
        };
    }

    if (order.status === 'pending_payment' || order.status === 'en_attente') {
        return {
            canAdjust: false,
            canAdjustReason: 'pending_payment',
            adjustmentMessage: 'L\'ajout de convives et de mets supplémentaires sera débloqué dès validation de votre acompte de 30 % par notre atelier.'
        };
    }

    if (order.status === 'fully_paid' || order.status === 'solde_regle') {
        return {
            canAdjust: false,
            canAdjustReason: 'fully_paid',
            adjustmentMessage: 'Votre commande est déjà intégralement soldée. Pour toute demande particulière, veuillez contacter notre atelier.'
        };
    }

    if (!(ADJUSTABLE_ORDER_STATUSES as readonly string[]).includes(order.status)) {
        return {
            canAdjust: false,
            canAdjustReason: 'status_locked',
            adjustmentMessage: 'Le statut actuel de votre commande ne permet pas de modification en ligne.'
        };
    }

    if (!isAdjustmentAllowed(order.repas_date, currentDate)) {
        return {
            canAdjust: false,
            canAdjustReason: 'deadline_passed',
            adjustmentMessage: 'La date limite d\'ajustement (7 jours avant la date de retrait) est atteinte.'
        };
    }

    return {
        canAdjust: true,
        canAdjustReason: null,
        adjustmentMessage: null
    };
}

function recalculateAdditionItemServerSide(
    rawItem: FestiveOrderItem,
    isEarlyBird: boolean
): FestiveOrderItem | null {
    const qty = Math.floor(Number(rawItem.quantitePlat ?? rawItem.quantite ?? rawItem.qty ?? 0));
    if (!Number.isFinite(qty) || qty < 1) {
        return null;
    }

    const rawId = String(rawItem.id || '').trim();
    const rawIdLower = rawId.toLowerCase();
    const rawNom = String(rawItem.nomPlat || rawItem.title || rawItem.nom || '').trim();
    const rawNomLower = rawNom.toLowerCase();

    const matchedFormule = FORMULES_FETES.find(f => {
        const titleLower = f.title.toLowerCase();
        return (
            rawIdLower === f.id.toLowerCase() ||
            rawIdLower.startsWith(`${f.id.toLowerCase()}-`) ||
            rawIdLower.startsWith(`addition-formule-${f.id.toLowerCase()}`) ||
            rawNomLower === titleLower ||
            rawNomLower.startsWith(`${titleLower} (`)
        );
    });

    const matchedCarte = !matchedFormule
        ? CARTE_FETES_ITEMS.find(c => {
            const cIdLower = c.id.toLowerCase();
            return (
                rawIdLower === cIdLower ||
                rawIdLower === `carte-${cIdLower}` ||
                rawIdLower === `addition-carte-${cIdLower}` ||
                rawIdLower.startsWith(`addition-carte-${cIdLower}-`) ||
                c.title.toLowerCase() === rawNomLower
            );
        })
        : undefined;

    if (!matchedFormule && !matchedCarte) {
        return null;
    }

    const baseCatalogPrice = matchedFormule ? matchedFormule.price : matchedCarte!.price;
    const discountRate = isEarlyBird ? 0.05 : 0;
    const unitPriceNet = Math.round(baseCatalogPrice * (1 - discountRate) * 100) / 100;
    const lineTotal = Math.round(unitPriceNet * qty * 100) / 100;

    const officialLabel = matchedFormule
        ? `${matchedFormule.title} (${matchedFormule.price}€)`
        : matchedCarte!.title;

    const cleanSummary = Array.isArray(rawItem.coursesSummary)
        ? rawItem.coursesSummary.map(s => String(s || '').trim()).filter(Boolean)
        : undefined;

    return {
        id: rawId || `addition-${Date.now()}`,
        nomPlat: officialLabel,
        quantitePlat: qty,
        prixUnitairePlat: unitPriceNet,
        prixTotalLigne: lineTotal,
        ...(cleanSummary && cleanSummary.length > 0 ? { coursesSummary: cleanSummary } : {}),
        badge: matchedFormule ? 'Formule Fêtes' : (matchedCarte!.categoryLabel || 'À la carte'),
        isAddition: true
    };
}

// 1. GET : Récupération sécurisée d'une commande
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('order') || searchParams.get('orderId');
        const email = searchParams.get('email');

        if (!orderId || !email) {
            return NextResponse.json({
                success: false,
                error: 'Numéro de commande et adresse email requis'
            }, { status: 400 });
        }

        const order = await getFestiveOrder(orderId, email);

        if (!order) {
            return NextResponse.json({
                success: false,
                error: 'Aucune commande trouvée correspondant à ce numéro et cet email.'
            }, { status: 404 });
        }

        const now = new Date();
        const adjustability = evaluateOrderAdjustability(order, now);

        return NextResponse.json({
            success: true,
            order,
            canAdjust: adjustability.canAdjust,
            canAdjustReason: adjustability.canAdjustReason,
            adjustmentMessage: adjustability.adjustmentMessage,
            isEarlyBirdOnAdditions: isEarlyBirdFestivePromoActive(now)
        });

    } catch (err: unknown) {
        console.error("Erreur GET /api/gestion-commande:", err);
        const errMsg = err instanceof Error ? err.message : 'Erreur serveur lors de la récupération de la commande';
        return NextResponse.json({
            success: false,
            error: errMsg
        }, { status: 500 });
    }
}

// 2. POST : Enregistrement d'un avenant / ajouts et recalcul serveur du solde
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId, email, additionalItems } = body;

        if (!orderId || !email) {
            return NextResponse.json({ success: false, error: 'Paramètres manquants' }, { status: 400 });
        }

        if (!Array.isArray(additionalItems) || additionalItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Aucun article ajouté' }, { status: 400 });
        }

        const existingOrder = await getFestiveOrder(orderId, email);
        if (!existingOrder) {
            return NextResponse.json({ success: false, error: 'Commande introuvable' }, { status: 404 });
        }

        const now = new Date();
        const adjustability = evaluateOrderAdjustability(existingOrder, now);
        if (!adjustability.canAdjust) {
            return NextResponse.json({
                success: false,
                canAdjustReason: adjustability.canAdjustReason,
                error: adjustability.adjustmentMessage || 'Les modifications ne sont pas autorisées pour cette commande.'
            }, { status: 403 });
        }

        // Recalcul strict côté serveur de chaque article ajouté
        const isEarlyBird = isEarlyBirdFestivePromoActive(now);
        const verifiedAdditions: FestiveOrderItem[] = [];

        for (const rawItem of additionalItems) {
            if (!rawItem || typeof rawItem !== 'object') {
                return NextResponse.json({ success: false, error: 'Format d\'article ajouté invalide.' }, { status: 400 });
            }
            const recalculated = recalculateAdditionItemServerSide(rawItem as FestiveOrderItem, isEarlyBird);
            if (!recalculated) {
                return NextResponse.json(
                    { success: false, error: 'Un ou plusieurs articles ajoutés sont invalides ou non reconnus au catalogue officiel.' },
                    { status: 400 }
                );
            }
            verifiedAdditions.push(recalculated);
        }

        const previousBalance = Math.round(Number(existingOrder.balance_remaining || 0) * 100) / 100;
        const additionalAmount = Math.round(
            verifiedAdditions.reduce((sum, item) => sum + Number(item.prixTotalLigne || 0), 0) * 100
        ) / 100;
        const newBalanceTotal = Math.round((previousBalance + additionalAmount) * 100) / 100;

        // Mise à jour en base de données
        const updatedOrder = await updateFestiveOrderAdditions(
            orderId,
            email,
            verifiedAdditions,
            newBalanceTotal
        );

        // Préparation des informations bancaires et du QR Code SEPA EPC actualisé
        const IBAN = "BE22 0689 4683 8447";
        const BIC = "GKCCBEBB";
        const BENEFICIAIRE = "JEAN COMPERE";
        const fullNameUpper = `${existingOrder.nom.toUpperCase()} ${existingOrder.prenom.toUpperCase()}`.trim();
        const COMMUNICATION_SOLDE = `${existingOrder.id} - SOLDE FINAL - ${fullNameUpper}`;
        const avenantQrUrl = newBalanceTotal > 0
            ? buildEpcQrImageUrl(newBalanceTotal, COMMUNICATION_SOLDE)
            : '';

        // Tableau HTML des ajouts (montants certifiés serveur)
        const addedRowsHTML = verifiedAdditions.map(item => `
            <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #EFECE6; font-size: 13px; color: #1A1A1A;">
                    <strong>${item.nomPlat || 'Mets ajouté'}</strong>
                    ${item.coursesSummary && item.coursesSummary.length > 0 ? `
                        <div style="font-size: 11px; color: #666666; margin-top: 2px;">
                            ${item.coursesSummary.join(' • ')}
                        </div>
                    ` : ''}
                </td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #EFECE6; text-align: center; font-weight: bold; font-size: 13px; color: #1A1A1A;">
                    ${item.quantitePlat || 1}
                </td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #EFECE6; text-align: right; font-weight: bold; font-size: 13px; color: #B89327; white-space: nowrap;">
                    ${Number(item.prixTotalLigne || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                </td>
            </tr>
        `).join('');

        // Envoi d'email Resend pour l'avenant
        if (resend) {
            try {
                const fromAddress = 'Traiteur Compère <contact@traiteur-compere.be>';
                const traiteurEmail = process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com';

                const avenantEmailHtml = `
                    <!DOCTYPE html>
                    <html lang="fr">
                    <head><meta charset="utf-8"><title>Avenant Commande ${existingOrder.id}</title></head>
                    <body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1A1A1A;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 30px 12px;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                                        <tr>
                                            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #B89327; margin-bottom: 6px;">
                                                    AVENANT À VOTRE COMMANDE DE FÊTES
                                                </div>
                                                <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #1A1A1A; text-transform: uppercase;">
                                                    CONFIRMATION DES AJOUTS &amp; SOLDE
                                                </h1>
                                                <div style="margin-top: 10px; display: inline-block; background-color: #F7F5F0; border: 1px solid #E8E2D5; border-radius: 9999px; padding: 5px 16px; font-size: 11px; font-weight: 700; color: #1A1A1A;">
                                                    COMMANDE N° ${existingOrder.id}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 28px 32px;">
                                                <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #333333;">
                                                    Bonjour <strong>${existingOrder.prenom} ${existingOrder.nom}</strong>,<br/>
                                                    Vos ajustements de commande ont bien été enregistrés par notre atelier.
                                                </p>

                                                <!-- TABLEAU DES AJOUTS -->
                                                <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 8px;">
                                                    NOUVEAUX METS / CONVIVES AJOUTÉS
                                                </div>
                                                <table style="width: 100%; border-collapse: collapse; border: 1px solid #EFECE6; border-radius: 8px; margin-bottom: 24px;">
                                                    <thead>
                                                        <tr style="background-color: #F7F5F0; border-bottom: 1px solid #E8E2D5;">
                                                            <th style="padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; color: #666666;">Article</th>
                                                            <th style="padding: 10px 14px; text-align: center; font-size: 11px; text-transform: uppercase; color: #666666;">Qté</th>
                                                            <th style="padding: 10px 14px; text-align: right; font-size: 11px; text-transform: uppercase; color: #666666;">Montant</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${addedRowsHTML}
                                                    </tbody>
                                                </table>

                                                <!-- DÉCOMPTE DU NOUVEAU SOLDE -->
                                                <div style="background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                                                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8A6D1F; margin-bottom: 10px;">
                                                        SYNTHÈSE DU SOLDE À RÉGLER
                                                    </div>
                                                    <table style="width: 100%; font-size: 13px; line-height: 1.6;">
                                                        <tr>
                                                            <td style="color: #666666;">Solde restant avant cet avenant :</td>
                                                            <td style="text-align: right; font-weight: 600;">${previousBalance.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666666;">Montant des nouveaux ajouts :</td>
                                                            <td style="text-align: right; font-weight: 600; color: #B89327;">+ ${additionalAmount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #E8D8A6;">
                                                            <td style="padding-top: 8px; font-size: 14px; font-weight: bold; color: #1A1A1A;">Nouveau solde total à verser :</td>
                                                            <td style="padding-top: 8px; text-align: right; font-size: 18px; font-weight: bold; color: #B89327;">${newBalanceTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                    </table>
                                                </div>

                                                <!-- COORDONNÉES BANCAIRES & QR CODE SEPA POUR LE SOLDE -->
                                                <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 12px;">
                                                        QR CODE &amp; COORDONNÉES BANCAIRES (SOLDE FINAL ACTUALISÉ)
                                                    </div>

                                                    ${avenantQrUrl ? `
                                                    <div style="text-align: center; background-color: #FFFFFF; border: 1px solid #E8E2D5; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
                                                        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1A1A1A; margin-bottom: 10px;">
                                                            Scanner avec votre application bancaire
                                                        </div>
                                                        <img src="${avenantQrUrl}" width="180" height="180" alt="QR Code SEPA EPC - Nouveau solde ${newBalanceTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €" style="display: block; margin: 0 auto; border-radius: 6px;" />
                                                        <div style="font-size: 12px; color: #777777; margin-top: 8px;">
                                                            Nouveau solde pré-rempli : <strong style="color: #B89327;">${newBalanceTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong>
                                                        </div>
                                                    </div>
                                                    ` : ''}

                                                    <div style="font-size: 13px; margin-bottom: 6px;">Bénéficiaire : <strong>${BENEFICIAIRE}</strong></div>
                                                    <div style="font-size: 13px; margin-bottom: 6px;">IBAN : <strong style="font-family: monospace; background-color: #EDE8DF; padding: 2px 6px; border-radius: 4px;">${IBAN}</strong></div>
                                                    <div style="font-size: 13px; margin-bottom: 12px;">BIC : <strong>${BIC}</strong></div>
                                                    
                                                    <div style="background-color: #FAF6EB; border: 1px solid #E8D8A6; padding: 10px 12px; border-radius: 6px;">
                                                        <div style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #8A6D1F; margin-bottom: 2px;">Communication obligatoire :</div>
                                                        <div style="font-family: monospace; font-weight: bold; font-size: 14px; color: #1A1A1A;">${COMMUNICATION_SOLDE}</div>
                                                    </div>
                                                </div>

                                                <p style="font-size: 12px; color: #666666; text-align: center; margin: 16px 0 0 0;">
                                                    Ce solde est à régler au plus tard 7 jours avant votre date de retrait.
                                                </p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 20px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center; font-size: 11px; color: #888888;">
                                                Maison Compère • Rue Potay 3, 4470 Saint-Georges-sur-Meuse • +32 468 38 50 82
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `;

                // Envoi au client
                await resend.emails.send({
                    from: fromAddress,
                    to: email,
                    replyTo: traiteurEmail,
                    subject: `[${existingOrder.id}] AVENANT & SOLDE FINAL - ${fullNameUpper}`,
                    html: avenantEmailHtml
                });

                // Copie au traiteur (avec bouton de validation du solde actualisé si disponible)
                const balanceToken = updatedOrder?.balance_validation_token || existingOrder.balance_validation_token;
                const baseUrl = (
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    (process.env.VERCEL_PROJECT_PRODUCTION_URL
                        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                        : 'https://www.traiteur-compere.be')
                ).replace(/\/$/, '');
                const balanceConfirmUrl = balanceToken
                    ? `${baseUrl}/api/orders/confirm-payment?token=${encodeURIComponent(balanceToken)}&step=balance`
                    : '';

                const traiteurAvenantHtml = balanceConfirmUrl
                    ? avenantEmailHtml.replace(
                        '</td>\n                                        </tr>\n\n                                        <tr>\n                                            <td style="padding: 20px 32px;',
                        `<div style="margin-top: 24px; background-color: #F2F8F3; border: 2px solid #246131; border-radius: 10px; padding: 20px; text-align: center;">
                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #246131; margin-bottom: 8px;">
                                VALIDATION DU SOLDE FINAL ACTUALISÉ (TRAITEUR)
                            </div>
                            <p style="margin: 0 0 14px 0; font-size: 13px; color: #1A1A1A; line-height: 1.5;">
                                Dès réception du virement de <strong>${Number(newBalanceTotal).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong>, cliquez ci-dessous pour solder la commande :
                            </p>
                            <a href="${balanceConfirmUrl}" style="display: inline-block; background-color: #246131; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 22px; border-radius: 9999px; text-decoration: none;">
                                ✓ Valider la réception du solde (${Number(newBalanceTotal).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €)
                            </a>
                        </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 20px 32px;`
                    )
                    : avenantEmailHtml;

                await resend.emails.send({
                    from: fromAddress,
                    to: traiteurEmail,
                    replyTo: email,
                    subject: `[${existingOrder.id}] AJOUTS CLIENT REÇUS - ${fullNameUpper} - Solde: ${Number(newBalanceTotal).toFixed(2)} €`,
                    html: traiteurAvenantHtml
                });
            } catch (emailErr) {
                console.error("Erreur envoi Resend avenant (non-bloquante):", emailErr);
            }
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
            additionalAmount,
            newBalanceTotal,
            message: 'Avenant enregistré et email de confirmation envoyé avec succès.'
        });

    } catch (err: unknown) {
        console.error("Erreur POST /api/gestion-commande:", err);
        const errMsg = err instanceof Error ? err.message : 'Erreur lors de la validation des ajustements';
        return NextResponse.json({
            success: false,
            error: errMsg
        }, { status: 500 });
    }
}
