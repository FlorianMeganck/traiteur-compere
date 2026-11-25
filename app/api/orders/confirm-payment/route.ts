import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
    getFestiveOrderByToken,
    getFestiveOrderByBalanceToken,
    confirmFestiveOrderPaymentByToken,
    confirmFestiveOrderBalanceByToken,
    FestiveOrderRecord
} from '../../../lib/db';
import {
    generatePaymentConfirmedEmail,
    generateTraiteurBalanceValidationEmail,
    generateBalancePaidEmail
} from '../../../lib/festive-emails';
import { formatPrice, cleanCapitalize } from '../../../lib/festive-reminders';

export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;
const FROM_EMAIL = 'Traiteur Compère <contact@traiteur-compere.be>';
const TRAITEUR_EMAIL = process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com';

const HTML_HEADERS = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
};

function getBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : 'https://www.traiteur-compere.be')
    ).replace(/\/$/, '');
}

function escapeHtml(input: string): string {
    return String(input || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderAdminHtmlPage(params: {
    variant: 'confirm' | 'success' | 'already' | 'error';
    badgeLabel?: string;
    title: string;
    message: string;
    subMessage?: string;
    order?: FestiveOrderRecord;
    highlightAmount?: string;
    highlightLabel?: string;
    confirmForm?: {
        token: string;
        step: 'initial' | 'balance';
        buttonLabel: string;
    };
    balanceLinkBox?: {
        url: string;
        balanceFormatted: string;
        alreadySentByEmail?: boolean;
    };
    emailWarning?: string;
}): string {
    const {
        variant,
        badgeLabel,
        title,
        message,
        subMessage,
        order,
        highlightAmount,
        highlightLabel,
        confirmForm,
        balanceLinkBox,
        emailWarning
    } = params;

    const badgeConfig = {
        confirm: { bg: '#FAF6EB', border: '#D4AF37', text: '#8A6D1F', icon: '€', label: badgeLabel || 'CONFIRMATION REQUISE' },
        success: { bg: '#EDF7EE', border: '#B7DFB9', text: '#1E6625', icon: '✓', label: badgeLabel || 'PAIEMENT VALIDÉ' },
        already: { bg: '#FAF6EB', border: '#E8D8A6', text: '#8A6D1F', icon: 'ℹ', label: badgeLabel || 'DÉJÀ VALIDÉ' },
        error: { bg: '#FDF2F2', border: '#F5C2C2', text: '#9B1C1C', icon: '✕', label: badgeLabel || 'LIEN INVALIDE' }
    }[variant];

    const orderSummaryHtml = order ? `
        <div style="margin-top: 22px; background-color: #FAF9F6; border: 1px solid #E8E2D5; border-radius: 10px; padding: 18px 20px; text-align: left;">
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
                    <td style="color: #777777; padding: 3px 0;">${escapeHtml(highlightLabel || 'Montant initial :')}</td>
                    <td style="color: #1E6625; font-weight: 700; padding: 3px 0;">${escapeHtml(highlightAmount || `${formatPrice(order.amount_paid_initial)} €`)} (${order.payment_mode === 'acompte_30' ? 'Acompte 30 %' : 'Totalité 100 %'})</td>
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
                    <td style="color: #777777; padding: 3px 0; vertical-align: top;">Retrait :</td>
                    <td style="color: #1A1A1A; padding: 3px 0;">${escapeHtml(order.retrait_slot)}</td>
                </tr>` : ''}
                ${order.resume_commande ? `
                <tr>
                    <td style="color: #777777; padding: 4px 0; vertical-align: top;">Mets commandés :</td>
                    <td style="color: #1A1A1A; font-size: 12px; line-height: 1.5; padding: 4px 0;">${escapeHtml(order.resume_commande)}</td>
                </tr>` : ''}
            </table>
        </div>
    ` : '';

    const confirmFormHtml = confirmForm ? `
        <form method="POST" action="/api/orders/confirm-payment" style="margin-top: 24px;">
            <input type="hidden" name="token" value="${escapeHtml(confirmForm.token)}" />
            <input type="hidden" name="step" value="${escapeHtml(confirmForm.step)}" />
            <button type="submit"
                style="width: 100%; background-color: #246131; color: #FFFFFF; border: none; border-radius: 9999px; padding: 15px 24px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(36,97,49,0.28); font-family: inherit;">
                ${escapeHtml(confirmForm.buttonLabel)}
            </button>
            <div style="margin-top: 10px; font-size: 11px; color: #888888;">
                Protection anti-robot activée : aucune action n'est déclenchée avant votre clic ci-dessus.
            </div>
        </form>
    ` : '';

    const balanceLinkBoxHtml = balanceLinkBox ? `
        <div style="margin-top: 22px; background-color: #FAF6EB; border: 1px solid #D4AF37; border-radius: 10px; padding: 18px 20px; text-align: center;">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8A6D1F; margin-bottom: 6px;">
                ÉTAPE SUIVANTE • VALIDATION DU SOLDE (70 %)
            </div>
            <p style="margin: 0 0 14px 0; font-size: 13px; color: #333333; line-height: 1.5;">
                ${balanceLinkBox.alreadySentByEmail
                    ? `Un e-mail récapitulatif contenant ce lien sécurisé vient également de vous être envoyé pour valider plus tard l'encaissement du solde (${escapeHtml(balanceLinkBox.balanceFormatted)} €) et stopper les relances automatiques.`
                    : `Utilisez ce lien sécurisé dès que le client aura réglé son solde restant (${escapeHtml(balanceLinkBox.balanceFormatted)} €) pour passer la commande en fully_paid.`}
            </p>
            <a href="${escapeHtml(balanceLinkBox.url)}"
               style="display: inline-block; background-color: #1A1A1A; color: #D4AF37; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 11px 20px; border-radius: 9999px; text-decoration: none;">
                Ouvrir le lien de validation du solde (${escapeHtml(balanceLinkBox.balanceFormatted)} €) →
            </a>
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
    <div style="width: 100%; max-width: 580px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E2D5; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; text-align: center;">
        <div style="padding: 30px 28px 20px 28px; border-bottom: 1px solid #F0ECE4;">
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #1A1A1A;">
                MAISON COMPÈRE
            </div>
            <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #888888; margin-top: 4px;">
                Validation Atelier • Menus de Fêtes 2026
            </div>
        </div>

        <div style="padding: 30px 28px;">
            <div style="width: 58px; height: 58px; border-radius: 9999px; background-color: ${badgeConfig.bg}; border: 2px solid ${badgeConfig.border}; color: ${badgeConfig.text}; font-size: 26px; font-weight: 700; line-height: 54px; margin: 0 auto 16px auto;">
                ${badgeConfig.icon}
            </div>

            <div style="display: inline-block; background-color: ${badgeConfig.bg}; border: 1px solid ${badgeConfig.border}; color: ${badgeConfig.text}; border-radius: 9999px; padding: 5px 14px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">
                ${escapeHtml(badgeConfig.label)}
            </div>

            <h1 style="margin: 0 0 12px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 21px; font-weight: 700; color: #1A1A1A; line-height: 1.35;">
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

            ${confirmFormHtml}
            ${orderSummaryHtml}
            ${balanceLinkBoxHtml}
        </div>

        <div style="padding: 16px 28px; background-color: #FAF9F6; border-top: 1px solid #F0ECE4; font-size: 12px; color: #888888;">
            ${variant === 'confirm' ? 'Vérifiez bien votre extrait bancaire avant de confirmer.' : 'Vous pouvez fermer cet onglet en toute sécurité.'}
        </div>
    </div>
</body>
</html>`;
}

/**
 * GET /api/orders/confirm-payment?token=...(&step=balance)
 * Lecture seule uniquement (aucune modification DB, aucun envoi d'e-mail).
 * Protège contre les pré-chargements automatiques des filtres anti-spam (Gmail, Outlook, antivirus).
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token')?.trim();
        const step: 'initial' | 'balance' = searchParams.get('step') === 'balance' ? 'balance' : 'initial';

        if (!token) {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'error',
                    title: 'Jeton de validation manquant',
                    message: 'Le lien de validation est incomplet ou invalide. Aucune commande n\'a été modifiée.'
                }),
                { status: 400, headers: HTML_HEADERS }
            );
        }

        const baseUrl = getBaseUrl();

        // --- ÉTAPE SOLDE 70% (deposit_paid → fully_paid) ---
        if (step === 'balance') {
            const order = await getFestiveOrderByBalanceToken(token);
            if (!order) {
                return new NextResponse(
                    renderAdminHtmlPage({
                        variant: 'error',
                        title: 'Commande introuvable',
                        message: 'Ce lien de validation de solde ne correspond à aucune commande enregistrée.'
                    }),
                    { status: 404, headers: HTML_HEADERS }
                );
            }

            const clientFullName = `${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}`.trim();
            const isAlreadyFullyPaid =
                order.status === 'fully_paid' ||
                order.status === 'solde_regle' ||
                Boolean(order.balance_validated_at);

            if (isAlreadyFullyPaid) {
                return new NextResponse(
                    renderAdminHtmlPage({
                        variant: 'already',
                        badgeLabel: 'SOLDE DÉJÀ VALIDÉ',
                        title: 'Commande déjà intégralement soldée',
                        message: `Le solde pour ${clientFullName} (N° ${order.id}) a déjà été validé précédemment.`,
                        subMessage: 'La commande est déjà au statut fully_paid et les relances automatiques sont stoppées.',
                        order
                    }),
                    { status: 200, headers: HTML_HEADERS }
                );
            }

            const balanceFormatted = formatPrice(order.balance_remaining);
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'confirm',
                    badgeLabel: 'VALIDATION SOLDE 70 %',
                    title: `Confirmer l'encaissement du solde de ${balanceFormatted} € pour la commande de ${clientFullName} ?`,
                    message: `En confirmant ci-dessous, la commande N° ${order.id} passera au statut fully_paid, les relances J-10 seront stoppées et un e-mail de confirmation de solde sera envoyé automatiquement au client.`,
                    order,
                    highlightLabel: 'Solde attendu :',
                    highlightAmount: `${balanceFormatted} €`,
                    confirmForm: {
                        token,
                        step: 'balance',
                        buttonLabel: `✓ Confirmer l'encaissement du solde (${balanceFormatted} €)`
                    }
                }),
                { status: 200, headers: HTML_HEADERS }
            );
        }

        // --- ÉTAPE PAIEMENT INITIAL (30% ou 100%) ---
        const order = await getFestiveOrderByToken(token);
        if (!order) {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'error',
                    title: 'Commande introuvable',
                    message: 'Ce lien de validation ne correspond à aucune commande enregistrée en base de données.'
                }),
                { status: 404, headers: HTML_HEADERS }
            );
        }

        const clientFullName = `${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}`.trim();
        const amountFormatted = formatPrice(order.amount_paid_initial);
        const alreadyValidatedStatuses = ['deposit_paid', 'fully_paid', 'solde_regle', 'solde_en_attente'];
        const isAlreadyValidated =
            alreadyValidatedStatuses.includes(order.status) || Boolean(order.payment_validated_at);

        if (isAlreadyValidated) {
            const canValidateBalance =
                order.payment_mode === 'acompte_30' &&
                order.status !== 'fully_paid' &&
                order.status !== 'solde_regle' &&
                !order.balance_validated_at &&
                Boolean(order.balance_validation_token);

            const balanceUrl = canValidateBalance && order.balance_validation_token
                ? `${baseUrl}/api/orders/confirm-payment?token=${encodeURIComponent(order.balance_validation_token)}&step=balance`
                : null;

            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'already',
                    title: 'Paiement déjà validé',
                    message: `Le paiement de ${amountFormatted} € pour ${clientFullName} (N° ${order.id}) a déjà été validé précédemment.`,
                    subMessage: 'L\'e-mail de confirmation définitive a déjà été envoyé au client. Aucun doublon n\'a été expédié.',
                    order,
                    balanceLinkBox: balanceUrl
                        ? {
                            url: balanceUrl,
                            balanceFormatted: formatPrice(order.balance_remaining),
                            alreadySentByEmail: false
                        }
                        : undefined
                }),
                { status: 200, headers: HTML_HEADERS }
            );
        }

        const modeLabel = order.payment_mode === 'acompte_30' ? 'acompte de 30 %' : 'règlement intégral (100 %)';
        return new NextResponse(
            renderAdminHtmlPage({
                variant: 'confirm',
                badgeLabel: 'CONFIRMATION REQUISE',
                title: `Confirmer l'encaissement de ${amountFormatted} € pour la commande de ${clientFullName} ?`,
                message: `Vous êtes sur le point de valider la réception du ${modeLabel} pour la commande N° ${order.id} et d'envoyer automatiquement l'e-mail de confirmation définitive au client.`,
                order,
                highlightLabel: 'Montant attendu :',
                highlightAmount: `${amountFormatted} €`,
                confirmForm: {
                    token,
                    step: 'initial',
                    buttonLabel: `✓ Confirmer l'encaissement de ${amountFormatted} €`
                }
            }),
            { status: 200, headers: HTML_HEADERS }
        );
    } catch (err) {
        console.error('Erreur critique GET /api/orders/confirm-payment:', err);
        return new NextResponse(
            renderAdminHtmlPage({
                variant: 'error',
                title: 'Erreur technique',
                message: 'Une erreur serveur est survenue lors du chargement de la page de confirmation.'
            }),
            { status: 500, headers: HTML_HEADERS }
        );
    }
}

