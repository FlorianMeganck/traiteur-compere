import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            Nom,
            Prenom,
            Mail,
            Tel,
            Date,
            Nombre_Convives,
            Type_Evenement,
            details_projet,
            brasserieOption,
            brasserieDetails,
            captchaToken
        } = body;

        // Basic verification
        if (!Nom || !Mail) {
            return NextResponse.json({ success: false, error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        // Verify captcha if provided
        if (captchaToken && process.env.RECAPTCHA_SECRET_KEY) {
            const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
            });
            const recaptchaData = await verifyRes.json();
            if (!recaptchaData.success) {
                return NextResponse.json({ success: false, error: 'Captcha invalide' }, { status: 400 });
            }
        }

        // Email formatting with Brasserie option highlight
        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">Nouvelle demande de devis</h2>
                <p><strong>Client :</strong> ${Nom} ${Prenom || ''}</p>
                <p><strong>Email :</strong> ${Mail}</p>
                <p><strong>Téléphone :</strong> ${Tel || 'Non spécifié'}</p>
                <p><strong>Date événement :</strong> ${Date || 'Non spécifiée'}</p>
                <p><strong>Nombre de convives :</strong> ${Nombre_Convives || 'Non spécifié'}</p>
                <p><strong>Formule / Menu :</strong> ${Type_Evenement || 'Sur-mesure'}</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                    <h3 style="margin-top: 0; color: #111;">🍺 Option Bar & Gestion des Boissons (Formule Brasserie)</h3>
                    <p style="margin: 4px 0;"><strong>Option demandée :</strong> ${brasserieOption ? 'OUI' : 'NON'}</p>
                    ${brasserieOption ? `
                        <p style="margin: 4px 0;"><em>Inclus : Fourniture du frigo vitré, stock complet avec reprise des invendus non ouverts et personnel de service à 18€/h HTVA.</em></p>
                        ${brasserieDetails ? `<p style="margin: 8px 0 0 0;"><strong>Précisions sur les boissons :</strong><br/>${brasserieDetails}</p>` : ''}
                    ` : ''}
                </div>

                ${details_projet ? `
                    <div style="margin-top: 20px;">
                        <h3>Message & détails du projet :</h3>
                        <p style="white-space: pre-line; background: #fafafa; padding: 12px; border-radius: 6px;">${details_projet}</p>
                    </div>
                ` : ''}
            </div>
        `;

        // Send via Resend if configured
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789') {
            await resend.emails.send({
                from: 'Traiteur Compère <contact@traiteur-compere.be>',
                to: 'contact@traiteur-compere.be',
                subject: `Nouvelle demande de devis : ${Nom} ${Prenom || ''}`,
                html: emailHtml
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Demande enregistrée avec succès',
            brasserieOption: Boolean(brasserieOption),
            brasserieDetails: brasserieDetails || ''
        });
    } catch (error) {
        console.error('Erreur API /api/contact:', error);
        return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
