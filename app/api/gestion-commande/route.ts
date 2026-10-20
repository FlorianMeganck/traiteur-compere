import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getFestiveOrder, updateFestiveOrderAdditions } from '../../lib/db';
import { isEarlyBirdFestivePromoActive } from '../../data/menus-fetes';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;

// Vérifie si l'ajustement est encore possible (J-7 avant le retrait)
function isAdjustmentAllowed(repasDateStr: string, currentDate: Date = new Date()): boolean {
    if (!repasDateStr) return true;

    let targetDate: Date | null = null;
    const isoMatch = repasDateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
        targetDate = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]), 12, 0, 0);
    } else {
        const dayMatch = repasDateStr.match(/(\d{1,2})\s*(décembre|janvier)/i);
        if (dayMatch) {
            const day = Number(dayMatch[1]);
            const monthStr = dayMatch[2].toLowerCase();
            const year = monthStr.includes('janv') ? 2027 : 2026;
            const month = monthStr.includes('janv') ? 0 : 11;
            targetDate = new Date(year, month, day, 12, 0, 0);
        }
    }

    if (!targetDate) return true; // Si date non déterminable, autoriser par bienveillance

    // Date de retrait au plus tôt = la veille
    const earliestPickup = new Date(targetDate);
    earliestPickup.setDate(earliestPickup.getDate() - 1);

    const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const pickupMidnight = new Date(earliestPickup.getFullYear(), earliestPickup.getMonth(), earliestPickup.getDate());

    const diffDays = Math.round((pickupMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
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

        const canAdjust = order.payment_mode === 'acompte_30' && isAdjustmentAllowed(order.repas_date);

        return NextResponse.json({
            success: true,
            order,
            canAdjust,
            isEarlyBirdOnAdditions: isEarlyBirdFestivePromoActive(new Date())
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

// 2. POST : Enregistrement d'un avenant / ajouts et recalcul du solde
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId, email, additionalItems, additionalAmount, newBalanceTotal } = body;

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

        if (existingOrder.payment_mode !== 'acompte_30') {
            return NextResponse.json({
                success: false,
                error: 'Les modifications ne sont autorisées que pour les commandes avec versement d\'acompte 30%.'
            }, { status: 403 });
        }

        if (!isAdjustmentAllowed(existingOrder.repas_date)) {
            return NextResponse.json({
                success: false,
                error: 'Le délai d\'ajustement (7 jours avant le retrait) est dépassé.'
            }, { status: 403 });
        }

        // Mise à jour en base de données
        const updatedOrder = await updateFestiveOrderAdditions(
            orderId,
            email,
            additionalItems,
            Number(newBalanceTotal)
        );

        // Préparation des informations bancaires pour l'email
        const IBAN = "BE22 0689 4683 8447";
        const BIC = "GKCCBEBB";
        const BENEFICIAIRE = "JEAN COMPERE";
        const fullNameUpper = `${existingOrder.nom.toUpperCase()} ${existingOrder.prenom.toUpperCase()}`.trim();
        const COMMUNICATION_SOLDE = `${existingOrder.id} - SOLDE FINAL - ${fullNameUpper}`;

        // Tableau HTML des ajouts
        const addedRowsHTML = additionalItems.map(item => `
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
                                                            <td style="color: #666666;">Solde restant commande initiale (70%) :</td>
                                                            <td style="text-align: right; font-weight: 600;">${(existingOrder.total_initial - existingOrder.amount_paid_initial).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666666;">Montant des nouveaux ajouts :</td>
                                                            <td style="text-align: right; font-weight: 600; color: #B89327;">+ ${Number(additionalAmount).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #E8D8A6;">
                                                            <td style="padding-top: 8px; font-size: 14px; font-weight: bold; color: #1A1A1A;">Nouveau solde total à verser :</td>
                                                            <td style="padding-top: 8px; text-align: right; font-size: 18px; font-weight: bold; color: #B89327;">${Number(newBalanceTotal).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                                                        </tr>
                                                    </table>
                                                </div>

                                                <!-- COORDONNÉES BANCAIRES POUR LE SOLDE -->
                                                <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 10px;">
                                                        COORDONNÉES BANCAIRES (SOLDE FINAL)
                                                    </div>
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

                // Copie au traiteur
                await resend.emails.send({
                    from: fromAddress,
                    to: traiteurEmail,
                    replyTo: email,
                    subject: `[${existingOrder.id}] AJOUTS CLIENT REÇUS - ${fullNameUpper} - Solde: ${Number(newBalanceTotal).toFixed(2)} €`,
                    html: avenantEmailHtml
                });
            } catch (emailErr) {
                console.error("Erreur envoi Resend avenant (non-bloquante):", emailErr);
            }
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
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
