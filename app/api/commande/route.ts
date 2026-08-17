import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { MENU_DATA } from '../../data/plats-prepares';
import { MENUS_FETES_DATA } from '../../data/menus-fetes';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Dummy if missing to prevent crash on init

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const {
            Nom, Prenom, Mail, Tel, Societe, Nom_Societe, Date,
            dateEvenement, creneauRetrait, details_projet, captchaToken, cartItems, typeCommande
        } = data;

        // 1. Validation de base
        if (!Nom || !Prenom || !Mail || !Tel) {
            return NextResponse.json({ success: false, error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Le panier est vide' }, { status: 400 });
        }

        // 1.5 Validation reCAPTCHA côté serveur
        if (!captchaToken) {
            return NextResponse.json({ success: false, error: 'Captcha manquant' }, { status: 400 });
        }

        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        if (!recaptchaSecret) {
            console.error("RECAPTCHA_SECRET_KEY manquant dans l'environnement");
            return NextResponse.json({ success: false, error: 'Erreur de configuration serveur' }, { status: 500 });
        }

        const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${recaptchaSecret}&response=${captchaToken}`
        });

        const recaptchaData = await verifyRes.json();
        if (!recaptchaData.success) {
            console.error("Erreur validation reCAPTCHA:", recaptchaData);
            return NextResponse.json({ success: false, error: 'Validation Captcha échouée' }, { status: 400 });
        }

        // 2. Sécurité : Recalculer le prix côté serveur pour éviter toute manipulation
        let finalTotalPrice = 0;
        let htmlCartDetails = '';
        let hasFestiveItem = false;

        for (const item of cartItems) {
            const isFestive = item.itemType === 'menu_fete' || item.semaineId?.startsWith('menu') || item.semaineId?.startsWith('fetes') || item.semaineId === 'menus-fetes';

            if (isFestive) {
                hasFestiveItem = true;
                const festiveMenu = MENUS_FETES_DATA.find(m => m.id === item.id || m.title.toLowerCase() === item.nomPlat.toLowerCase());

                const unitPrice = festiveMenu ? festiveMenu.price : (item.prixUnitairePlat || 49);
                const itemTotal = unitPrice * item.quantitePlat;
                finalTotalPrice += itemTotal;

                const coursesList = festiveMenu
                    ? festiveMenu.courses.map(c => `<strong>${c.courseName}:</strong> ${c.title}`).join('<br/>')
                    : (item.coursesSummary?.join('<br/>') || '-');

                const pickupNotice = creneauRetrait || (festiveMenu ? festiveMenu.badge : (item.badge || item.jour || '24 ou 31 Décembre'));

                htmlCartDetails += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                            <strong style="color: #000; font-size: 14px;">${item.nomPlat}</strong><br/>
                            <span style="color: #D4AF37; font-size: 12px; font-weight: bold;">Menu de Fêtes</span>
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold;">${item.quantitePlat}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; line-height: 1.4;">${coursesList}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px; color: #D4AF37;"><strong>${pickupNotice}</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${itemTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong></td>
                    </tr>
                `;
            } else {
                // Plats Préparés classiques
                const weekData = MENU_DATA.find(m => m.id === item.semaineId);
                const dayData = weekData?.days.find(d => d.day.toLowerCase() === item.jour.toLowerCase());

                if (!weekData || !dayData) {
                    return NextResponse.json({ success: false, error: 'Un plat du panier est invalide ou expiré' }, { status: 400 });
                }

                const pricePlat = parseFloat(dayData.price.replace(',', '.').replace(' €', ''));
                const pricePotage = 4;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const totalSoupes = Object.values(item.soupes || {}).reduce((a: any, b: any) => a + (b as number), 0) as number;

                // Vérification de sécurité: totalSoupes <= quantitePlat
                if (totalSoupes > item.quantitePlat) {
                    return NextResponse.json({ success: false, error: 'Quantité de soupes invalide' }, { status: 400 });
                }

                const itemTotal = (pricePlat * item.quantitePlat) + (totalSoupes * pricePotage);
                finalTotalPrice += itemTotal;

                // Déterminer le jour de retrait
                const getPickupDay = (j: string) => {
                    const day = j.toLowerCase();
                    if (day === 'lundi' || day === 'mardi') return 'Mardi après 11h';
                    if (day === 'mercredi' || day === 'jeudi') return 'Jeudi après 11h';
                    if (day === 'vendredi' || day === 'samedi') return 'Samedi après 11h';
                    return j;
                };
                const jourRetrait = getPickupDay(item.jour);

                // Construire la liste des soupes
                const soupesList = item.soupes ? Object.entries(item.soupes)
                    .filter(([_, q]) => (q as number) > 0)
                    .map(([s, q]) => `${q}x ${s}`)
                    .join('<br/>') : '-';

                htmlCartDetails += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                            <strong>${dayData.meal}</strong><br/>
                            <span style="color: #666; font-size: 12px;">${dayData.day} - ${weekData.week.split(' :')[0]}</span>
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold;">${item.quantitePlat}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${soupesList || '-'}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 13px; color: #D4AF37;"><strong>${jourRetrait}</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${itemTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong></td>
                    </tr>
                `;
            }
        }

        // Génère un numéro unique à 5 chiffres pour chaque commande
        const orderNumber = Math.floor(Math.random() * 90000) + 10000;
        const formattedOrderNumber = String(orderNumber);

        // Informations bancaires pour le client
        const IBAN = "BE22 0689 4683 8447";
        const BIC = "GKCCBEBB";
        const BENEFICIAIRE = "JEAN COMPERE";
        const COMMUNICATION = `COMMANDE #${formattedOrderNumber} ${Nom.toUpperCase()} ${Prenom.toUpperCase()}`;

        const isFestiveOrder = typeCommande === 'menus_fetes' || hasFestiveItem;
        const orderTitle = isFestiveOrder ? 'Menus de Fêtes 2026' : 'Plats Préparés';

        const cartTableHTML = `
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: sans-serif;">
                <thead>
                    <tr style="background-color: #f9f9f9;">
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Article / Menu</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qté</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Détails</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Retrait</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">S/Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${htmlCartDetails}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="padding: 15px 10px; text-align: right; font-size: 16px;"><strong>TOTAL À PAYER :</strong></td>
                        <td style="padding: 15px 10px; text-align: right; font-size: 18px; color: #D4AF37;"><strong>${finalTotalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;

        // 3. Préparation et envoi des emails via Resend
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) {
            try {
                // Email au Traiteur
                await resend.emails.send({
                    from: 'Traiteur Compère <commande@traiteur-compere.be>',
                    to: process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com',
                    subject: `[COMMANDE #${formattedOrderNumber}] ${isFestiveOrder ? '🎉 FETES' : '🍽️ PLATS'} - ${Nom} ${Prenom} - ${Date}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Nouvelle commande ${orderTitle} (N° ${formattedOrderNumber})</h2>
                            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 5px 0;"><strong>Client :</strong> ${Nom} ${Prenom}</p>
                                <p style="margin: 5px 0;"><strong>Email :</strong> ${Mail}</p>
                                <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${Tel}</p>
                                <p style="margin: 5px 0;"><strong>Société :</strong> ${Societe === 'Oui' ? Nom_Societe : 'Non'}</p>
                                ${dateEvenement ? `<p style="margin: 5px 0; color: #D4AF37; font-size: 15px;"><strong>🎉 Date(s) du repas :</strong> ${dateEvenement}</p>` : ''}
                                ${creneauRetrait ? `<p style="margin: 5px 0; line-height: 1.4;"><strong>⏰ Créneau(x) de retrait :</strong><br/>${creneauRetrait.split(' | ').join('<br/>')}</p>` : ''}
                                <p style="margin: 5px 0;"><strong>Date de saisie :</strong> ${Date}</p>
                            </div>
                            
                            <h3>Détail du panier</h3>
                            ${cartTableHTML}
                            
                            ${details_projet ? `
                            <div style="background: #fff8e1; padding: 15px; border-left: 4px solid #fbc02d; margin-top: 20px;">
                                <p style="margin: 0;"><strong>Commentaires supplémentaires / Allergies :</strong><br/>${details_projet}</p>
                            </div>` : ''}
                        </div>
                    `
                });

                // Email au Client
                await resend.emails.send({
                    from: 'Traiteur Compère <commande@traiteur-compere.be>',
                    to: Mail,
                    subject: `Confirmation de votre commande #${formattedOrderNumber} - Traiteur Compère`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #000;">Merci pour votre commande, ${Prenom} !</h2>
                            <p>Votre commande de <strong>${orderTitle}</strong> a bien été enregistrée. Voici votre récapitulatif (<strong>N° ${formattedOrderNumber}</strong>) :</p>
                            
                            <!-- Bandeau d'alerte Paiement 24h -->
                            <div style="background-color: #fff9e6; border: 2px solid #D4AF37; border-left: 6px solid #D4AF37; border-radius: 8px; padding: 16px 18px; margin: 20px 0; color: #333;">
                                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #856404;">
                                    ⚠️ Important – Validation de votre réservation :
                                </p>
                                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #444;">
                                    Merci de bien vouloir procéder au règlement de votre commande <strong>sous 24 heures</strong> (via le QR Code présent sur le site ou par virement bancaire avec les informations ci-dessous).
                                </p>
                                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #b71c1c; line-height: 1.4;">
                                    Passé ce délai de 24h sans confirmation de paiement, votre réservation sera automatiquement annulée.
                                </p>
                            </div>

                            ${dateEvenement ? `
                            <div style="background-color: #fff8e1; padding: 15px; border-left: 4px solid #D4AF37; border-radius: 4px; margin: 20px 0;">
                                <p style="margin: 4px 0; font-size: 15px;"><strong>🎉 Date(s) de votre repas :</strong> ${dateEvenement}</p>
                                <p style="margin: 4px 0; font-size: 14px; line-height: 1.4;"><strong>⏰ Créneau(x) de retrait à l'atelier :</strong><br/>${creneauRetrait ? creneauRetrait.split(' | ').join('<br/>') : 'Selon créneau sélectionné'}</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #666;">📍 Rue Potay 3, 4470 Saint-Georges-sur-Meuse</p>
                            </div>` : ''}

                            ${cartTableHTML}
                            
                            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; margin-top: 30px;">
                                <h3 style="margin-top: 0; color: #000;">Infos pratiques de retrait</h3>
                                <p style="margin: 5px 0;"><strong>📞 Téléphone :</strong> +32 476 86 54 07</p>
                                <p style="margin: 5px 0;"><strong>📍 Atelier de retrait :</strong> Rue Potay 3, 4470 Saint-Georges-sur-Meuse, Belgique</p>
                                <p style="margin: 5px 0;"><a href="https://maps.google.com/?q=Traiteur+Compere,+Rue+Potay+3,+4470+Saint-Georges-sur-Meuse,+Belgique" style="color: #D4AF37; text-decoration: none; font-weight: bold;">🗺️ Voir sur Google Maps</a></p>
                            </div>
                            
                            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; margin-top: 20px;">
                                <h3 style="margin-top: 0; color: #000;">Informations de paiement (Virement bancaire)</h3>
                                <p style="margin: 5px 0;"><strong>Bénéficiaire :</strong> ${BENEFICIAIRE}</p>
                                <p style="margin: 5px 0;"><strong>IBAN :</strong> ${IBAN}</p>
                                <p style="margin: 5px 0;"><strong>BIC :</strong> ${BIC}</p>
                                <p style="margin: 5px 0; color: #D4AF37; font-size: 16px;"><strong>Communication structurée :</strong> ${COMMUNICATION}</p>
                            </div>
                            <p style="margin-top: 20px;">Votre commande sera définitivement confirmée à la réception de votre virement.</p>
                            <br/>
                            <p>L'équipe Traiteur Compère vous souhaite d'excellentes fêtes !</p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Erreur d'envoi d'email Resend :", emailError);
            }
        } else {
            console.log("Mode dev ou pas de clé Resend : Emails non envoyés. Prix calculé :", finalTotalPrice);
        }

        return NextResponse.json({
            success: true,
            totalPrice: finalTotalPrice,
            orderNumber: formattedOrderNumber,
            message: 'Commande enregistrée avec succès'
        });

    } catch (error) {
        console.error("Erreur lors de la création de la commande :", error);
        return NextResponse.json({ success: false, error: 'Erreur Serveur' }, { status: 500 });
    }
}
