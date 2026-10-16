import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { MENU_DATA } from '../../data/plats-prepares';
import {
    MENUS_FETES_DATA,
    FORMULES_FETES,
    CARTE_FETES_ITEMS,
    calculateFestiveOrderPricing,
    isFestiveCartItem,
    FestiveValidationMode
} from '../../data/menus-fetes';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const {
            Nom, Prenom, Mail, Tel, Societe, Nom_Societe, Date: dateSoumission,
            dateEvenement, creneauRetrait, details_projet, captchaToken, cartItems, typeCommande,
            validationMode
        } = data;

        // 1. Validation de base des champs obligatoires
        if (!Nom || !Prenom || !Mail || !Tel) {
            return NextResponse.json({ success: false, error: 'Champs obligatoires manquants (Nom, Prénom, Email, Téléphone)' }, { status: 400 });
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Votre panier est vide' }, { status: 400 });
        }

        // 1.5 Validation reCAPTCHA côté serveur (sécurisée et non-bloquante si configuration incomplète)
        if (captchaToken && process.env.RECAPTCHA_SECRET_KEY) {
            try {
                const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
                });
                const recaptchaData = await verifyRes.json();
                if (!recaptchaData.success) {
                    console.warn("Avertissement validation reCAPTCHA Google :", recaptchaData);
                }
            } catch (captchaErr) {
                console.error("Erreur réseau reCAPTCHA (non bloquante) :", captchaErr);
            }
        } else if (!process.env.RECAPTCHA_SECRET_KEY) {
            console.warn("RECAPTCHA_SECRET_KEY absent sur le serveur - bypass de sécurité appliqué");
        }

        // 2. Sécurité : Recalculer le prix côté serveur pour éviter toute manipulation
        let finalTotalPrice = 0;
        let htmlCartDetails = '';
        let hasFestiveItem = false;

        const isOrderFestiveContext = typeCommande === 'menus_fetes' ||
            typeCommande === 'menu_fetes' ||
            cartItems.some(i => isFestiveCartItem(i));

        const cleanDishTitle = (raw: any): string => {
            let str = String(raw || '').trim();
            const colonIdx = str.indexOf(':');
            if (colonIdx !== -1) {
                str = str.substring(colonIdx + 1).trim();
            }
            return str.replace(/^[•\-\*]\s*/, '').trim();
        };

        const cleanCapitalize = (str: string): string => {
            if (!str) return '';
            const trimmed = String(str).trim();
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        };

        for (const item of cartItems) {
            const isFestive = isFestiveCartItem(item) || isOrderFestiveContext;
            const itemQty = Number(item.quantitePlat) || 1;
            const itemNom = String(item.nomPlat || '');

            if (isFestive) {
                hasFestiveItem = true;
                const formule = FORMULES_FETES.find(f => (item.id && item.id.startsWith(f.id)) || f.title.toLowerCase() === itemNom.toLowerCase());
                const carteItem = CARTE_FETES_ITEMS.find(c => c.id === item.id || (item.id && item.id.replace(/^carte-/, '') === c.id) || c.title.toLowerCase() === itemNom.toLowerCase());
                const festiveMenu = MENUS_FETES_DATA.find(m => m.id === item.id || (item.id && item.id.startsWith(m.id)) || m.title.toLowerCase() === itemNom.toLowerCase());

                const unitPrice = formule ? formule.price : (carteItem ? carteItem.price : (festiveMenu ? festiveMenu.price : (Number(item.prixUnitairePlat) || 49)));
                const itemTotal = unitPrice * itemQty;
                finalTotalPrice += itemTotal;

                let dishes: string[] = [];
                if (item.coursesSummary && Array.isArray(item.coursesSummary) && item.coursesSummary.length > 0) {
                    dishes = item.coursesSummary.map(cleanDishTitle).filter(Boolean);
                } else if (item.coursesDescription) {
                    dishes = [String(item.coursesDescription).trim()];
                } else if (festiveMenu && festiveMenu.courses) {
                    dishes = [
                        festiveMenu.courses.entrees?.[0]?.title,
                        festiveMenu.courses.potages?.[0]?.title,
                        festiveMenu.courses.plats?.[0]?.title,
                        festiveMenu.courses.desserts?.[0]?.title
                    ].filter(Boolean) as string[];
                }

                const coursesHtml = dishes.length > 0 ? `
                    <ul style="margin: 6px 0 0 0; padding: 0 0 0 14px; list-style-type: none; font-size: 12px; color: #555555; line-height: 1.55;">
                        ${dishes.map(d => `<li style="margin-bottom: 2px;"><span style="color: #D4AF37; margin-right: 6px;">•</span>${d}</li>`).join('')}
                    </ul>
                ` : '';

                htmlCartDetails += `
                    <tr>
                        <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; vertical-align: top;">
                            <div style="font-size: 13px; font-weight: bold; color: #1A1A1A;">
                                ${itemNom || 'Menu de Fêtes'} <span style="font-weight: normal; color: #777777; font-size: 12px;">(${unitPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €)</span>
                            </div>
                            ${coursesHtml}
                        </td>
                        <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; text-align: center; font-weight: bold; font-size: 13px; color: #1A1A1A; vertical-align: top;">
                            ${itemQty}
                        </td>
                        <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; text-align: right; font-weight: bold; font-size: 13px; color: #1A1A1A; vertical-align: top; white-space: nowrap;">
                            ${itemTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                `;
            } else {
                // Plats Préparés classiques
                const weekData = MENU_DATA.find(m => m.id === item.semaineId);
                const dayData = weekData?.days.find(d => d.day.toLowerCase() === (item.jour || '').toLowerCase());

                const pricePlat = dayData ? parseFloat(dayData.price.replace(',', '.').replace(' €', '')) : (Number(item.prixUnitairePlat) || 12);
                const pricePotage = 4;
                const totalSoupes = Object.values(item.soupes || {}).reduce((a: any, b: any) => a + (Number(b) || 0), 0) as number;

                const itemTotal = (pricePlat * itemQty) + (totalSoupes * pricePotage);
                finalTotalPrice += itemTotal;

                const soupesEntries = item.soupes ? Object.entries(item.soupes).filter(([_, q]) => Number(q) > 0) : [];
                const soupesHtml = soupesEntries.length > 0 ? `
                    <ul style="margin: 6px 0 0 0; padding: 0 0 0 14px; list-style-type: none; font-size: 12px; color: #555555; line-height: 1.55;">
                        ${soupesEntries.map(([s, q]) => `<li style="margin-bottom: 2px;"><span style="color: #D4AF37; margin-right: 6px;">•</span>${q}x ${s}</li>`).join('')}
                    </ul>
                ` : '';

                htmlCartDetails += `
                    <tr>
                        <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; vertical-align: top;">
                            <div style="font-size: 13px; font-weight: bold; color: #1A1A1A;">
                                ${dayData?.meal || itemNom}
                            </div>
                            <div style="font-size: 11px; color: #777777; margin-top: 2px;">
                                ${dayData?.day || item.jour || 'Plat du jour'}
                            </div>
                            ${soupesHtml}
                        </td>
                        <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; text-align: center; font-weight: bold; font-size: 13px; color: #1A1A1A; vertical-align: top;">
                            ${itemQty}
                        </td>
                        <td style="padding: 12px 14px; border-bottom: 1px solid #EFECE6; text-align: right; font-weight: bold; font-size: 13px; color: #1A1A1A; vertical-align: top; white-space: nowrap;">
                            ${itemTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                `;
            }
        }

        const isFestiveOrder = isOrderFestiveContext || hasFestiveItem;
        const orderTitle = isFestiveOrder ? 'Menus de Fêtes 2026' : 'Plats Préparés';

        // Génère un numéro unique à 5 chiffres (préfixé NOEL- pour les fêtes)
        const randomDigits = Math.floor(Math.random() * 90000) + 10000;
        const formattedOrderNumber = isFestiveOrder ? `NOEL-${randomDigits}` : String(randomDigits);

        // Informations bancaires officielles
        const IBAN = "BE22 0689 4683 8447";
        const BIC = "GKCCBEBB";
        const BENEFICIAIRE = "JEAN COMPERE";
        const cleanNom = String(Nom || '').trim().toUpperCase();
        const cleanPrenom = String(Prenom || '').trim().toUpperCase();
        const isAcompteMode = isFestiveOrder && validationMode === 'acompte_30';
        const COMMUNICATION = isFestiveOrder
            ? `${formattedOrderNumber} - ${isAcompteMode ? 'ACOMPTE 30%' : 'TOTAL 100%'} - ${cleanNom} ${cleanPrenom}`
            : `COMMANDE #${formattedOrderNumber} ${cleanNom} ${cleanPrenom}`;

        // Calcul tarifaire certifié côté serveur (Early Bird -5% et acompte 30% / 100%)
        const festivePricing = calculateFestiveOrderPricing(
            cartItems,
            (validationMode as FestiveValidationMode) || 'totalite_100',
            new Date()
        );

        const amountToPayNow = isFestiveOrder ? Number(festivePricing.amountToPayNow || 0) : Number(finalTotalPrice || 0);
        const totalNetPrice = isFestiveOrder ? Number(festivePricing.totalNet || 0) : Number(finalTotalPrice || 0);

        // Totalisation de la production cuisine pour le traiteur
        const kitchenTotals: Record<string, { category: string; count: number }> = {};
        const recordKitchenDish = (dishName: any, category: string, qty: number) => {
            if (!dishName) return;
            const cleanName = String(dishName).trim();
            if (!cleanName) return;
            if (!kitchenTotals[cleanName]) {
                kitchenTotals[cleanName] = { category, count: 0 };
            }
            kitchenTotals[cleanName].count += (Number(qty) || 1);
        };

        for (const item of cartItems) {
            const isFestive = isFestiveCartItem(item) || isFestiveOrder;
            const qty = Number(item.quantitePlat) || 1;

            if (isFestive) {
                if (item.coursesSummary && Array.isArray(item.coursesSummary) && item.coursesSummary.length > 0) {
                    for (const courseStr of item.coursesSummary) {
                        const str = String(courseStr || '');
                        const colonIdx = str.indexOf(':');
                        if (colonIdx !== -1) {
                            const category = str.substring(0, colonIdx).trim();
                            const dish = str.substring(colonIdx + 1).trim();
                            recordKitchenDish(dish, category, qty);
                        } else {
                            recordKitchenDish(str, 'Choix menu', qty);
                        }
                    }
                } else {
                    recordKitchenDish(item.nomPlat || 'Mets de fête', item.badge || 'À la carte', qty);
                }
            }
        }

        const kitchenRowsHTML = Object.entries(kitchenTotals)
            .sort((a, b) => a[1].category.localeCompare(b[1].category) || a[0].localeCompare(b[0]))
            .map(([dish, info]) => `
                <tr>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #EFECE6; font-size: 11px; color: #777777; font-weight: bold; text-transform: uppercase;">${info.category}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #EFECE6; font-size: 13px; color: #1A1A1A;">${dish}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #EFECE6; font-size: 14px; font-weight: bold; text-align: right; color: #B89327;">${info.count}</td>
                </tr>
            `).join('');

        const kitchenSummaryTableHTML = isFestiveOrder && Object.keys(kitchenTotals).length > 0 ? `
            <div style="margin-top: 28px; border: 1px solid #E8E2D5; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;">
                <div style="background-color: #F7F5F0; border-bottom: 1px solid #E8E2D5; padding: 10px 14px;">
                    <span style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327;">TOTALISATION DE LA PRODUCTION CUISINE</span>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <thead>
                        <tr style="background-color: #FAF9F6; border-bottom: 1px solid #EFECE6;">
                            <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #666666; font-weight: 700; width: 25%; text-transform: uppercase;">Poste</th>
                            <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #666666; font-weight: 700; text-transform: uppercase;">Préparation / Plat</th>
                            <th style="padding: 8px 12px; text-align: right; font-size: 11px; color: #666666; font-weight: 700; width: 20%; text-transform: uppercase;">Portions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${kitchenRowsHTML}
                    </tbody>
                </table>
            </div>
        ` : '';

        const tableFooterHTML = isFestiveOrder ? `
            <tfoot>
                ${festivePricing.isEarlyBirdEligible && festivePricing.discountAmount > 0 ? `
                    <tr>
                        <td colspan="2" style="padding: 10px 14px 4px 14px; text-align: right; font-size: 13px; color: #666666;">Sous-total brut :</td>
                        <td style="padding: 10px 14px 4px 14px; text-align: right; font-size: 13px; color: #1A1A1A; white-space: nowrap;">${(festivePricing.rawTotal || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 4px 14px 8px 14px; text-align: right; font-size: 12px; color: #B89327; font-weight: bold;">
                            Avantage réservation anticipée (-5%) :
                        </td>
                        <td style="padding: 4px 14px 8px 14px; text-align: right; font-size: 12px; color: #B89327; font-weight: bold; white-space: nowrap;">
                            - ${(festivePricing.discountAmount || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                ` : ''}
                <tr style="border-top: 1px solid #E8E2D5;">
                    <td colspan="2" style="padding: 12px 14px; text-align: right; font-size: 14px; font-weight: bold; color: #1A1A1A;">Total final TTC :</td>
                    <td style="padding: 12px 14px; text-align: right; font-size: 16px; font-weight: bold; color: #1A1A1A; white-space: nowrap;">${(festivePricing.totalNet || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                </tr>
                ${festivePricing.validationMode === 'acompte_30' ? `
                    <tr style="background-color: #FAF6EB;">
                        <td colspan="2" style="padding: 10px 14px; text-align: right; font-size: 13px; font-weight: bold; color: #8A6D1F; border-top: 1px solid #E8D8A6;">
                            Acompte de 30 % à verser sous 48h :
                        </td>
                        <td style="padding: 10px 14px; text-align: right; font-size: 16px; color: #B89327; font-weight: bold; border-top: 1px solid #E8D8A6; white-space: nowrap;">
                            ${(festivePricing.depositAmount || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 6px 14px 10px 14px; text-align: right; font-size: 11px; color: #777777;">Solde restant (au plus tard 7 jours avant le retrait) :</td>
                        <td style="padding: 6px 14px 10px 14px; text-align: right; font-size: 11px; color: #777777; white-space: nowrap;">${(festivePricing.remainingBalance || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                    </tr>
                ` : `
                    <tr style="background-color: #FAF6EB;">
                        <td colspan="2" style="padding: 10px 14px; text-align: right; font-size: 13px; font-weight: bold; color: #8A6D1F; border-top: 1px solid #E8D8A6;">
                            Montant total (100 %) à verser sous 48h :
                        </td>
                        <td style="padding: 10px 14px; text-align: right; font-size: 16px; color: #B89327; font-weight: bold; border-top: 1px solid #E8D8A6; white-space: nowrap;">
                            ${(festivePricing.totalNet || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                `}
            </tfoot>
        ` : `
            <tfoot>
                <tr style="border-top: 1px solid #E8E2D5;">
                    <td colspan="2" style="padding: 12px 14px; text-align: right; font-size: 14px; font-weight: bold; color: #1A1A1A;">Total TTC :</td>
                    <td style="padding: 12px 14px; text-align: right; font-size: 16px; font-weight: bold; color: #1A1A1A; white-space: nowrap;">${finalTotalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                </tr>
            </tfoot>
        `;

        const cartTableHTML = `
            <div style="border: 1px solid #EFECE6; border-radius: 8px; overflow: hidden; margin: 12px 0 24px 0; background-color: #FFFFFF;">
                <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <thead>
                        <tr style="background-color: #F7F5F0; border-bottom: 1px solid #E8E2D5;">
                            <th style="width: 65%; padding: 10px 14px; text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #666666; font-weight: 700;">Article &amp; Composition</th>
                            <th style="width: 15%; padding: 10px 14px; text-align: center; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #666666; font-weight: 700;">Qté</th>
                            <th style="width: 20%; padding: 10px 14px; text-align: right; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #666666; font-weight: 700;">Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlCartDetails}
                    </tbody>
                    ${tableFooterHTML}
                </table>
            </div>
        `;

        // 3. Préparation et envoi des emails via Resend (Sécurisé et non-bloquant)
        if (resend) {
            try {
                const fromAddress = 'Traiteur Compère <contact@traiteur-compere.be>';
                const traiteurEmail = process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com';

                // Email au Traiteur (Atelier)
                const { error: errTraiteur } = await resend.emails.send({
                    from: fromAddress,
                    to: traiteurEmail,
                    replyTo: Mail,
                    subject: `[${formattedOrderNumber}] ${isFestiveOrder ? 'COMMANDE FETES' : 'COMMANDE PLATS'} - ${cleanNom} ${cleanPrenom} - ${dateSoumission || dateEvenement || 'Fêtes'}`,
                    html: `
                        <!DOCTYPE html>
                        <html lang="fr">
                        <head>
                            <meta charset="utf-8">
                            <title>Commande Atelier - ${formattedOrderNumber}</title>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 30px 12px;">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                                            <!-- EN-TETE ATELIER -->
                                            <tr>
                                                <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #B89327; margin-bottom: 6px;">
                                                        COMMANDE ATELIER
                                                    </div>
                                                    <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; letter-spacing: 2px; color: #1A1A1A; text-transform: uppercase;">
                                                        NOUVELLE COMMANDE ${orderTitle.toUpperCase()}
                                                    </h1>
                                                    <div style="margin-top: 12px; display: inline-block; background-color: #F7F5F0; border: 1px solid #E8E2D5; border-radius: 9999px; padding: 5px 16px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #1A1A1A;">
                                                        RÉFÉRENCE • ${formattedOrderNumber}
                                                    </div>
                                                </td>
                                            </tr>

                                            <!-- CORPS ATELIER -->
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <!-- BLOC INFOS CLIENT -->
                                                    <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
                                                        <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 12px;">
                                                            COORDONNÉES CLIENT &amp; MODALITÉS
                                                        </div>
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.6;">
                                                            <tr>
                                                                <td style="padding: 2px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Client :</td>
                                                                <td style="padding: 2px 0; color: #1A1A1A; font-weight: 700;">${Nom} ${Prenom}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 2px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Email :</td>
                                                                <td style="padding: 2px 0; color: #1A1A1A;"><a href="mailto:${Mail}" style="color: #1A1A1A; text-decoration: none;">${Mail}</a></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 2px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Téléphone :</td>
                                                                <td style="padding: 2px 0; color: #1A1A1A;"><a href="tel:${Tel}" style="color: #1A1A1A; text-decoration: none; font-weight: 600;">${Tel}</a></td>
                                                            </tr>
                                                            ${Societe === 'Oui' ? `
                                                            <tr>
                                                                <td style="padding: 2px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Société :</td>
                                                                <td style="padding: 2px 0; color: #1A1A1A; font-weight: 600;">${Nom_Societe || 'Oui'}</td>
                                                            </tr>` : ''}
                                                            ${dateEvenement ? `
                                                            <tr>
                                                                <td style="padding: 4px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Date du repas :</td>
                                                                <td style="padding: 4px 0; color: #B89327; font-weight: 700;">${dateEvenement}</td>
                                                            </tr>` : ''}
                                                            ${creneauRetrait ? `
                                                            <tr>
                                                                <td style="padding: 4px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Retrait à l'atelier :</td>
                                                                <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600; line-height: 1.45;">${String(creneauRetrait).split(' | ').join('<br/>')}</td>
                                                            </tr>` : ''}
                                                            <tr>
                                                                <td style="padding: 2px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Date de saisie :</td>
                                                                <td style="padding: 2px 0; color: #555555;">${dateSoumission || new Date().toLocaleDateString('fr-BE')}</td>
                                                            </tr>
                                                            ${isFestiveOrder ? `
                                                            <tr>
                                                                <td style="padding: 4px 0; width: 35%; color: #777777; font-size: 11px; text-transform: uppercase; font-weight: 600;">Mode choisi :</td>
                                                                <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600;">
                                                                    ${festivePricing.validationMode === 'acompte_30'
                                                                        ? `Acompte 30% (${(festivePricing.depositAmount || 0).toFixed(2)} €) — Solde dû : ${(festivePricing.remainingBalance || 0).toFixed(2)} €`
                                                                        : `Totalité 100% (${(festivePricing.totalNet || 0).toFixed(2)} €)`}
                                                                </td>
                                                            </tr>` : ''}
                                                        </table>
                                                    </div>

                                                    <!-- DETAIL DU PANIER -->
                                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 8px;">
                                                        DÉTAIL DU PANIER
                                                    </div>
                                                    ${cartTableHTML}

                                                    <!-- PRODUCTION CUISINE -->
                                                    ${kitchenSummaryTableHTML}

                                                    ${details_projet ? `
                                                    <div style="background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 8px; padding: 16px; margin-top: 24px;">
                                                        <div style="font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #B89327; margin-bottom: 6px;">
                                                            REMARQUES DU CLIENT / ALLERGIES
                                                        </div>
                                                        <div style="font-size: 13px; color: #1A1A1A; line-height: 1.5; white-space: pre-line;">${details_projet}</div>
                                                    </div>` : ''}
                                                </td>
                                            </tr>

                                            <!-- PIED ATELIER -->
                                            <tr>
                                                <td style="padding: 18px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center; font-size: 11px; color: #888888;">
                                                    Système de commande Traiteur Compère • Atelier Rue Potay 3, Saint-Georges-sur-Meuse
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `
                });

                if (errTraiteur) {
                    console.error("Erreur Resend email traiteur :", errTraiteur);
                }

                // Email au Client (Maison Compère — Raffiné et Gastronomique)
                const { error: errClient } = await resend.emails.send({
                    from: fromAddress,
                    to: Mail,
                    replyTo: 'contact@traiteur-compere.be',
                    subject: `Confirmation de votre réservation ${formattedOrderNumber} - Maison Compère`,
                    html: `
                        <!DOCTYPE html>
                        <html lang="fr">
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Confirmation de commande - Maison Compère</title>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5F0; padding: 30px 12px;">
                                <tr>
                                    <td align="center">
                                        <!-- CARTE CENTRALE -->
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E2D5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                                            <!-- EN-TETE MAISON COMPERE -->
                                            <tr>
                                                <td style="padding: 36px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F0ECE4;">
                                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #B89327; margin-bottom: 6px;">
                                                        MAISON DE BOUCHE
                                                    </div>
                                                    <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #1A1A1A; text-transform: uppercase;">
                                                        MAISON COMPÈRE
                                                    </h1>
                                                    <div style="margin-top: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777;">
                                                        Depuis 1821
                                                    </div>
                                                    <div style="width: 48px; height: 1px; background-color: #D4AF37; margin: 16px auto;"></div>
                                                    
                                                    <!-- BADGE STATUT -->
                                                    <div style="display: inline-block; background-color: #F7F5F0; border: 1px solid #E8E2D5; border-radius: 9999px; padding: 6px 18px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #1A1A1A;">
                                                        RÉSERVATION ENREGISTRÉE • N° ${formattedOrderNumber}
                                                    </div>
                                                </td>
                                            </tr>

                                            <!-- CORPS DU MESSAGE -->
                                            <tr>
                                                <td style="padding: 32px 32px 24px 32px;">
                                                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #1A1A1A; line-height: 1.5;">
                                                        Bonjour <strong>${cleanCapitalize(Prenom)}</strong>,
                                                    </p>
                                                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #555555; line-height: 1.6;">
                                                        Nous vous remercions chaleureusement pour votre commande. Votre réservation pour vos <strong>${orderTitle}</strong> a bien été enregistrée sous la référence <strong>${formattedOrderNumber}</strong>.
                                                    </p>

                                                    <!-- ENCART ACOMPTE (ACTION REQUISE) -->
                                                    <div style="background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 8px; padding: 20px; margin: 0 0 28px 0;">
                                                        <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 6px;">
                                                            VALIDATION SOUS RÉSERVE DE VIREMENT SOUS 48H
                                                        </div>
                                                        <div style="font-size: 15px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px;">
                                                            ${isFestiveOrder && festivePricing.validationMode === 'acompte_30'
                                                                ? `Acompte de 30 % : <span style="color: #B89327; font-size: 19px;">${(festivePricing.depositAmount || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>`
                                                                : `Règlement total : <span style="color: #B89327; font-size: 19px;">${amountToPayNow.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>`}
                                                        </div>
                                                        <p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.55;">
                                                            ${isFestiveOrder && festivePricing.validationMode === 'acompte_30'
                                                                ? `Le solde de <strong>${(festivePricing.remainingBalance || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> sera à régler au plus tard 7 jours avant le retrait. Vos convives restent ajustables jusqu'à 7 jours avant le retrait.`
                                                                : `Merci de bien vouloir effectuer votre virement intégral sous 48h afin de valider définitivement votre réservation.`}
                                                        </p>
                                                    </div>

                                                    <!-- RENDEZ-VOUS DE RETRAIT & MODALITES -->
                                                    <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 20px; margin: 0 0 28px 0;">
                                                        <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 14px;">
                                                            MODALITÉS DE RETRAIT
                                                        </div>
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.55;">
                                                            ${dateEvenement ? `
                                                            <tr>
                                                                <td style="padding: 4px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Date du repas :</td>
                                                                <td style="padding: 4px 0; color: #1A1A1A; font-weight: 600; vertical-align: top;">${dateEvenement}</td>
                                                            </tr>` : ''}
                                                            ${creneauRetrait ? `
                                                            <tr>
                                                                <td style="padding: 6px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Créneau de retrait :</td>
                                                                <td style="padding: 6px 0; color: #1A1A1A; font-weight: 600; vertical-align: top; line-height: 1.45;">${String(creneauRetrait).split(' | ').join('<br/>')}</td>
                                                            </tr>` : ''}
                                                            <tr>
                                                                <td style="padding: 6px 0; width: 38%; color: #777777; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; vertical-align: top; font-weight: 600;">Lieu de retrait :</td>
                                                                <td style="padding: 6px 0; color: #1A1A1A; vertical-align: top;">
                                                                    Rue Potay 3, 4470 Saint-Georges-sur-Meuse
                                                                    <div style="margin-top: 4px;">
                                                                        <a href="https://maps.google.com/?q=Traiteur+Compere,+Rue+Potay+3,+4470+Saint-Georges-sur-Meuse,+Belgique" style="color: #B89327; font-size: 12px; text-decoration: none; font-weight: 600;">Itinéraire Google Maps →</a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #E8E2D5; font-size: 12px; color: #666666; font-style: italic; line-height: 1.5;">
                                                            « Toutes les explications nécessaires pour un réchauffage et un dressage parfaits vous seront fournies lors du retrait. »
                                                        </div>
                                                    </div>

                                                    <!-- RECAPITULATIF DE LA TABLE -->
                                                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 8px;">
                                                        RÉCAPITULATIF DE VOTRE TABLE
                                                    </div>
                                                    ${cartTableHTML}

                                                    <!-- ENCART COORDONNEES BANCAIRES -->
                                                    <div style="background-color: #FBFBF9; border: 1px solid #EFECE6; border-radius: 8px; padding: 22px; margin: 28px 0 20px 0;">
                                                        <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 12px;">
                                                            COORDONNÉES BANCAIRES POUR VIREMENT
                                                        </div>
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

                                                        <!-- COMMUNICATION OBLIGATOIRE MISE EN EVIDENCE -->
                                                        <div style="margin-top: 14px; padding: 12px 14px; background-color: #FAF6EB; border: 1px solid #E8D8A6; border-radius: 6px;">
                                                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #B89327; margin-bottom: 4px;">
                                                                Communication obligatoire du virement :
                                                            </div>
                                                            <div style="font-family: monospace; font-size: 15px; font-weight: 700; color: #1A1A1A; letter-spacing: 0.5px;">
                                                                ${COMMUNICATION}
                                                            </div>
                                                        </div>

                                                        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #E8E2D5; font-size: 14px; color: #1A1A1A;">
                                                            <strong>Montant à verser sous 48h :</strong> <span style="font-size: 18px; font-weight: 700; color: #B89327;">${amountToPayNow.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                                        </div>
                                                    </div>

                                                    <p style="margin: 24px 0 0 0; font-size: 13px; color: #666666; line-height: 1.5; text-align: center;">
                                                        Pour toute question concernant votre commande, vous pouvez joindre notre atelier au <a href="tel:+32468385082" style="color: #1A1A1A; font-weight: 600; text-decoration: none;">+32 468 38 50 82</a> ou par retour de cet email.
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- PIED DE CARTE MAISON COMPERE -->
                                            <tr>
                                                <td style="padding: 24px 32px 32px 32px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; text-align: center;">
                                                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #1A1A1A; text-transform: uppercase; margin-bottom: 6px;">
                                                        MAISON COMPÈRE
                                                    </div>
                                                    <div style="font-size: 12px; color: #777777; margin-bottom: 12px;">
                                                        Rue Potay 3, 4470 Saint-Georges-sur-Meuse, Belgique
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
                    `
                });

                if (errClient) {
                    console.error("Erreur Resend email client :", errClient);
                }
            } catch (emailError) {
                console.error("Exception d'envoi d'email Resend (non bloquante) :", emailError);
            }
        } else {
            console.log("Mode dev ou RESEND_API_KEY non configurée. Commande enregistrée :", formattedOrderNumber, "Montant :", amountToPayNow);
        }

        return NextResponse.json({
            success: true,
            totalPrice: totalNetPrice,
            amountToPayNow: amountToPayNow,
            orderNumber: formattedOrderNumber,
            message: 'Commande enregistrée avec succès'
        });

    } catch (error: any) {
        console.error("Erreur critique lors de la création de la commande :", error);
        return NextResponse.json({
            success: false,
            error: error?.message || 'Erreur interne du serveur lors de la validation de la commande'
        }, { status: 500 });
    }
}
