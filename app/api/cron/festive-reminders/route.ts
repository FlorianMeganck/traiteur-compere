import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
    getFestiveOrdersPendingReminder,
    getFestiveOrder,
    markFestiveOrderReminderSent,
    FestiveOrderRecord
} from '../../../lib/db';
import {
    isOrderDueForReminder,
    generateReminderEmailAcompte,
    generateReminderEmailSoldé,
    parseRepasDate,
    getEffectivePickupDate,
    getDiffCalendarDays
} from '../../../lib/festive-reminders';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;
const FROM_EMAIL = 'Traiteur Compère <contact@traiteur-compere.be>';

/**
 * Vérification de sécurité :
 * - Vercel Cron Job envoie le header "Authorization: Bearer <CRON_SECRET>"
 * - Permet également le test manuel via ?secret=<CRON_SECRET>
 * - Autorise l'exécution locale en dev si CRON_SECRET n'est pas encore défini
 */
function isAuthorized(req: Request): boolean {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get('secret');

    // 1. Si CRON_SECRET est configuré (production / Vercel)
    if (cronSecret) {
        if (authHeader === `Bearer ${cronSecret}`) return true;
        if (querySecret === cronSecret) return true;
        return false;
    }

    // 2. En local / dev si CRON_SECRET n'est pas encore défini
    if (process.env.NODE_ENV !== 'production') {
        return true;
    }

    // 3. En production sans secret configuré : refus par sécurité
    return false;
}

