import type { FestiveOrderRecord, FestiveOrderItem } from './db';

export const IBAN = "BE22 0689 4683 8447";
export const BIC = "GKCCBEBB";
export const BENEFICIAIRE = "JEAN COMPERE";
export const LIEU_RETRAIT = "Rue Potay 3, 4470 Saint-Georges-sur-Meuse";
export const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Traiteur+Compere,+Rue+Potay+3,+4470+Saint-Georges-sur-Meuse,+Belgique";
export const ATELIER_TEL = "+32 468 38 50 82";

/**
 * Analyse la date du repas (stockée sous forme de chaîne ISO ou texte en français)
 * Exemples supportés : "2026-12-24", "Jeudi 24 Décembre 2026", "24 Décembre", "1er Janvier 2027"
 */
export function parseRepasDate(repasDateStr: string): Date | null {
    if (!repasDateStr) return null;
    const str = repasDateStr.trim();

    // 1. Format ISO : YYYY-MM-DD
    const isoMatch = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
        return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]), 12, 0, 0);
    }

    // 2. Format français textuel : "Jeudi 24 Décembre 2026", "24 Décembre", "1er Janvier 2027", etc.
    const frMatch = str.match(/(?:1er|\d{1,2})\s*(décembre|decembre|janvier)(?:\s*(\d{4}))?/i);
    if (frMatch) {
        const isPremier = /1er/i.test(frMatch[0]);
        const dayNumberMatch = str.match(/\d{1,2}/);
        const day = isPremier ? 1 : (dayNumberMatch ? Number(dayNumberMatch[0]) : 1);
        const monthStr = frMatch[1].toLowerCase();
        const year = frMatch[2] ? Number(frMatch[2]) : (monthStr.includes('janv') ? 2027 : 2026);
        const month = monthStr.includes('janv') ? 0 : 11;
        return new Date(year, month, day, 12, 0, 0);
    }

    // 3. Fallback standard Date.parse
    const parsed = Date.parse(str);
    if (!isNaN(parsed)) {
        const d = new Date(parsed);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
    }

    return null;
}

/**
 * Calcule la date effective de retrait selon le créneau sélectionné :
 * - Si le créneau mentionne "veille" : la date effective est la veille du repas
 * - Sinon : le jour même du repas
 */
export function getEffectivePickupDate(mealDate: Date, retraitSlot?: string): Date {
    const pickup = new Date(mealDate);
    if (retraitSlot && /veille/i.test(retraitSlot)) {
        pickup.setDate(pickup.getDate() - 1);
    }
    return pickup;
}

/**
 * Calcule le nombre exact de jours calendaires entre une date cible et une date de référence
 * (Indépendant de l'heure)
 */
