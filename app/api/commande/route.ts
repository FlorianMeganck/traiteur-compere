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

        for (const item of cartItems) {
            const isFestive = isFestiveCartItem(item) || isOrderFestiveContext;
            const itemQty = Number(item.quantitePlat) || 1;
            const itemId = String(item.id || '').toLowerCase();
            const itemNom = String(item.nomPlat || '');

            if (isFestive) {
                hasFestiveItem = true;
                const formule = FORMULES_FETES.find(f => (item.id && item.id.startsWith(f.id)) || f.title.toLowerCase() === itemNom.toLowerCase());
                const carteItem = CARTE_FETES_ITEMS.find(c => c.id === item.id || (item.id && item.id.replace(/^carte-/, '') === c.id) || c.title.toLowerCase() === itemNom.toLowerCase());
                const festiveMenu = MENUS_FETES_DATA.find(m => m.id === item.id || (item.id && item.id.startsWith(m.id)) || m.title.toLowerCase() === itemNom.toLowerCase());

                const unitPrice = formule ? formule.price : (carteItem ? carteItem.price : (festiveMenu ? festiveMenu.price : (Number(item.prixUnitairePlat) || 49)));
                const itemTotal = unitPrice * itemQty;
                finalTotalPrice += itemTotal;

                let coursesList = '-';
                if (item.coursesSummary && Array.isArray(item.coursesSummary) && item.coursesSummary.length > 0) {
                    coursesList = item.coursesSummary.map((c: any) => {
                        const str = String(c || '');
                        const parts = str.split(':');
                        if (parts.length > 1) {
                            return `<strong>${parts[0].trim()} :</strong>${parts.slice(1).join(':')}`;
                        }
                        return `• ${str.trim()}`;
                    }).join('<br/>');
                } else if (item.coursesDescription) {
                    coursesList = `<em>${item.coursesDescription}</em>`;
                } else if (festiveMenu && festiveMenu.courses) {
                    coursesList = [
                        festiveMenu.courses.entrees?.[0] ? `<strong>Entrée :</strong> ${festiveMenu.courses.entrees[0].title}` : '',
                        festiveMenu.courses.potages?.[0] ? `<strong>Potage :</strong> ${festiveMenu.courses.potages[0].title}` : '',
                        festiveMenu.courses.plats?.[0] ? `<strong>Plat :</strong> ${festiveMenu.courses.plats[0].title}` : '',
                        festiveMenu.courses.desserts?.[0] ? `<strong>Dessert :</strong> ${festiveMenu.courses.desserts[0].title}` : ''
                    ].filter(Boolean).join('<br/>') || '-';
                }

                const isNoel = itemId.includes('noel') || itemId.includes('prestige') || itemNom.toLowerCase().includes('noël') || itemNom.toLowerCase().includes('noel');
                const isNouvelAn = itemId.includes('sylvestre') || itemNom.toLowerCase().includes('sylvestre') || itemNom.toLowerCase().includes('nouvel an');

                let itemPickupNotice = '';
                if (creneauRetrait && typeof creneauRetrait === 'string') {
                    if (creneauRetrait.includes(' | ')) {
                        const parts = creneauRetrait.split(' | ');
                        const noelPart = parts.find((p: string) => p.toLowerCase().includes('noël') || p.toLowerCase().includes('noel')) || parts[0] || '';
                        const naPart = parts.find((p: string) => p.toLowerCase().includes('nouvel an')) || parts[1] || '';

                        const cleanNoel = noelPart ? noelPart.replace(/^(Retrait\s+)?Noël\s*:\s*/i, '').replace(/^Retrait possible\s*:\s*/i, '') : '';
                        const cleanNa = naPart ? naPart.replace(/^(Retrait\s+)?Nouvel An\s*:\s*/i, '').replace(/^Retrait possible\s*:\s*/i, '') : '';

                        if (isNoel) {
                            itemPickupNotice = cleanNoel;
                        } else if (isNouvelAn) {
                            itemPickupNotice = cleanNa;
                        } else {
                            itemPickupNotice = cleanNoel || cleanNa;
                        }
                    } else {
                        itemPickupNotice = creneauRetrait.replace(/^Retrait possible\s*:\s*/i, '');
                    }
                } else {
                    itemPickupNotice = festiveMenu ? festiveMenu.badge : (item.badge || item.jour || '24 ou 31 Décembre');
                }

                htmlCartDetails += `
                    <tr>
                        <td style="width: 25%; padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top; word-break: break-word;">
                            <strong style="color: #000; font-size: 13px;">${itemNom || 'Menu de Fêtes'}</strong><br/>
                            <span style="color: #D4AF37; font-size: 11px; font-weight: bold;">${item.badge || 'Menu de Fêtes'}</span>
                        </td>
                        <td style="width: 8%; padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold; vertical-align: top;">${itemQty}</td>
                        <td style="width: 42%; padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; line-height: 1.45; vertical-align: top; word-break: break-word;">${coursesList}</td>
                        <td style="width: 15%; padding: 10px; border-bottom: 1px solid #ddd; font-size: 11px; color: #333; line-height: 1.35; vertical-align: top; word-break: break-word;"><strong>${itemPickupNotice}</strong></td>
                        <td style="width: 10%; padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; vertical-align: top; white-space: nowrap;">${itemTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
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

                const getPickupDay = (j: string) => {
                    const day = (j || '').toLowerCase();
                    if (day === 'lundi' || day === 'mardi') return 'Mardi après 11h';
                    if (day === 'mercredi' || day === 'jeudi') return 'Jeudi après 11h';
                    if (day === 'vendredi' || day === 'samedi') return 'Samedi après 11h';
                    return j || 'À convenir';
                };
                const jourRetrait = getPickupDay(item.jour);

                const soupesList = item.soupes ? Object.entries(item.soupes)
                    .filter(([_, q]) => Number(q) > 0)
                    .map(([s, q]) => `${q}x ${s}`)
                    .join('<br/>') : '-';

                htmlCartDetails += `
                    <tr>
                        <td style="width: 25%; padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top; word-break: break-word;">
                            <strong style="color: #000; font-size: 13px;">${dayData?.meal || itemNom}</strong><br/>
                            <span style="color: #666; font-size: 11px;">${dayData?.day || item.jour}</span>
                        </td>
                        <td style="width: 8%; padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold; vertical-align: top;">${itemQty}</td>
                        <td style="width: 42%; padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; line-height: 1.45; vertical-align: top; word-break: break-word;">${soupesList || '-'}</td>
                        <td style="width: 15%; padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; color: #D4AF37; font-weight: bold; vertical-align: top;">${jourRetrait}</td>
                        <td style="width: 10%; padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; vertical-align: top; white-space: nowrap;">${itemTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
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
        const COMMUNICATION = isFestiveOrder
            ? `${formattedOrderNumber} - ${cleanNom} ${cleanPrenom}`
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
                    <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 12px; color: #666; font-weight: bold;">${info.category}</td>
                    <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 13px; color: #111;">${dish}</td>
                    <td style="padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; text-align: right; color: #D4AF37;">${info.count}</td>
                </tr>
            `).join('');

        const kitchenSummaryTableHTML = isFestiveOrder && Object.keys(kitchenTotals).length > 0 ? `
            <div style="margin-top: 25px; border: 2px solid #000; border-radius: 8px; overflow: hidden; background: #fff;">
                <div style="background: #000; color: #D4AF37; padding: 10px 14px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
                    🔪 Totalisation de la Production Cuisine
                </div>
                <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                    <thead>
                        <tr style="background-color: #f7f7f7; border-bottom: 2px solid #ddd;">
                            <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #555; width: 25%;">Poste</th>
                            <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #555;">Préparation / Plat</th>
                            <th style="padding: 8px 10px; text-align: right; font-size: 12px; color: #555; width: 20%;">Total Portions</th>
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
                        <td colspan="4" style="padding: 8px 10px; text-align: right; font-size: 13px; color: #555;">Sous-total brut :</td>
                        <td style="padding: 8px 10px; text-align: right; font-size: 13px; color: #333; white-space: nowrap;">${(festivePricing.rawTotal || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="padding: 8px 10px; text-align: right; font-size: 13px; color: #927116; font-weight: bold; background-color: #fffdf5;">
                            🎁 Remise Early Bird (-5% avant le 01/12) :
                        </td>
                        <td style="padding: 8px 10px; text-align: right; font-size: 13px; color: #927116; font-weight: bold; background-color: #fffdf5; white-space: nowrap;">
                            - ${(festivePricing.discountAmount || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                ` : ''}
                <tr>
                    <td colspan="4" style="padding: 10px 10px; text-align: right; font-size: 14px; font-weight: bold; border-top: 1px solid #ddd;">Total final TTC :</td>
                    <td style="padding: 10px 10px; text-align: right; font-size: 15px; font-weight: bold; border-top: 1px solid #ddd; white-space: nowrap;">${(festivePricing.totalNet || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                </tr>
                ${festivePricing.validationMode === 'acompte_30' ? `
                    <tr>
                        <td colspan="4" style="padding: 6px 10px; text-align: right; font-size: 12px; color: #666;">Mode de règlement choisi :</td>
                        <td style="padding: 6px 10px; text-align: right; font-size: 12px; font-weight: bold; color: #333;">Acompte 30% (convives ajustables jusqu'à 7 jours avant le retrait)</td>
                    </tr>
                    <tr style="background-color: #fff9e6;">
                        <td colspan="4" style="padding: 12px 10px; text-align: right; font-size: 14px; color: #000; border-top: 2px solid #D4AF37;">
                            <strong>ACOMPTE DE 30% À VERSER SOUS 48H :</strong>
                        </td>
                        <td style="padding: 12px 10px; text-align: right; font-size: 17px; color: #D4AF37; font-weight: bold; border-top: 2px solid #D4AF37; white-space: nowrap;">
                            ${(festivePricing.depositAmount || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="padding: 6px 10px; text-align: right; font-size: 12px; color: #777;">Solde restant dû (au plus tard 7 jours avant le retrait) :</td>
                        <td style="padding: 6px 10px; text-align: right; font-size: 12px; color: #777; white-space: nowrap;">${(festivePricing.remainingBalance || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</td>
                    </tr>
                ` : `
                    <tr>
                        <td colspan="4" style="padding: 6px 10px; text-align: right; font-size: 12px; color: #666;">Mode de règlement choisi :</td>
                        <td style="padding: 6px 10px; text-align: right; font-size: 12px; font-weight: bold; color: #333;">Règlement intégral (100% ferme)</td>
                    </tr>
                    <tr style="background-color: #fff9e6;">
                        <td colspan="4" style="padding: 12px 10px; text-align: right; font-size: 14px; color: #000; border-top: 2px solid #D4AF37;">
                            <strong>MONTANT TOTAL (100%) À RÉGLER SOUS 48H :</strong>
                        </td>
                        <td style="padding: 12px 10px; text-align: right; font-size: 17px; color: #D4AF37; font-weight: bold; border-top: 2px solid #D4AF37; white-space: nowrap;">
                            ${(festivePricing.totalNet || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </td>
                    </tr>
                `}
            </tfoot>
        ` : `
            <tfoot>
                <tr>
                    <td colspan="4" style="padding: 15px 10px; text-align: right; font-size: 15px;"><strong>TOTAL À PAYER :</strong></td>
                    <td style="padding: 15px 10px; text-align: right; font-size: 17px; color: #D4AF37; white-space: nowrap;"><strong>${finalTotalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong></td>
                </tr>
            </tfoot>
        `;

        const cartTableHTML = `
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: sans-serif; table-layout: fixed;">
                <thead>
                    <tr style="background-color: #f9f9f9;">
                        <th style="width: 25%; padding: 10px; border-bottom: 2px solid #ddd; text-align: left; font-size: 13px;">Article</th>
                        <th style="width: 8%; padding: 10px; border-bottom: 2px solid #ddd; text-align: center; font-size: 13px;">Qté</th>
                        <th style="width: 42%; padding: 10px; border-bottom: 2px solid #ddd; text-align: left; font-size: 13px;">Détails (Composition)</th>
                        <th style="width: 15%; padding: 10px; border-bottom: 2px solid #ddd; text-align: left; font-size: 13px;">Retrait</th>
                        <th style="width: 10%; padding: 10px; border-bottom: 2px solid #ddd; text-align: right; font-size: 13px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${htmlCartDetails}
                </tbody>
                ${tableFooterHTML}
            </table>
        `;

        // 3. Préparation et envoi des emails via Resend (Sécurisé et non-bloquant)
        if (resend) {
            try {
                const fromAddress = 'Traiteur Compère <contact@traiteur-compere.be>';
                const traiteurEmail = process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com';

                // Email au Traiteur
                const { error: errTraiteur } = await resend.emails.send({
                    from: fromAddress,
                    to: traiteurEmail,
                    replyTo: Mail,
                    subject: `[${formattedOrderNumber}] ${isFestiveOrder ? '🎉 FETES' : '🍽️ PLATS'} - ${cleanNom} ${cleanPrenom} - ${dateSoumission || dateEvenement || 'Fêtes'}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Nouvelle commande ${orderTitle} (${formattedOrderNumber})</h2>
                            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 5px 0;"><strong>Client :</strong> ${Nom} ${Prenom}</p>
                                <p style="margin: 5px 0;"><strong>Email :</strong> ${Mail}</p>
                                <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${Tel}</p>
                                <p style="margin: 5px 0;"><strong>Société :</strong> ${Societe === 'Oui' ? Nom_Societe : 'Non'}</p>
                                ${dateEvenement ? `<p style="margin: 5px 0; color: #D4AF37; font-size: 15px;"><strong>🎉 Date(s) du repas :</strong> ${dateEvenement}</p>` : ''}
                                ${creneauRetrait ? `<p style="margin: 5px 0; line-height: 1.4;"><strong>⏰ Retrait à l'atelier :</strong><br/>${String(creneauRetrait).split(' | ').join('<br/>')}</p>` : ''}
                                <p style="margin: 5px 0;"><strong>Date de saisie :</strong> ${dateSoumission || new Date().toLocaleDateString('fr-BE')}</p>
                                ${isFestiveOrder ? `<p style="margin: 5px 0;"><strong>Mode choisi :</strong> ${festivePricing.validationMode === 'acompte_30' ? 'Acompte 30% (' + (festivePricing.depositAmount || 0).toFixed(2) + ' €) - solde dû : ' + (festivePricing.remainingBalance || 0).toFixed(2) + ' €' : 'Totalité 100% (' + (festivePricing.totalNet || 0).toFixed(2) + ' €)'}</p>` : ''}
                            </div>
                            
                            <h3>Détail du panier</h3>
                            ${cartTableHTML}

                            ${kitchenSummaryTableHTML}
                            
                            ${details_projet ? `
                            <div style="background: #fff8e1; padding: 15px; border-left: 4px solid #fbc02d; margin-top: 20px;">
                                <p style="margin: 0;"><strong>Commentaires supplémentaires / Allergies :</strong><br/>${details_projet}</p>
                            </div>` : ''}
                        </div>
                    `
                });

                if (errTraiteur) {
                    console.error("Erreur Resend email traiteur :", errTraiteur);
                }

                // Email au Client
                const { error: errClient } = await resend.emails.send({
                    from: fromAddress,
                    to: Mail,
                    replyTo: 'contact@traiteur-compere.be',
                    subject: `Confirmation de votre commande ${formattedOrderNumber} - Traiteur Compère`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #000;">Merci pour votre commande, ${Prenom} !</h2>
                            <p>Votre commande de <strong>${orderTitle}</strong> a bien été enregistrée sous la référence <strong>${formattedOrderNumber}</strong>.</p>
                            
                            <!-- Bandeau d'alerte et mention explicite -->
                            <div style="background-color: #fff9e6; border: 2px solid #D4AF37; border-left: 6px solid #D4AF37; border-radius: 8px; padding: 16px 18px; margin: 20px 0; color: #333;">
                                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #856404;">
                                    Votre réservation est enregistrée.
                                </p>
                                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #222; font-weight: bold;">
                                    Elle sera définitivement confirmée à la réception de votre virement bancaire sous 48h.
                                </p>
                                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #444;">
                                    ${isFestiveOrder && festivePricing.validationMode === 'acompte_30'
                                        ? `Merci de verser votre acompte de <strong>${(festivePricing.depositAmount || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> sous 48h. Vos convives et votre commande restent ajustables jusqu'à 7 jours avant le retrait. Le solde de <strong>${(festivePricing.remainingBalance || 0).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> sera à régler au plus tard 7 jours avant le retrait.`
                                        : `Merci de verser votre règlement intégral de <strong>${amountToPayNow.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong> sous 48h.`}
                                </p>
                                <p style="margin: 0; font-size: 12px; font-weight: bold; color: #b71c1c; line-height: 1.4;">
                                    Passé ce délai de 48h sans réception du paiement, la réservation des créneaux et l'avantage réservation anticipée de -5% seront libérés.
                                </p>
                            </div>

                            ${dateEvenement ? `
                            <div style="background-color: #fff8e1; padding: 15px; border-left: 4px solid #D4AF37; border-radius: 4px; margin: 20px 0;">
                                <p style="margin: 4px 0; font-size: 15px;"><strong>🎉 Date(s) de votre repas :</strong> ${dateEvenement}</p>
                                <p style="margin: 4px 0; font-size: 14px; line-height: 1.4;"><strong>⏰ Créneau(x) de retrait à l'atelier :</strong><br/>${creneauRetrait ? String(creneauRetrait).split(' | ').join('<br/>') : 'Selon créneau sélectionné'}</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #666;">📍 Rue Potay 3, 4470 Saint-Georges-sur-Meuse</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #D4AF37; font-weight: bold;">✨ Notice détaillée de réchauffage et dressage fournie avec chaque commande à notre atelier.</p>
                            </div>` : ''}

                            ${cartTableHTML}
                            
                            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; margin-top: 30px;">
                                <h3 style="margin-top: 0; color: #000;">Infos pratiques de retrait</h3>
                                <p style="margin: 5px 0;"><strong>📞 Téléphone :</strong> <a href="tel:+32468385082" style="color: #000; text-decoration: none;">+32 468 38 50 82</a></p>
                                <p style="margin: 5px 0;"><strong>📍 Atelier de retrait :</strong> Rue Potay 3, 4470 Saint-Georges-sur-Meuse, Belgique</p>
                                <p style="margin: 5px 0;"><a href="https://maps.google.com/?q=Traiteur+Compere,+Rue+Potay+3,+4470+Saint-Georges-sur-Meuse,+Belgique" style="color: #D4AF37; text-decoration: none; font-weight: bold;">🗺️ Voir sur Google Maps</a></p>
                            </div>
                            
                            <!-- Coordonnées bancaires officielles avec IBAN -->
                            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; margin-top: 20px;">
                                <h3 style="margin-top: 0; color: #000;">Informations de paiement (Virement bancaire)</h3>
                                <p style="margin: 5px 0;"><strong>Bénéficiaire :</strong> ${BENEFICIAIRE}</p>
                                <p style="margin: 5px 0; font-size: 15px;"><strong>IBAN :</strong> <code style="font-size: 16px; font-weight: bold; color: #000; letter-spacing: 0.5px;">${IBAN}</code></p>
                                <p style="margin: 5px 0;"><strong>BIC :</strong> ${BIC}</p>
                                <p style="margin: 5px 0; color: #D4AF37; font-size: 15px;"><strong>Communication du virement :</strong> <strong>${COMMUNICATION}</strong></p>
                                <p style="margin: 10px 0 0 0; font-size: 16px; color: #000; border-top: 1px solid #e0e0e0; padding-top: 10px;">
                                    <strong>Montant à verser sous 48h :</strong> <span style="color: #D4AF37; font-weight: bold; font-size: 18px;">${amountToPayNow.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                    ${isFestiveOrder && festivePricing.validationMode === 'acompte_30' ? `<br/><span style="font-size: 13px; color: #666;">(Acompte de 30% • Solde restant de ${(festivePricing.remainingBalance || 0).toFixed(2)} € au plus tard 7 jours avant le retrait)</span>` : '<br/><span style="font-size: 13px; color: #666;">(Paiement intégral 100%)</span>'}
                                </p>
                            </div>
                            <p style="margin-top: 20px; font-size: 13px; color: #555;">
                                <strong>Rappel :</strong> Votre réservation est enregistrée. Elle sera définitivement confirmée à la réception de votre virement bancaire sous 48h.
                            </p>
                            <br/>
                            <p>L'équipe Traiteur Compère vous remercie de votre confiance et vous souhaite d'excellentes fêtes !</p>
                        </div>
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