async function handleCronExecution(req: Request) {
    // 1. Sécurité
    if (!isAuthorized(req)) {
        return NextResponse.json({
            success: false,
            error: 'Accès non autorisé. Header Authorization Bearer ou paramètre ?secret invalide.'
        }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dryRun = searchParams.get('dryRun') === 'true';
    const forceOrderId = searchParams.get('order') || searchParams.get('orderId');
    const forceSend = searchParams.get('forceSend') === 'true';
    const targetDateParam = searchParams.get('targetDate'); // YYYY-MM-DD pour simulation
    const allowCatchUp = searchParams.get('catchUp') === 'true';

    // Date de référence (aujourd'hui ou date simulée pour test)
    let referenceDate = new Date();
    if (targetDateParam) {
        const parsedTarget = new Date(targetDateParam);
        if (!isNaN(parsedTarget.getTime())) {
            referenceDate = parsedTarget;
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://www.traiteur-compere.be');

    try {
        // 2. Récupération des commandes cibles
        let candidates: FestiveOrderRecord[] = [];

        if (forceOrderId) {
            // Test ciblé sur une commande précise
            const singleOrder = await getFestiveOrder(forceOrderId);
            if (singleOrder) {
                candidates = [singleOrder];
            } else {
                return NextResponse.json({
                    success: false,
                    error: `Commande ${forceOrderId} introuvable.`
                }, { status: 404 });
            }
        } else {
            // Requête SQL / Neon : commandes sans rappel déjà envoyé
            candidates = await getFestiveOrdersPendingReminder();
        }

        const results: Array<{
            orderId: string;
            email: string;
            mode: 'acompte_30' | 'total_100';
            balanceRemaining: number;
            repasDate: string;
            retraitSlot: string;
            diffPickupDays: number | null;
            diffMealDays: number | null;
            status: 'sent' | 'simulated' | 'skipped' | 'error';
            subject?: string;
            error?: string;
        }> = [];

        let sentCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // 3. Traitement de chaque commande
        for (const order of candidates) {
            const check = isOrderDueForReminder(order, referenceDate, { allowCatchUp });
            const isEligible = forceSend || check.isDue;

            if (!isEligible) {
                skippedCount++;
                results.push({
                    orderId: order.id,
                    email: order.email,
                    mode: order.payment_mode,
                    balanceRemaining: Number(order.balance_remaining || 0),
                    repasDate: order.repas_date,
                    retraitSlot: order.retrait_slot,
                    diffPickupDays: check.diffPickup,
                    diffMealDays: check.diffMeal,
                    status: 'skipped'
                });
                continue;
            }

            // Détermination du template selon le mode de paiement et le solde restant
            const hasPendingBalance = order.payment_mode === 'acompte_30' &&
                Number(order.balance_remaining || 0) > 0 &&
                order.status !== 'solde_regle';

            const emailData = hasPendingBalance
                ? generateReminderEmailAcompte(order, baseUrl)
                : generateReminderEmailSoldé(order, baseUrl);

            // Envoi de l'email
            if (dryRun) {
                // Mode simulation : on n'envoie rien et on ne touche pas à la DB
                results.push({
                    orderId: order.id,
                    email: order.email,
                    mode: hasPendingBalance ? 'acompte_30' : 'total_100',
                    balanceRemaining: Number(order.balance_remaining || 0),
                    repasDate: order.repas_date,
                    retraitSlot: order.retrait_slot,
                    diffPickupDays: check.diffPickup,
                    diffMealDays: check.diffMeal,
                    status: 'simulated',
                    subject: emailData.subject
                });
                sentCount++;
            } else {
                try {
                    if (resend) {
                        const { error: sendError } = await resend.emails.send({
                            from: FROM_EMAIL,
                            to: order.email,
                            replyTo: 'contact@traiteur-compere.be',
                            subject: emailData.subject,
                            html: emailData.html
                        });

                        if (sendError) {
                            console.error(`Erreur Resend rappel pour ${order.id}:`, sendError);
                            errorCount++;
                            results.push({
                                orderId: order.id,
                                email: order.email,
                                mode: hasPendingBalance ? 'acompte_30' : 'total_100',
                                balanceRemaining: Number(order.balance_remaining || 0),
                                repasDate: order.repas_date,
                                retraitSlot: order.retrait_slot,
                                diffPickupDays: check.diffPickup,
                                diffMealDays: check.diffMeal,
                                status: 'error',
                                subject: emailData.subject,
                                error: String(sendError.message || sendError)
                            });
                            continue;
                        }
                    } else {
                        console.log(`[Rappel Fêtes J-10] Clé Resend non active - Envoi simulé pour ${order.id} (${order.email})`);
                    }

                    // Mise à jour immédiate en base (UPDATE festive_orders SET reminder_sent_at = NOW())
                    await markFestiveOrderReminderSent(order.id);

                    sentCount++;
                    results.push({
                        orderId: order.id,
                        email: order.email,
                        mode: hasPendingBalance ? 'acompte_30' : 'total_100',
                        balanceRemaining: Number(order.balance_remaining || 0),
                        repasDate: order.repas_date,
                        retraitSlot: order.retrait_slot,
                        diffPickupDays: check.diffPickup,
                        diffMealDays: check.diffMeal,
                        status: 'sent',
                        subject: emailData.subject
                    });
                } catch (sendEx: any) {
                    console.error(`Exception envoi rappel pour ${order.id}:`, sendEx);
                    errorCount++;
                    results.push({
                        orderId: order.id,
                        email: order.email,
                        mode: hasPendingBalance ? 'acompte_30' : 'total_100',
                        balanceRemaining: Number(order.balance_remaining || 0),
                        repasDate: order.repas_date,
                        retraitSlot: order.retrait_slot,
                        diffPickupDays: check.diffPickup,
                        diffMealDays: check.diffMeal,
                        status: 'error',
                        subject: emailData.subject,
                        error: sendEx?.message || 'Erreur inconnue'
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            executionDate: new Date().toISOString(),
            referenceDate: referenceDate.toISOString(),
            dryRun,
            stats: {
                totalCandidates: candidates.length,
                processed: candidates.length,
                sent: sentCount,
                skipped: skippedCount,
                errors: errorCount
            },
            results
        });

    } catch (err: any) {
        console.error("Erreur générale Cron /api/cron/festive-reminders:", err);
        return NextResponse.json({
            success: false,
            error: err?.message || 'Erreur interne lors de l\'exécution du rappel'
        }, { status: 500 });
    }
}

// Vercel Cron invoque les endpoints en GET
export async function GET(req: Request) {
    return handleCronExecution(req);
}

// Support également de POST si invoqué via webhook / test
export async function POST(req: Request) {
    return handleCronExecution(req);
}
