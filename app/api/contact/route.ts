import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            Nom,
            Prenom,
            Mail,
            Tel,
            Date: dateContact,
            dateEvenement,
            creneauRetrait,
            Nombre_Convives,
            Type_Evenement,
            typeCommande,
            details_projet,
            brasserieOption,
            brasserieDetails,
            validationMode,
            totalPrice,
            amountToPayNow,
            cartItems,
            captchaToken
        } = body;

        // Basic verification
        if (!Nom || !Mail) {
            return NextResponse.json({ success: false, error: 'Champs obligatoires manquants (Nom, Email)' }, { status: 400 });
        }

        // Verify captcha if provided and configured
        if (captchaToken && process.env.RECAPTCHA_SECRET_KEY) {
            try {
                const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
                });
                const recaptchaData = await verifyRes.json();
                if (!recaptchaData.success) {
                    console.warn("Avertissement validation reCAPTCHA (non bloquant):", recaptchaData);
                }
            } catch (captchaErr) {
                console.error("Erreur réseau reCAPTCHA /api/contact:", captchaErr);
            }
        }

        const isFestive = Type_Evenement === 'menus_fetes' ||
            typeCommande === 'menus_fetes' ||
            Type_Evenement === 'Menus de Fêtes' ||
            (Array.isArray(cartItems) && cartItems.length > 0);

        // Cart items formatting if present
        let itemsHtml = '';
        if (Array.isArray(cartItems) && cartItems.length > 0) {
            const rows = cartItems.map((item: any) => {
                const name = item.nomPlat || 'Article';
                const qty = item.quantitePlat || 1;
                const total = item.prixTotalLigne ? `${item.prixTotalLigne} €` : '';
                const details = item.coursesSummary && Array.isArray(item.coursesSummary)
                    ? item.coursesSummary.join('<br/>')
                    : (item.coursesDescription || '');
                return `
                    <tr>
                        <td style="padding: 6px 8px; border-bottom: 1px solid #eee;"><strong>${name}</strong></td>
                        <td style="padding: 6px 8px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                        <td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px;">${details}</td>
                        <td style="padding: 6px 8px; border-bottom: 1px solid #eee; text-align: right;">${total}</td>
                    </tr>
                `;
            }).join('');

            itemsHtml = `
                <div style="margin: 20px 0;">
                    <h3 style="margin-bottom: 8px;">Articles commandés :</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="background: #f5f5f5;">
                                <th style="padding: 6px 8px; text-align: left;">Article</th>
                                <th style="padding: 6px 8px; text-align: center;">Qté</th>
                                <th style="padding: 6px 8px; text-align: left;">Détails</th>
                                <th style="padding: 6px 8px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }

        // Email formatting with Festive and Brasserie options
        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">
                    ${isFestive ? '🎉 Demande / Commande Menus de Fêtes 2026' : 'Nouvelle demande de devis'}
                </h2>
                <p><strong>Client :</strong> ${Nom} ${Prenom || ''}</p>
                <p><strong>Email :</strong> ${Mail}</p>
                <p><strong>Téléphone :</strong> ${Tel || 'Non spécifié'}</p>
                <p><strong>Date événement / repas :</strong> ${dateEvenement || dateContact || 'Non spécifiée'}</p>
                ${creneauRetrait ? `<p><strong>Créneau de retrait :</strong> ${creneauRetrait}</p>` : ''}
                ${Nombre_Convives ? `<p><strong>Nombre de convives :</strong> ${Nombre_Convives}</p>` : ''}
                <p><strong>Formule / Contexte :</strong> ${Type_Evenement || typeCommande || 'Sur-mesure'}</p>
                ${validationMode ? `<p><strong>Mode de paiement choisi :</strong> ${validationMode === 'acompte_30' ? 'Acompte 30%' : 'Paiement intégral 100%'}</p>` : ''}
                ${amountToPayNow ? `<p><strong>Montant immédiat à verser sous 48h :</strong> ${amountToPayNow} € (Total: ${totalPrice || amountToPayNow} €)</p>` : ''}

                ${itemsHtml}

                ${brasserieOption ? `
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                    <h3 style="margin-top: 0; color: #111;">🍺 Option Bar & Gestion des Boissons (Formule Brasserie)</h3>
                    <p style="margin: 4px 0;"><strong>Option demandée :</strong> OUI</p>
                    <p style="margin: 4px 0;"><em>Inclus : Fourniture du frigo vitré, stock complet avec reprise des invendus non ouverts et personnel de service à 18€/h HTVA.</em></p>
                    ${brasserieDetails ? `<p style="margin: 8px 0 0 0;"><strong>Précisions sur les boissons :</strong><br/>${brasserieDetails}</p>` : ''}
                </div>
                ` : ''}

                ${details_projet ? `
                    <div style="margin-top: 20px;">
                        <h3>Message & précisions supplémentaires :</h3>
                        <p style="white-space: pre-line; background: #fafafa; padding: 12px; border-radius: 6px;">${details_projet}</p>
                    </div>
                ` : ''}
            </div>
        `;

        // Send via Resend if configured
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Traiteur Compère <contact@traiteur-compere.be>',
                    to: process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com',
                    replyTo: Mail,
                    subject: `${isFestive ? '🎉 FETES' : 'DEVIS'} - ${Nom} ${Prenom || ''} - ${dateEvenement || dateContact || ''}`,
                    html: emailHtml
                });
            } catch (errResend) {
                console.error("Erreur d'envoi Resend dans /api/contact (non bloquante):", errResend);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Demande enregistrée avec succès',
            orderNumber: `NOEL-${Math.floor(Math.random() * 90000) + 10000}`
        });
    } catch (error: any) {
        console.error('Erreur API /api/contact:', error);
        return NextResponse.json({ success: false, error: error?.message || 'Erreur interne du serveur' }, { status: 500 });
    }
}
