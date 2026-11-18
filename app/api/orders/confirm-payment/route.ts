import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { confirmFestiveOrderPaymentByToken, FestiveOrderRecord } from '../../../lib/db';
import { generatePaymentConfirmedEmail } from '../../../lib/festive-emails';
import { formatPrice, cleanCapitalize } from '../../../lib/festive-reminders';

export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;
const FROM_EMAIL = 'Traiteur Compère <contact@traiteur-compere.be>';

function escapeHtml(input: string): string {
    return String(input || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderAdminHtmlPage(params: {
    variant: 'success' | 'already' | 'error';
    title: string;
    message: string;
    subMessage?: string;
    order?: FestiveOrderRecord;
    emailWarning?: string;
}): string {
    const { variant, title, message, subMessage, order, emailWarning } = params;

    const badgeConfig = {
        success: { bg: '#EDF7EE', border: '#B7DFB9', text: '#1E6625', icon: '✓', label: 'PAIEMENT VALIDÉ' },
        already: { bg: '#FAF6EB', border: '#E8D8A6', text: '#8A6D1F', icon: 'ℹ', label: 'DÉJÀ VALIDÉ' },
        error: { bg: '#FDF2F2', border: '#F5C2C2', text: '#9B1C1C', icon: '✕', label: 'LIEN INVALIDE' }
    }[variant];

    const orderSummaryHtml = order ? `
        <div style="margin-top: 24px; background-color: #FAF9F6; border: 1px solid #E8E2D5; border-radius: 10px; padding: 18px 20px; text-align: left;">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B89327; margin-bottom: 12px;">
                DÉTAILS DE LA COMMANDE
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.65;">
                <tr>
                    <td style="color: #777777; padding: 3px 0; width: 42%;">Référence :</td>
                    <td style="color: #1A1A1A; font-weight: 700; padding: 3px 0;">${escapeHtml(order.id)}</td>
                </tr>
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Client :</td>
                    <td style="color: #1A1A1A; font-weight: 600; padding: 3px 0;">${escapeHtml(`${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}`)}</td>
                </tr>
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Email client :</td>
                    <td style="color: #1A1A1A; padding: 3px 0;">${escapeHtml(order.email)}</td>
                </tr>
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Montant validé :</td>
                    <td style="color: #1E6625; font-weight: 700; padding: 3px 0;">${escapeHtml(formatPrice(order.amount_paid_initial))} € (${order.payment_mode === 'acompte_30' ? 'Acompte 30 %' : 'Totalité 100 %'})</td>
                </tr>
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Statut DB :</td>
                    <td style="padding: 3px 0;">
                        <code style="background-color: #EDE8DF; color: #1A1A1A; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">${escapeHtml(order.status)}</code>
                    </td>
                </tr>
                ${order.payment_mode === 'acompte_30' && order.balance_remaining > 0 ? `
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Solde restant (70 %) :</td>
                    <td style="color: #8A6D1F; font-weight: 600; padding: 3px 0;">${escapeHtml(formatPrice(order.balance_remaining))} €</td>
                </tr>` : ''}
                ${order.repas_date ? `
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Date du repas :</td>
                    <td style="color: #1A1A1A; font-weight: 600; padding: 3px 0;">${escapeHtml(order.repas_date)}</td>
                </tr>` : ''}
                ${order.retrait_slot ? `
                <tr>
                    <td style="color: #777777; padding: 3px 0;">Retrait :</td>
                    <td style="color: #1A1A1A; padding: 3px 0;">${escapeHtml(order.retrait_slot)}</td>
                </tr>` : ''}
            </table>
        </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>${escapeHtml(title)} — Maison Compère</title>
</head>
<body style="margin: 0; padding: 24px 16px; min-height: 100vh; box-sizing: border-box; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; display: flex; align-items: center; justify-content: center;">
    <div style="width: 100%; max-width: 560px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E2D5; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; text-align: center;">
        <div style="padding: 32px 28px 20px 28px; border-bottom: 1px solid #F0ECE4;">
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #1A1A1A;">
                MAISON COMPÈRE
            </div>
            <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #888888; margin-top: 4px;">
                Validation Atelier • Menus de Fêtes 2026
            </div>
        </div>

        <div style="padding: 32px 28px;">
            <div style="width: 58px; height: 58px; border-radius: 9999px; background-color: ${badgeConfig.bg}; border: 2px solid ${badgeConfig.border}; color: ${badgeConfig.text}; font-size: 26px; font-weight: 700; line-height: 54px; margin: 0 auto 18px auto;">
                ${badgeConfig.icon}
            </div>

            <div style="display: inline-block; background-color: ${badgeConfig.bg}; border: 1px solid ${badgeConfig.border}; color: ${badgeConfig.text}; border-radius: 9999px; padding: 5px 14px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">
                ${badgeConfig.label}
            </div>

            <h1 style="margin: 0 0 12px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #1A1A1A; line-height: 1.35;">
                ${escapeHtml(title)}
            </h1>

            <p style="margin: 0; font-size: 15px; color: #333333; line-height: 1.6;">
                ${escapeHtml(message)}
            </p>

            ${subMessage ? `
            <p style="margin: 12px 0 0 0; font-size: 13px; color: #666666; line-height: 1.55;">
                ${escapeHtml(subMessage)}
            </p>` : ''}

            ${emailWarning ? `
            <div style="margin-top: 16px; background-color: #FDF2F2; border: 1px solid #F5C2C2; border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #9B1C1C; line-height: 1.5;">
                ⚠ ${escapeHtml(emailWarning)}
            </div>` : ''}

            ${orderSummaryHtml}
        </div>

        <div style="padding: 18px 28px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; font-size: 12px; color: #888888;">
            Vous pouvez fermer cet onglet en toute sécurité.
        </div>
    </div>
</body>
</html>`;
}

export async function GET(req: Request) {
    const headers = {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    };

    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token')?.trim();

        if (!token) {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'error',
                    title: 'Jeton de validation manquant',
                    message: 'Le lien de validation est incomplet ou invalide. Aucune commande n\'a été modifiée.'
                }),
                { status: 400, headers }
            );
        }

        const confirmation = await confirmFestiveOrderPaymentByToken(token);

        if (confirmation.result === 'not_found' || !confirmation.order) {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'error',
                    title: 'Commande introuvable',
                    message: 'Ce lien de validation ne correspond à aucune commande enregistrée en base de données.'
                }),
                { status: 404, headers }
            );
        }

        const order = confirmation.order;
        const clientFullName = `${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}`.trim();
        const amountFormatted = formatPrice(order.amount_paid_initial);

        // Idempotence : déjà validé précédemment -> aucun second email envoyé
        if (confirmation.result === 'already_validated') {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'already',
                    title: 'Paiement déjà validé',
                    message: `Le paiement de ${amountFormatted} € pour ${clientFullName} (N° ${order.id}) a déjà été validé précédemment.`,
                    subMessage: 'L\'e-mail de confirmation définitive a déjà été envoyé au client. Aucun doublon n\'a été expédié.',
                    order
                }),
                { status: 200, headers }
            );
        }

        // Validation réussie -> Envoi automatique de l'E-mail n°2 au client via Resend
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
            (process.env.VERCEL_PROJECT_PRODUCTION_URL
                ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                : 'https://www.traiteur-compere.be');

        const emailData = generatePaymentConfirmedEmail(order, baseUrl);
        let emailWarning: string | undefined;

        if (resend) {
            try {
                const { error: sendError } = await resend.emails.send({
                    from: FROM_EMAIL,
                    to: order.email,
                    replyTo: 'contact@traiteur-compere.be',
                    subject: emailData.subject,
                    html: emailData.html
                });

                if (sendError) {
                    console.error(`Erreur Resend E-mail n°2 pour ${order.id}:`, sendError);
                    emailWarning = `Le statut en base de données a bien été mis à jour (${order.status}), mais l'envoi de l'e-mail via Resend a rencontré une erreur : ${sendError.message}`;
                }
            } catch (sendEx) {
                console.error(`Exception Resend E-mail n°2 pour ${order.id}:`, sendEx);
                emailWarning = `Le statut en base de données a bien été mis à jour (${order.status}), mais l'envoi de l'e-mail a échoué.`;
            }
        } else {
            emailWarning = 'Clé RESEND_API_KEY non configurée dans cet environnement : statut mis à jour en base, e-mail non envoyé.';
        }

        const subMessage = order.payment_mode === 'acompte_30'
            ? `L'e-mail envoyé inclut la confirmation de son acompte, le lien pour ajuster ses convives jusqu'à J-7 et le QR code pour régler le solde de ${formatPrice(order.balance_remaining)} €.`
            : 'L\'e-mail envoyé confirme que sa commande est intégralement réglée et prête pour le retrait (sans aucune mention de solde à payer).';

        return new NextResponse(
            renderAdminHtmlPage({
                variant: 'success',
                title: 'Paiement validé avec succès',
                message: `Paiement de ${amountFormatted} € validé pour ${clientFullName}. L'e-mail de confirmation définitive vient de lui être envoyé.`,
                subMessage,
                order,
                emailWarning
            }),
            { status: 200, headers }
        );
    } catch (err) {
        console.error('Erreur critique GET /api/orders/confirm-payment:', err);
        return new NextResponse(
            renderAdminHtmlPage({
                variant: 'error',
                title: 'Erreur technique',
                message: 'Une erreur serveur est survenue lors de la validation du paiement. Veuillez réessayer.'
            }),
            { status: 500, headers }
        );
    }
}