/**
 * POST /api/orders/confirm-payment
 * Exécute réellement la validation atomique en base de données et l'envoi automatique de l'e-mail client.
 */
export async function POST(req: Request) {
    try {
        let token = '';
        let step: 'initial' | 'balance' = 'initial';

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await req.json();
            token = String(body?.token || '').trim();
            step = body?.step === 'balance' ? 'balance' : 'initial';
        } else {
            const formData = await req.formData();
            token = String(formData.get('token') || '').trim();
            step = String(formData.get('step') || '') === 'balance' ? 'balance' : 'initial';
        }

        if (!token) {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'error',
                    title: 'Jeton de validation manquant',
                    message: 'La requête de validation est incomplète. Aucune commande n\'a été modifiée.'
                }),
                { status: 400, headers: HTML_HEADERS }
            );
        }

        const baseUrl = getBaseUrl();

        // --- EXÉCUTION VALIDATION SOLDE 70% (deposit_paid → fully_paid) ---
        if (step === 'balance') {
            const confirmation = await confirmFestiveOrderBalanceByToken(token);

            if (confirmation.result === 'not_found' || !confirmation.order) {
                return new NextResponse(
                    renderAdminHtmlPage({
                        variant: 'error',
                        title: 'Commande introuvable',
                        message: 'Ce jeton de solde ne correspond à aucune commande en base de données.'
                    }),
                    { status: 404, headers: HTML_HEADERS }
                );
            }

            const order = confirmation.order;
            const clientFullName = `${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}`.trim();

            if (confirmation.result === 'already_validated') {
                return new NextResponse(
                    renderAdminHtmlPage({
                        variant: 'already',
                        badgeLabel: 'SOLDE DÉJÀ VALIDÉ',
                        title: 'Solde déjà validé',
                        message: `Le solde pour ${clientFullName} (N° ${order.id}) a déjà été validé précédemment.`,
                        subMessage: 'La commande est déjà au statut fully_paid. Aucun doublon d\'e-mail n\'a été envoyé.',
                        order
                    }),
                    { status: 200, headers: HTML_HEADERS }
                );
            }

            const balancePaidAmount = confirmation.balancePaidAmount ?? 0;
            const balancePaidFormatted = formatPrice(balancePaidAmount);
            const emailData = generateBalancePaidEmail(order, balancePaidAmount);
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
                        console.error(`Erreur Resend confirmation solde pour ${order.id}:`, sendError);
                        emailWarning = `La commande est bien passée en fully_paid, mais l'envoi de l'e-mail au client a échoué : ${sendError.message}`;
                    }
                } catch (sendEx) {
                    console.error(`Exception Resend confirmation solde pour ${order.id}:`, sendEx);
                    emailWarning = 'La commande est bien passée en fully_paid, mais l\'envoi de l\'e-mail au client a échoué.';
                }
            } else {
                emailWarning = 'Clé RESEND_API_KEY non configurée : statut mis à jour en base (fully_paid), e-mail non envoyé.';
            }

            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'success',
                    badgeLabel: 'COMMANDE SOLDÉE (FULLY_PAID)',
                    title: 'Solde validé avec succès',
                    message: `Solde de ${balancePaidFormatted} € validé pour ${clientFullName}. L'e-mail confirmant que sa commande est entièrement soldée vient de lui être envoyé.`,
                    subMessage: 'Le statut est passé à fully_paid : les relances automatiques de solde J-10 sont désormais stoppées.',
                    order,
                    highlightLabel: 'Solde validé :',
                    highlightAmount: `${balancePaidFormatted} €`,
                    emailWarning
                }),
                { status: 200, headers: HTML_HEADERS }
            );
        }

        // --- EXÉCUTION VALIDATION PAIEMENT INITIAL (pending_payment → deposit_paid / fully_paid) ---
        const confirmation = await confirmFestiveOrderPaymentByToken(token);

        if (confirmation.result === 'not_found' || !confirmation.order) {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'error',
                    title: 'Commande introuvable',
                    message: 'Ce lien de validation ne correspond à aucune commande enregistrée en base de données.'
                }),
                { status: 404, headers: HTML_HEADERS }
            );
        }

        const order = confirmation.order;
        const clientFullName = `${cleanCapitalize(order.prenom)} ${order.nom.toUpperCase()}`.trim();
        const amountFormatted = formatPrice(order.amount_paid_initial);

        if (confirmation.result === 'already_validated') {
            return new NextResponse(
                renderAdminHtmlPage({
                    variant: 'already',
                    title: 'Paiement déjà validé',
                    message: `Le paiement de ${amountFormatted} € pour ${clientFullName} (N° ${order.id}) a déjà été validé précédemment.`,
                    subMessage: 'L\'e-mail de confirmation définitive a déjà été envoyé au client. Aucun doublon n\'a été expédié.',
                    order
                }),
                { status: 200, headers: HTML_HEADERS }
            );
        }

        // Envoi automatique de l'E-mail n°2 au client
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

        // Si acompte 30% validé (deposit_paid) : générer le lien de validation du solde 70%
        // + l'envoyer par e-mail au traiteur ET l'afficher sur cette page
        let balanceLinkBox: { url: string; balanceFormatted: string; alreadySentByEmail: boolean } | undefined;
        if (order.payment_mode === 'acompte_30' && order.balance_validation_token) {
            const balanceConfirmUrl = `${baseUrl}/api/orders/confirm-payment?token=${encodeURIComponent(order.balance_validation_token)}&step=balance`;
            let sentTraiteurEmail = false;

            if (resend) {
                try {
                    const traiteurMail = generateTraiteurBalanceValidationEmail(order, balanceConfirmUrl);
                    const { error: traiteurErr } = await resend.emails.send({
                        from: FROM_EMAIL,
                        to: TRAITEUR_EMAIL,
                        replyTo: order.email,
                        subject: traiteurMail.subject,
                        html: traiteurMail.html
                    });
                    if (!traiteurErr) {
                        sentTraiteurEmail = true;
                    } else {
                        console.error(`Erreur Resend lien solde traiteur pour ${order.id}:`, traiteurErr);
                    }
                } catch (err) {
                    console.error(`Exception Resend lien solde traiteur pour ${order.id}:`, err);
                }
            }

            balanceLinkBox = {
                url: balanceConfirmUrl,
                balanceFormatted: formatPrice(order.balance_remaining),
                alreadySentByEmail: sentTraiteurEmail
            };
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
                highlightLabel: 'Montant validé :',
                highlightAmount: `${amountFormatted} €`,
                balanceLinkBox,
                emailWarning
            }),
            { status: 200, headers: HTML_HEADERS }
        );
    } catch (err) {
        console.error('Erreur critique POST /api/orders/confirm-payment:', err);
        return new NextResponse(
            renderAdminHtmlPage({
                variant: 'error',
                title: 'Erreur technique',
                message: 'Une erreur serveur est survenue lors de la validation du paiement. Veuillez réessayer.'
            }),
            { status: 500, headers: HTML_HEADERS }
        );
    }
}
