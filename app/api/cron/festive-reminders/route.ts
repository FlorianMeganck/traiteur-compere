import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
    getFestiveOrdersPendingReminder,
    getFestiveOrder,
    markFestiveOrderReminderSent,
    VALIDATED_REMINDER_STATUSES,
    FestiveOrderRecord
} from '../../../lib/db';
import {
    isOrderDueForReminder,
    generateReminderEmailAcompte,
    generateReminderEmailSoldé
} from '../../../lib/festive-reminders';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey.startsWith('re_')) ? new Resend(resendApiKey) : null;
const FROM_EMAIL = 'Traiteur Compère <contact@traiteur-compere.be>';

/**
 * Vérification stricte de sécurité :
 * - En production : exige exclusivement le header "Authorization: Bearer <CRON_SECRET>"
 * - Hors production : autorise l'exécution locale en dev, mais bloque les paramètres sensibles sans CRON_SECRET
 */
function evaluateAuth(req: Request): { authorized: boolean; hasCronSecret: boolean } {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET?.trim();
    const hasCronSecret = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

    if (process.env.NODE_ENV === 'production') {
        return { authorized: hasCronSecret, hasCronSecret };
    }

    return { authorized: true, hasCronSecret };
}

async function handleCronExecution(req: Request) {
    // 1. Sécurité
    const { authorized, hasCronSecret } = evaluateAuth(req);
    if (!authorized) {
        return NextResponse.json({
            success: false,
            error: 'Unauthorized'
        }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hasDangerousTestParams = searchParams.has('forceSend') || searchParams.has('targetDate');
    if (hasDangerousTestParams && !hasCronSecret) {
        return NextResponse.json({
            success: false,
            error: 'Forbidden: forceSend et targetDate exigent une authentification Bearer CRON_SECRET.'
        }, { status: 403 });
    }

    const dryRun = searchParams.get('dryRun') === 'true';
    const forceOrderId = searchParams.get('order') || searchParams.get('orderId');
    const forceSend = hasCronSecret && searchParams.get('forceSend') === 'true';
    const targetDateParam = hasCronSecret ? searchParams.get('targetDate') : null; // YYYY-MM-DD pour simulation authentifiée
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
            // Vérification défensive : ignorer strictement toute commande dont le paiement initial n'est pas validé
            if (
                order.status === 'pending_payment' ||
                order.status === 'en_attente' ||
                !(VALIDATED_REMINDER_STATUSES as readonly string[]).includes(order.status)
            ) {
                skippedCount++;
                results.push({
                    orderId: order.id,
                    email: order.email,
                    mode: order.payment_mode,
                    balanceRemaining: Number(order.balance_remaining || 0),
                    repasDate: order.repas_date,
                    retraitSlot: order.retrait_slot,
                    diffPickupDays: null,
                    diffMealDays: null,
                    status: 'skipped'
                });
                continue;
            }

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
                order.status !== 'solde_regle' &&
                order.status !== 'fully_paid';

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
                } catch (sendEx: unknown) {
                    console.error(`Exception envoi rappel pour ${order.id}:`, sendEx);
                    errorCount++;
                    const sendErrorMsg = sendEx instanceof Error ? sendEx.message : 'Erreur inconnue';
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
                        error: sendErrorMsg
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

    } catch (err: unknown) {
        console.error("Erreur générale Cron /api/cron/festive-reminders:", err);
        const generalErrorMsg = err instanceof Error ? err.message : 'Erreur interne lors de l\'exécution du rappel';
        return NextResponse.json({
            success: false,
            error: generalErrorMsg
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
