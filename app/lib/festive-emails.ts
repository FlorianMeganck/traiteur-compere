import type { FestiveOrderRecord, FestiveOrderItem } from './db';
import {
    IBAN,
    BIC,
    BENEFICIAIRE,
    LIEU_RETRAIT,
    GOOGLE_MAPS_URL,
    ATELIER_TEL,
    formatPrice,
    cleanCapitalize,
    renderOrderItemsTable
} from './festive-reminders';

export const IBAN_CLEAN = IBAN.replace(/\s+/g, '');

/**
 * Génère la chaîne SEPA EPC standardisée (EPC069-12) pour QR Code bancaire
 */
export function buildEpcQrString(amount: number, communication: string): string {
    const montantStr = amount > 0 ? `EUR${amount.toFixed(2)}` : '';
    return `BCD\n002\n1\nSCT\n${BIC}\n${BENEFICIAIRE}\n${IBAN_CLEAN}\n${montantStr}\n\n\n${communication}\n\n`;
}

/**
 * Retourne l'URL d'une image PNG de QR Code EPC scannable (ECC M requis par le standard EPC)
 * Compatible Gmail, Apple Mail, Outlook et clients mobiles.
 */
export function buildEpcQrImageUrl(amount: number, communication: string): string {
    const epcPayload = buildEpcQrString(amount, communication);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&ecc=M&margin=10&format=png&data=${encodeURIComponent(epcPayload)}`;
}

/**
 * E-mail n°2 — Envoyé automatiquement au client dès validation du paiement en 1 clic par le traiteur.
 * - Si acompte 30% validé (deposit_paid) : confirmation de réservation + lien/instructions pour modifier
 *   les convives jusqu'à J-7 + QR code EPC et coordonnées bancaires pour régler le solde de 70 %.
 * - Si totalité 100% validée (fully_paid) : confirmation définitive intégralement réglée (sans mention de solde).
 */
export function generatePaymentConfirmedEmail(
    order: FestiveOrderRecord,
    baseUrl: string = 'https://www.traiteur-compere.be'
): { subject: string; html: string } {
    const isDepositMode = order.payment_mode === 'acompte_30';
    const prenomClean = cleanCapitalize(order.prenom);
    const fullNameUpper = `${(order.nom || '').trim().toUpperCase()} ${(order.prenom || '').trim().toUpperCase()}`.trim();
    const amountPaidFormatted = formatPrice(order.amount_paid_initial);
    const balanceFormatted = formatPrice(order.balance_remaining);
    const totalFormatted = formatPrice(order.total_initial);
    const itemsTableHtml = renderOrderItemsTable(order.items, order.additional_items);

    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const orderManagementUrl = `${cleanBaseUrl}/gestion-commande?order=${encodeURIComponent(order.id)}&email=${encodeURIComponent(order.email)}`;

    const communicationSolde = `${order.id} - SOLDE FINAL - ${fullNameUpper}`;
    const soldeQrUrl = isDepositMode && order.balance_remaining > 0
        ? buildEpcQrImageUrl(order.balance_remaining, communicationSolde)
        : '';

    const subject = isDepositMode
        ? `Acompte reçu — Votre réservation Fêtes est confirmée (N° ${order.id}) - Maison Compère`
        : `Paiement reçu — Confirmation définitive de votre commande Fêtes (N° ${order.id}) - Maison Compère`;

    const badgeText = isDepositMode
        ? `ACOMPTE REÇU • RÉSERVATION CONFIRMÉE • N° ${order.id}`
        : `COMMANDE RÉGLÉE & CONFIRMÉE • N° ${order.id}`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 30px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                    <!-- EN-TÊTE MAISON COMPÈRE -->
                    <tr>
                        <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #1A1A1A; text-transform: uppercase;">
                                MAISON COMPÈRE
                            </h1>
                            <div style="margin-top: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777;">
                                Depuis 1821
                            </div>
                            <div style="width: 48px; height: 1px; background-color: #D4AF37; margin: 16px auto;"></div>

                            <div style="display: inline-block; background-color: #F2F8F3; border: 1px solid #B7D9BE; border-radius: 9999px; padding: 6px 18px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #246131;">
                                ✓ ${badgeText}
                            </div>
                        </td>
                    </tr>

                    <!-- CORPS DU MESSAGE -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 15px; color: #1A1A1A; line-height: 1.5;">
                                Bonjour <strong>${prenomClean}</strong>,
                            </p>

                            <!-- ENCART VERT DE CONFIRMATION DU PAIEMENT -->
                            <div style="background-color: #F2F8F3; border: 1px solid #B7D9BE; border-radius: 10px; padding: 20px 22px; margin: 0 0 26px 0;">
                                <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #246131; margin-bottom: 6px;">
                                    ${isDepositMode ? '✓ ACOMPTE DE 30 % BIEN REÇU' : '✓ PAIEMENT INTÉGRAL BIEN REÇU'}
                                </div>
                                <div style="font-size: 16px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px;">
                                    ${isDepositMode
                                        ? `Votre acompte de <span style="color: #246131;">${amountPaidFormatted} €</span> a été validé.`
                                        : `Votre règlement intégral de <span style="color: #246131;">${amountPaidFormatted} €</span> a été validé.`}
                                </div>
                                <p style="margin: 0; font-size: 13px; color: #3D5242; line-height: 1.55;">
                                    ${isDepositMode
                                        ? `Votre réservation pour les Menus de Fêtes 2026 (N° <strong>${order.id}</strong>) est officiellement confirmée dans notre planning d'atelier.`
                                        : `Votre commande pour les Menus de Fêtes 2026 (N° <strong>${order.id}</strong>) est définitivement confirmée et entièrement réglée. Vous n'avez plus aucune démarche à effectuer : tout sera prêt pour votre retrait !`}
                                </p>
                            </div>

                            ${isDepositMode ? `
                            <!-- ENCART GESTION & MODIFICATION CONVIVES J-7 (UNIQUEMENT POUR ACOMPTE 30%) -->
                            <div style="background-color: #FAF6EB; border: 1px solid #D4AF37; border-radius: 10px; padding: 22px; margin: 0 0 26px 0; text-align: center;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8A6D1F; margin-bottom: 6px;">
                                    MODIFIER VOS CONVIVES &amp; GÉRER VOTRE COMMANDE
                                </div>
                                <p style="margin: 0 0 16px 0; font-size: 13px; color: #333333; line-height: 1.55;">
                                    Vous pouvez <strong>ajuster le nombre de convives ou ajouter des mets supplémentaires jusqu'à 7 jours avant votre date de retrait</strong> depuis votre espace personnel.
                                </p>
                                <a href="${orderManagementUrl}"
                                   style="display: inline-block; background-color: #D4AF37; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 13px 26px; border-radius: 9999px; text-decoration: none; box-shadow: 0 2px 6px rgba(212,175,55,0.3);">
                                    Gérer ma commande &amp; Modifier mes convives →
                                </a>
                            </div>

                            <!-- ENCART RÈGLEMENT DU SOLDE 70% AVEC QR CODE EPC (UNIQUEMENT POUR ACOMPTE 30%) -->
                            <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 10px; padding: 22px; margin: 0 0 28px 0;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 10px;">
                                    RÈGLEMENT DU SOLDE RESTANT (70 %) — AU PLUS TARD À J-7
                                </div>
                                <p style="margin: 0 0 16px 0; font-size: 13px; color: #555555; line-height: 1.55;">
                                    Votre solde actuel est de <strong style="color: #1A1A1A; font-size: 15px;">${balanceFormatted} €</strong> (sur un total de ${totalFormatted} €). Il est à régler <strong>au plus tard 7 jours avant votre date de retrait</strong>.
                                </p>

                                ${soldeQrUrl ? `
                                <div style="text-align: center; background-color: #FFFFFF; border: 1px solid #E8E2D5; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
                                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1A1A1A; margin-bottom: 10px;">
                                        Scanner avec votre application bancaire
                                    </div>
                                    <img src="${soldeQrUrl}" width="180" height="180" alt="QR Code SEPA EPC - Solde ${balanceFormatted} €" style="display: block; margin: 0 auto; border-radius: 6px;" />
                                    <div style="font-size: 12px; color: #777777; margin-top: 8px;">
                                        Montant pré-rempli : <strong style="color: #B89327;">${balanceFormatted} €</strong>
                                    </div>
                                </div>
                                ` : ''}

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.6;">
                                    <tr>
                                        <td style="padding: 3px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">Bénéficiaire :</td>
                                        <td style="padding: 3px 0; color: #1A1A1A; font-weight: 600;">${BENEFICIAIRE}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">IBAN :</td>
                                        <td style="padding: 5px 0;">
                                            <code style="font-family: monospace; font-size: 14px; font-weight: 700; color: #1A1A1A; background-color: #EDE8DF; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">${IBAN}</code>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 3px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">BIC :</td>
                                        <td style="padding: 3px 0; color: #1A1A1A; font-weight: 600;">${BIC}</td>
                                    </tr>
                                </table>

                                <div style="margin-top: 14px; padding: 12px 14px; background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 6px;">
                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #B89327; margin-bottom: 4px;">
                                        Communication obligatoire pour le solde :
                                    </div>
                                    <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #1A1A1A; letter-spacing: 0.5px;">
                                        ${communicationSolde}
                                    </div>
                                </div>

                                <p style="margin: 12px 0 0 0; font-size: 11px; color: #777777; line-height: 1.5; font-style: italic;">
                                    Bon à savoir : si vous ajoutez des convives ou des plats via votre espace personnel avant J-7, un nouveau QR code avec le solde actualisé sera automatiquement généré.
                                </p>
                            </div>
                            ` : ''}

                            <!-- MODALITÉS DE RETRAIT -->
                            <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 20px; margin: 0 0 26px 0;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 14px;">
                                    VOS MODALITÉS DE RETRAIT À L'ATELIER
                                </div>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.55;">
                                    ${order.repas_date ? `
                                    <tr>
                                        <td style="padding: 4px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Date du repas :</td>
                                        <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600; vertical-align: top;">${order.repas_date}</td>
                                    </tr>` : ''}
                                    ${order.retrait_slot ? `
                                    <tr>
                                        <td style="padding: 6px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Créneau de retrait :</td>
                                        <td style="padding: 6px 0; color: #1A1A1A; font-weight: 600; vertical-align: top; line-height: 1.45;">${String(order.retrait_slot).split(' | ').join('<br/>')}</td>
                                    </tr>` : ''}
                                    <tr>
                                        <td style="padding: 6px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Lieu de retrait :</td>
                                        <td style="padding: 6px 0; color: #1A1A1A; vertical-align: top;">
                                            ${LIEU_RETRAIT}
                                            <div style="margin-top: 4px;">
                                                <a href="${GOOGLE_MAPS_URL}" style="color: #B89327; font-size: 12px; text-decoration: none; font-weight: 600;">Itinéraire Google Maps →</a>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #E8E2D5; font-size: 12px; color: #666666; font-style: italic; line-height: 1.5;">
                                    « Toutes les explications nécessaires pour un réchauffage et un dressage parfaits vous seront fournies lors du retrait. »
                                </div>
                            </div>

                            <!-- RÉCAPITULATIF DES METS -->
                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 8px;">
                                RÉCAPITULATIF DE VOTRE COMMANDE (TOTAL : ${totalFormatted} € TTC)
                            </div>
                            ${itemsTableHtml}

                            <p style="margin: 24px 0 0 0; font-size: 13px; color: #666666; line-height: 1.5; text-align: center;">
                                Pour toute question concernant votre commande, vous pouvez joindre notre atelier au <a href="tel:${ATELIER_TEL.replace(/\s+/g, '')}" style="color: #1A1A1A; font-weight: 600; text-decoration: none;">${ATELIER_TEL}</a> ou par retour de cet email.
                            </p>
                        </td>
                    </tr>

                    <!-- PIED DE CARTE MAISON COMPÈRE -->
                    <tr>
                        <td style="padding: 24px 32px 32px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center;">
                            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #1A1A1A; text-transform: uppercase; margin-bottom: 6px;">
                                MAISON COMPÈRE
                            </div>
                            <div style="font-size: 12px; color: #777777; margin-bottom: 12px;">
                                ${LIEU_RETRAIT}, Belgique
                            </div>
                            <div style="font-size: 12px; color: #888888; line-height: 1.5; font-style: italic;">
                                L'équipe Traiteur Compère vous remercie de votre confiance et vous souhaite d'excellentes fêtes de fin d'année.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    return { subject, html };
}