export function getDiffCalendarDays(target: Date, reference: Date = new Date()): number {
    const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
    const refUtc = Date.UTC(reference.getFullYear(), reference.getMonth(), reference.getDate());
    return Math.round((targetUtc - refUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Détermine si une commande est éligible au rappel J-10
 */
export function isOrderDueForReminder(
    order: FestiveOrderRecord,
    referenceDate: Date = new Date(),
    options: { allowCatchUp?: boolean } = {}
): { isDue: boolean; diffPickup: number | null; diffMeal: number | null; reason: string } {
    if (order.reminder_sent_at) {
        return { isDue: false, diffPickup: null, diffMeal: null, reason: 'Rappel déjà envoyé le ' + order.reminder_sent_at };
    }

    const mealDate = parseRepasDate(order.repas_date);
    if (!mealDate) {
        return { isDue: false, diffPickup: null, diffMeal: null, reason: 'Date de repas non interprétable (' + order.repas_date + ')' };
    }

    const pickupDate = getEffectivePickupDate(mealDate, order.retrait_slot);
    const diffPickup = getDiffCalendarDays(pickupDate, referenceDate);
    const diffMeal = getDiffCalendarDays(mealDate, referenceDate);

    // Exactement 10 jours avant le retrait effectif OU 10 jours avant le repas
    const isExactJ10 = (diffPickup === 10 || diffMeal === 10);

    // En mode rattrapage optionnel : commandes dont le retrait est dans 10 jours ou moins (mais pas dépassé)
    const isCatchUp = options.allowCatchUp && (diffPickup <= 10 && diffPickup >= 0);

    const isDue = isExactJ10 || Boolean(isCatchUp);

    return {
        isDue,
        diffPickup,
        diffMeal,
        reason: isDue ? 'Éligible J-10' : `Hors cible (J-${diffPickup} retrait, J-${diffMeal} repas)`
    };
}

export function formatPrice(amount: number): string {
    return (amount || 0).toLocaleString('fr-BE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function cleanCapitalize(str: string): string {
    if (!str) return '';
    const trimmed = String(str).trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Génère le tableau HTML récapitulatif des mets commandés
 */
export function renderOrderItemsTable(items: FestiveOrderItem[], additionalItems?: FestiveOrderItem[]): string {
    const combined = [...(items || []), ...(additionalItems || [])];
    if (combined.length === 0) {
        return '<p style="color: #777777; font-size: 13px; font-style: italic;">Détail des mets consultable dans votre espace de gestion.</p>';
    }

    const rows = combined.map(it => {
        const title = it.nomPlat || it.title || it.nom || 'Mets de fête';
        const qty = Number(it.quantitePlat || it.quantite || it.qty || 1);
        let summary = '';
        if (it.coursesSummary && Array.isArray(it.coursesSummary) && it.coursesSummary.length > 0) {
            summary = it.coursesSummary.join(' • ');
        } else if (it.coursesDescription) {
            summary = String(it.coursesDescription);
        }

        return `
            <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #EFECE6; font-size: 13px; color: #1A1A1A; vertical-align: top;">
                    <strong style="color: #1A1A1A;">${title}</strong>
                    ${summary ? `<div style="font-size: 11px; color: #777777; margin-top: 3px; line-height: 1.4;">${summary}</div>` : ''}
                </td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #EFECE6; text-align: center; font-weight: 700; font-size: 13px; color: #1A1A1A; vertical-align: top; width: 80px;">
                    × ${qty}
                </td>
            </tr>
        `;
    }).join('');

    return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E8E2D5; border-radius: 8px; margin: 12px 0 24px 0; border-collapse: collapse; overflow: hidden;">
            <thead>
                <tr style="background-color: #FAF9F6; border-bottom: 1px solid #E8E2D5;">
                    <th style="padding: 9px 14px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #777777;">Mets / Formule</th>
                    <th style="padding: 9px 14px; text-align: center; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #777777;">Quantité</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

/**
 * 1. Template Email Rappel Solde (acompte_30 avec solde restant)
 */
export function generateReminderEmailAcompte(order: FestiveOrderRecord, baseUrl: string = 'https://www.traiteur-compere.be'): { subject: string; html: string } {
    const subject = `Votre réveillon approche : pensez à solder votre commande Traiteur Compère (N° ${order.id})`;
    const balanceFormatted = formatPrice(order.balance_remaining);
    const prenomClean = cleanCapitalize(order.prenom);
    const orderManagementUrl = `${baseUrl.replace(/\/$/, '')}/gestion-commande?order=${encodeURIComponent(order.id)}&email=${encodeURIComponent(order.email)}`;
    const communicationSolde = `${order.id} - SOLDE FINAL`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 32px 12px;">
        <tr>
            <td align="center">
                <!-- CARTE CENTRALE -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                    <!-- EN-TETE MAISON COMPERE -->
                    <tr>
                        <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #1A1A1A; text-transform: uppercase;">
                                MAISON COMPÈRE
                            </h1>
                            <div style="margin-top: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777;">
                                Depuis 1821
                            </div>
                            <div style="width: 48px; height: 1px; background-color: #D4AF37; margin: 16px auto;"></div>
                            
                            <!-- BADGE ÉCHÉANCE J-10 -->
                            <div style="display: inline-block; background-color: #FAF6EB; border: 1px solid #D4AF37; border-radius: 9999px; padding: 6px 18px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #8A6D1F;">
                                RAPPEL ÉCHÉANCE • J-10 • COMMANDE N° ${order.id}
                            </div>
                        </td>
                    </tr>

                    <!-- CORPS DU MESSAGE -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #1A1A1A; line-height: 1.5;">
                                Bonjour <strong>${prenomClean}</strong>,
                            </p>
                            <p style="margin: 0 0 24px 0; font-size: 14px; color: #444444; line-height: 1.6;">
                                Votre réveillon approche à grands pas ! Dans <strong>10 jours</strong>, nous aurons le plaisir de vous accueillir pour la remise de vos mets de fêtes préparés par notre brigade.
                            </p>

                            <!-- ENCART SOLDE RESTANT & BOUTON ACTION DIRECT -->
                            <div style="background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 10px; padding: 24px; margin: 0 0 26px 0; text-align: center;">
                                <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8A6D1F; margin-bottom: 6px;">
                                    SOLDE RESTANT EN ATTENTE DE RÈGLEMENT
                                </div>
                                <div style="font-size: 32px; font-weight: 800; color: #B89327; margin: 4px 0 12px 0;">
                                    ${balanceFormatted} €
                                </div>
                                <p style="margin: 0 0 20px 0; font-size: 13px; color: #555555; line-height: 1.55; max-width: 480px; margin-left: auto; margin-right: auto;">
                                    Pour assurer une organisation irréprochable et un retrait fluide le jour J, pensez à régler votre solde dès aujourd'hui. 
                                    <strong>Le nombre de convives et vos mets restent ajustables jusqu'à 7 jours avant le retrait.</strong>
                                </p>

                                <!-- BOUTON DORÉ DIRECT -->
                                <div>
                                    <a href="${orderManagementUrl}" 
                                       style="display: inline-block; background-color: #D4AF37; color: #1A1A1A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 12px rgba(212,175,55,0.35);">
                                        Accéder à ma commande &amp; Régler mon solde (${balanceFormatted} €) →
                                    </a>
                                </div>
                            </div>

                            <!-- MODALITÉS DE RETRAIT -->
                            <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 20px; margin: 0 0 26px 0;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 14px;">
                                    RAPPEL DE VOS MODALITÉS DE RETRAIT
                                </div>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.55;">
                                    ${order.repas_date ? `
                                    <tr>
                                        <td style="padding: 5px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Date du repas :</td>
                                        <td style="padding: 5px 0; color: #1A1A1A; font-weight: 600; vertical-align: top;">${order.repas_date}</td>
                                    </tr>` : ''}
                                    ${order.retrait_slot ? `
                                    <tr>
                                        <td style="padding: 6px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Créneau de retrait :</td>
                                        <td style="padding: 6px 0; color: #1A1A1A; font-weight: 600; vertical-align: top; line-height: 1.45;">${order.retrait_slot}</td>
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
                            </div>

                            <!-- COORDONNÉES BANCAIRES POUR VIREMENT DU SOLDE -->
                            <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 22px; margin: 0 0 24px 0;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 12px;">
                                    COORDONNÉES BANCAIRES POUR VIREMENT DU SOLDE
                                </div>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.6;">
                                    <tr>
                                        <td style="padding: 4px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">Bénéficiaire :</td>
                                        <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600;">${BENEFICIAIRE}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">IBAN :</td>
                                        <td style="padding: 5px 0;">
                                            <code style="font-family: monospace; font-size: 14px; font-weight: 700; color: #1A1A1A; background-color: #EDE8DF; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px;">${IBAN}</code>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">BIC :</td>
                                        <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600;">${BIC}</td>
                                    </tr>
                                </table>

                                <!-- COMMUNICATION OBLIGATOIRE DU VIREMENT -->
                                <div style="margin-top: 14px; padding: 12px 14px; background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 6px;">
                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #B89327; margin-bottom: 4px;">
                                        Communication obligatoire du virement :
                                    </div>
                                    <div style="font-family: monospace; font-size: 15px; font-weight: 700; color: #1A1A1A; letter-spacing: 0.5px;">
                                        ${communicationSolde}
                                    </div>
                                </div>
                            </div>

                            <p style="margin: 24px 0 0 0; font-size: 13px; color: #666666; line-height: 1.5; text-align: center;">
                                Une question ou une précision sur vos allergies ? Notre atelier est à votre écoute au <a href="tel:${ATELIER_TEL.replace(/\s+/g, '')}" style="color: #1A1A1A; font-weight: 600; text-decoration: none;">${ATELIER_TEL}</a> ou en réponse directe à ce message.
                            </p>
                        </td>
                    </tr>

                    <!-- PIED DE CARTE MAISON COMPERE -->
                    <tr>
                        <td style="padding: 24px 32px 32px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center;">
                            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #1A1A1A; text-transform: uppercase; margin-bottom: 6px;">
                                MAISON COMPÈRE
                            </div>
                            <div style="font-size: 12px; color: #777777; margin-bottom: 8px;">
                                ${LIEU_RETRAIT}, Belgique
                            </div>
                            <div style="font-size: 11px; color: #999999;">
                                Traiteur de Référence en Province de Liège • Depuis 1821
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
 * 2. Template Email Rappel Logistique (total_100 ou commande déjà soldée)
 */
export function generateReminderEmailSoldé(order: FestiveOrderRecord, baseUrl: string = 'https://www.traiteur-compere.be'): { subject: string; html: string } {
    const subject = `J-10 : Votre repas de fête se prépare chez Traiteur Compère (N° ${order.id})`;
    const prenomClean = cleanCapitalize(order.prenom);
    const orderManagementUrl = `${baseUrl.replace(/\/$/, '')}/gestion-commande?order=${encodeURIComponent(order.id)}&email=${encodeURIComponent(order.email)}`;
    const itemsTableHtml = renderOrderItemsTable(order.items, order.additional_items);

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 32px 12px;">
        <tr>
            <td align="center">
                <!-- CARTE CENTRALE -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                    <!-- EN-TETE MAISON COMPERE -->
                    <tr>
                        <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #1A1A1A; text-transform: uppercase;">
                                MAISON COMPÈRE
                            </h1>
                            <div style="margin-top: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777;">
                                Depuis 1821
                            </div>
                            <div style="width: 48px; height: 1px; background-color: #D4AF37; margin: 16px auto;"></div>
                            
                            <!-- BADGE STATUT SOLDÉ -->
                            <div style="display: inline-block; background-color: #F4F8F4; border: 1px solid #CBE2CB; border-radius: 9999px; padding: 6px 18px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #2D6A2E;">
                                COMMANDE SOLDÉE • J-10 • N° ${order.id}
                            </div>
                        </td>
                    </tr>

                    <!-- CORPS DU MESSAGE -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #1A1A1A; line-height: 1.5;">
                                Bonjour <strong>${prenomClean}</strong>,
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #444444; line-height: 1.6;">
                                À <strong>10 jours</strong> de votre réveillon, notre brigade culinaire s'active pour préparer vos commandes avec tout le soin et l'exigence artisanale qui font la renommée de la Maison Compère.
                            </p>

                            <!-- ENCART CONFIRMATION COMMANDE SOLDÉE -->
                            <div style="background-color: #F4F8F4; border: 1px solid #CBE2CB; border-radius: 8px; padding: 18px 20px; margin: 0 0 26px 0;">
                                <div style="display: flex; align-items: center;">
                                    <div style="font-size: 13px; font-weight: 700; color: #2D6A2E; letter-spacing: 0.5px; text-transform: uppercase;">
                                        ✓ Votre commande est intégralement confirmée et soldée
                                    </div>
                                </div>
                                <div style="font-size: 13px; color: #444444; margin-top: 6px; line-height: 1.5;">
                                    Aucune démarche financière n'est requise de votre part. Tout est prêt pour vous garantir un moment d'exception en famille et entre amis.
                                </div>
                            </div>

                            <!-- RÉCAPITULATIF DU MENU DE FÊTES -->
                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 8px;">
                                RAPPEL AMICAL DE VOTRE MENU DE FÊTES
                            </div>
                            ${itemsTableHtml}

                            <!-- RENDEZ-VOUS DE RETRAIT & INSTRUCTIONS -->
                            <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 22px; margin: 0 0 26px 0;">
                                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 14px;">
                                    MODALITÉS DE RETRAIT À L'ATELIER
                                </div>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.55;">
                                    ${order.repas_date ? `
                                    <tr>
                                        <td style="padding: 5px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Date du repas :</td>
                                        <td style="padding: 5px 0; color: #1A1A1A; font-weight: 600; vertical-align: top;">${order.repas_date}</td>
                                    </tr>` : ''}
                                    ${order.retrait_slot ? `
                                    <tr>
                                        <td style="padding: 6px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Créneau de retrait :</td>
                                        <td style="padding: 6px 0; color: #1A1A1A; font-weight: 600; vertical-align: top; line-height: 1.45;">${order.retrait_slot}</td>
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

                                <!-- MENTION RÉCHAUFFAGE ET DRESSAGE -->
                                <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #E8E2D5; font-size: 13px; color: #555555; font-style: italic; line-height: 1.55;">
                                    « Toutes les instructions précises de réchauffage et de dressage vous seront remises lors du retrait pour sublimer vos assiettes en toute sérénité. »
                                </div>
                            </div>

                            <!-- BOUTON ACCÈS SUIVI COMMANDE -->
                            <div style="text-align: center; margin: 0 0 24px 0;">
                                <a href="${orderManagementUrl}" 
                                   style="display: inline-block; background-color: #FAF6EB; border: 1px solid #D4AF37; color: #8A6D1F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px; border-radius: 9999px; text-decoration: none;">
                                    Consulter le récapitulatif complet de ma commande →
                                </a>
                            </div>

                            <p style="margin: 20px 0 0 0; font-size: 13px; color: #666666; line-height: 1.5; text-align: center;">
                                Notre atelier reste disponible pour toute question au <a href="tel:${ATELIER_TEL.replace(/\s+/g, '')}" style="color: #1A1A1A; font-weight: 600; text-decoration: none;">${ATELIER_TEL}</a>.
                            </p>
                        </td>
                    </tr>

                    <!-- PIED DE CARTE MAISON COMPERE -->
                    <tr>
                        <td style="padding: 24px 32px 32px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center;">
                            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #1A1A1A; text-transform: uppercase; margin-bottom: 6px;">
                                MAISON COMPÈRE
                            </div>
                            <div style="font-size: 12px; color: #777777; margin-bottom: 8px;">
                                ${LIEU_RETRAIT}, Belgique
                            </div>
                            <div style="font-size: 11px; color: #999999;">
                                Traiteur de Référence en Province de Liège • Depuis 1821
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