/**
 * Génère le bloc visuel "Détail de la commande à préparer" identique au premier e-mail Atelier
 * (avec composition détaillée des formules, articles à la carte et éventuels ajouts).
 */
function renderWorkshopOrderPreparationTable(order: FestiveOrderRecord): string {
    const cleanDishLine = (raw: unknown): string => {
        let str = String(raw || '').trim();
        const colonIdx = str.indexOf(':');
        if (colonIdx !== -1) {
            str = str.substring(colonIdx + 1).trim();
        }
        return str.replace(/^[•\-*]\s*/, '').trim();
    };

    const allRowsData: Array<{ item: FestiveOrderItem; isAddition: boolean }> = [
        ...(order.items || []).map((item) => ({ item, isAddition: Boolean(item.isAddition) })),
        ...(order.additional_items || []).map((item) => ({ item, isAddition: true }))
    ];

    if (allRowsData.length === 0) {
        return `
            <div style="border: 1px solid #EFECE6; border-radius: 8px; padding: 14px; margin: 8px 0 22px 0; background-color: #FFFFFF; font-size: 13px; color: #777777; font-style: italic;">
                Aucun article détaillé enregistré sur cette commande.
            </div>
        `;
    }

    let additionsTotal = 0;
    const rowsHtml = allRowsData
        .map(({ item, isAddition }) => {
            const qty = Number(item.quantitePlat ?? item.quantite ?? item.qty ?? item.quantity ?? 1);
            const title = String(item.nomPlat || item.title || item.nom || item.name || 'Menu de Fêtes').trim();
            const unitPrice = Number(item.prixUnitairePlat || 0);
            const lineTotal = Number(item.prixTotalLigne ?? item.totalPrice ?? (unitPrice * qty));
            if (isAddition) {
                additionsTotal += lineTotal;
            }

            let dishes: string[] = [];
            if (Array.isArray(item.coursesSummary) && item.coursesSummary.length > 0) {
                dishes = item.coursesSummary.map(cleanDishLine).filter(Boolean);
            } else if (
                item.coursesDescription &&
                typeof item.coursesDescription === 'string' &&
                !item.coursesDescription.includes('€ /')
            ) {
                dishes = [item.coursesDescription.trim()];
            }

            const coursesHtml = dishes.length > 0 ? `
                <ul style="margin: 6px 0 0 0; padding: 0 0 0 14px; list-style-type: none; font-size: 12px; color: #555555; line-height: 1.55;">
                    ${dishes.map((d) => `<li style="margin-bottom: 2px;"><span style="color: #D4AF37; margin-right: 6px;">•</span>${d}</li>`).join('')}
                </ul>
            ` : '';

            const additionBadge = isAddition
                ? `<span style="display: inline-block; margin-left: 6px; background-color: #FAF6EB; border: 1px solid #D4AF37; color: #8A6D1F; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 9999px; text-transform: uppercase;">+ Ajout</span>`
                : '';

            const unitPriceSpan = unitPrice > 0
                ? ` <span style="font-weight: normal; color: #777777; font-size: 12px;">(${formatPrice(unitPrice)} €)</span>`
                : '';

            return `
                <tr>
                    <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; vertical-align: top;">
                        <div style="font-size: 13px; font-weight: bold; color: #1A1A1A;">
                            ${title}${unitPriceSpan}${additionBadge}
                        </div>
                        ${coursesHtml}
                    </td>
                    <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; text-align: center; font-weight: bold; font-size: 13px; color: #1A1A1A; vertical-align: top;">
                        ${qty}
                    </td>
                    <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; text-align: right; font-weight: bold; font-size: 13px; color: #1A1A1A; vertical-align: top; white-space: nowrap;">
                        ${formatPrice(lineTotal)} €
                    </td>
                </tr>
            `;
        })
        .join('');

    const grandTotalNet = Number(order.total_initial || 0) + additionsTotal;
    const discountAmount = Number(order.early_bird_discount || 0);

    return `
        <div style="border: 1px solid #EFECE6; border-radius: 8px; overflow: hidden; margin: 8px 0 22px 0; background-color: #FFFFFF;">
            <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <thead>
                    <tr style="background-color: #F7F5F0; border-bottom: 1px solid #E8E2D5;">
                        <th style="width: 65%; padding: 10px 14px; text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #666666; font-weight: 700;">Article &amp; Composition</th>
                        <th style="width: 15%; padding: 10px 14px; text-align: center; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #666666; font-weight: 700;">Qté</th>
                        <th style="width: 20%; padding: 10px 14px; text-align: right; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #666666; font-weight: 700;">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
                <tfoot>
                    ${discountAmount > 0 ? `
                    <tr>
                        <td colspan="2" style="padding: 8px 14px 4px 14px; text-align: right; font-size: 12px; color: #B89327; font-weight: bold;">
                            Remise Early Bird (-5 %) incluse :
                        </td>
                        <td style="padding: 8px 14px 4px 14px; text-align: right; font-size: 12px; color: #B89327; font-weight: bold; white-space: nowrap;">
                            - ${formatPrice(discountAmount)} €
                        </td>
                    </tr>` : ''}
                    <tr style="border-top: 1px solid #E8E2D5;">
                        <td colspan="2" style="padding: 10px 14px 6px 14px; text-align: right; font-size: 13px; font-weight: bold; color: #1A1A1A;">Total commande TTC :</td>
                        <td style="padding: 10px 14px 6px 14px; text-align: right; font-size: 15px; font-weight: bold; color: #1A1A1A; white-space: nowrap;">${formatPrice(grandTotalNet)} €</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 4px 14px; text-align: right; font-size: 12px; color: #246131; font-weight: 600;">Acompte 30 % encaissé :</td>
                        <td style="padding: 4px 14px; text-align: right; font-size: 12px; color: #246131; font-weight: 700; white-space: nowrap;">- ${formatPrice(order.amount_paid_initial)} €</td>
                    </tr>
                    <tr style="background-color: #FAF6EB;">
                        <td colspan="2" style="padding: 10px 14px; text-align: right; font-size: 13px; font-weight: bold; color: #8A6D1F; border-top: 1px solid #E8D8A6;">
                            Solde restant à encaisser (70 %) :
                        </td>
                        <td style="padding: 10px 14px; text-align: right; font-size: 15px; font-weight: bold; color: #B89327; border-top: 1px solid #E8D8A6; white-space: nowrap;">
                            ${formatPrice(order.balance_remaining)} €
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

/**
 * E-mail interne envoyé au Traiteur après validation de l'acompte 30 % (deposit_paid)
 * pour garder à portée de main le récapitulatif complet à préparer et le lien sécurisé de validation du solde 70 % (deposit_paid → fully_paid).
 */
export function generateTraiteurBalanceValidationEmail(
    order: FestiveOrderRecord,
    balanceConfirmUrl: string
): { subject: string; html: string } {
    const fullNameUpper = `${(order.nom || '').trim().toUpperCase()} ${(order.prenom || '').trim().toUpperCase()}`.trim();
    const balanceFormatted = formatPrice(order.balance_remaining);
    const depositFormatted = formatPrice(order.amount_paid_initial);
    const communicationSolde = `${order.id} - SOLDE FINAL - ${fullNameUpper}`;
    const retraitSlotFormatted = order.retrait_slot
        ? String(order.retrait_slot).split(' | ').join('<br/>')
        : 'À confirmer';
    const orderPreparationTableHtml = renderWorkshopOrderPreparationTable(order);

    const subject = `[${order.id}] SUIVI SOLDE 70 % (${balanceFormatted} €) — ${fullNameUpper}`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 30px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden;">
                    <tr>
                        <td style="padding: 28px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #B89327; margin-bottom: 6px;">
                                SUIVI ATELIER • ACOMPTE 30 % VALIDÉ
                            </div>
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; color: #1A1A1A;">
                                Lien de validation du solde 70 % — ${order.id}
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 28px 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 14px; color: #333333; line-height: 1.6;">
                                L'acompte de <strong>${depositFormatted} €</strong> pour <strong>${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}</strong> a bien été validé (statut : <code>deposit_paid</code>).
                            </p>

                            <!-- COORDONNÉES CLIENT, RETRAIT & SOLDE -->
                            <div style="background-color: #FAF9F6; border: 1px solid #E8E2D5; border-radius: 8px; padding: 16px 18px; margin-bottom: 22px; font-size: 13px; line-height: 1.65;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 10px;">
                                    COORDONNÉES CLIENT &amp; MODALITÉS DE RETRAIT
                                </div>
                                <div><strong>Client :</strong> ${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()} (<a href="mailto:${order.email}" style="color: #1A1A1A; text-decoration: none;">${order.email}</a>${order.telephone ? ` • <a href="tel:${order.telephone}" style="color: #1A1A1A; text-decoration: none;">${order.telephone}</a>` : ''})</div>
                                <div><strong>Date du repas :</strong> <strong style="color: #B89327;">${order.repas_date || '-'}</strong></div>
                                <div><strong>Créneau de retrait :</strong> <strong>${retraitSlotFormatted}</strong></div>
                                <div><strong>Solde attendu (70 %) :</strong> <strong style="color: #B89327;">${balanceFormatted} €</strong> <span style="color: #777777; font-size: 12px;">(hors éventuels ajouts ultérieurs)</span></div>
                                <div><strong>Communication attendue :</strong> <code>${communicationSolde}</code></div>
                            </div>

                            <!-- DÉTAIL DE LA COMMANDE À PRÉPARER -->
                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 8px;">
                                DÉTAIL DE LA COMMANDE À PRÉPARER
                            </div>
                            ${orderPreparationTableHtml}

                            ${order.notes ? `
                            <div style="background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #B89327; margin-bottom: 4px;">
                                    REMARQUES DU CLIENT / ALLERGIES
                                </div>
                                <div style="font-size: 13px; color: #1A1A1A; line-height: 1.5; white-space: pre-line;">${order.notes}</div>
                            </div>` : ''}

                            <div style="background-color: #F2F8F3; border: 2px solid #246131; border-radius: 10px; padding: 22px 20px; text-align: center;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #246131; margin-bottom: 8px;">
                                    À UTILISER LORS DE LA RÉCEPTION DU SOLDE (70 %)
                                </div>
                                <p style="margin: 0 0 16px 0; font-size: 13px; color: #1A1A1A; line-height: 1.5;">
                                    Une fois le virement du solde repéré sur votre compte bancaire, cliquez ci-dessous pour passer la commande en <strong>fully_paid</strong>, stopper les relances automatiques J-10 et prévenir le client :
                                </p>
                                <a href="${balanceConfirmUrl}"
                                   style="display: inline-block; background-color: #246131; color: #FFFFFF; font-size: 14px; font-weight: 700; padding: 14px 26px; border-radius: 9999px; text-decoration: none;">
                                    ✓ Valider la réception du solde (${balanceFormatted} €)
                                </a>
                                <div style="margin-top: 12px; font-size: 11px; color: #666666; word-break: break-all;">
                                    Lien direct : <a href="${balanceConfirmUrl}" style="color: #246131;">${balanceConfirmUrl}</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center; font-size: 11px; color: #888888;">
                            Système de commande Traiteur Compère • Gardez cet e-mail jusqu'au règlement final
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    return { subject, html };
}

/**
 * E-mail court envoyé automatiquement au client dès validation du solde des 70 % (deposit_paid → fully_paid).
 */
export function generateBalancePaidEmail(
    order: FestiveOrderRecord,
    balancePaidAmount: number
): { subject: string; html: string } {
    const prenomClean = cleanCapitalize(order.prenom);
    const paidFormatted = formatPrice(balancePaidAmount);
    const subject = `Solde reçu — Votre commande Fêtes est intégralement réglée (N° ${order.id}) - Maison Compère`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 30px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                    <tr>
                        <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #1A1A1A; text-transform: uppercase;">
                                MAISON COMPÈRE
                            </h1>
                            <div style="margin-top: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777;">
                                Depuis 1821
                            </div>
                            <div style="width: 48px; height: 1px; background-color: #D4AF37; margin: 16px auto;"></div>
                            <div style="display: inline-block; background-color: #F2F8F3; border: 1px solid #B7D9BE; border-radius: 9999px; padding: 6px 18px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #246131;">
                                ✓ COMMANDE SOLDÉE • N° ${order.id}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 15px; color: #1A1A1A; line-height: 1.5;">
                                Bonjour <strong>${prenomClean}</strong>,
                            </p>

                            <div style="background-color: #F2F8F3; border: 1px solid #B7D9BE; border-radius: 10px; padding: 20px 22px; margin: 0 0 24px 0;">
                                <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #246131; margin-bottom: 6px;">
                                    ✓ SOLDE FINAL BIEN REÇU
                                </div>
                                <div style="font-size: 16px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px;">
                                    Nous confirmons la réception de votre solde de <span style="color: #246131;">${paidFormatted} €</span>.
                                </div>
                                <p style="margin: 0; font-size: 13px; color: #3D5242; line-height: 1.55;">
                                    Votre commande N° <strong>${order.id}</strong> est désormais intégralement soldée. Vous n'avez plus aucun montant à régler : tout sera prêt pour votre retrait !
                                </p>
                            </div>

                            <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 12px;">
                                    RAPPEL DE VOTRE RETRAIT À L'ATELIER
                                </div>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.55;">
                                    ${order.repas_date ? `
                                    <tr>
                                        <td style="padding: 4px 0; width: 38%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Date du repas :</td>
                                        <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600;">${order.repas_date}</td>
                                    </tr>` : ''}
                                    ${order.retrait_slot ? `
                                    <tr>
                                        <td style="padding: 5px 0; width: 38%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Créneau de retrait :</td>
                                        <td style="padding: 5px 0; color: #1A1A1A; font-weight: 600;">${String(order.retrait_slot).split(' | ').join('<br/>')}</td>
                                    </tr>` : ''}
                                    <tr>
                                        <td style="padding: 5px 0; width: 38%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Lieu de retrait :</td>
                                        <td style="padding: 5px 0; color: #1A1A1A;">
                                            ${LIEU_RETRAIT}
                                            <div style="margin-top: 4px;">
                                                <a href="${GOOGLE_MAPS_URL}" style="color: #B89327; font-size: 12px; text-decoration: none; font-weight: 600;">Itinéraire Google Maps →</a>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 20px 0 0 0; font-size: 13px; color: #666666; line-height: 1.5; text-align: center;">
                                À très bientôt à l'atelier ! Pour toute question, contactez-nous au <a href="tel:${ATELIER_TEL.replace(/\s+/g, '')}" style="color: #1A1A1A; font-weight: 600; text-decoration: none;">${ATELIER_TEL}</a>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 32px 32px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center;">
                            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #1A1A1A; text-transform: uppercase; margin-bottom: 6px;">
                                MAISON COMPÈRE
                            </div>
                            <div style="font-size: 12px; color: #777777; margin-bottom: 8px;">
                                ${LIEU_RETRAIT}, Belgique
                            </div>
                            <div style="font-size: 12px; color: #888888; font-style: italic;">
                                Toute l'équipe Traiteur Compère vous souhaite d'excellentes fêtes de fin d'année.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    return { subject, html };
}
