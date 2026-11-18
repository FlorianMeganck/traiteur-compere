import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

export interface FestiveOrderItem {
    id?: string;
    nomPlat?: string;
    title?: string;
    nom?: string;
    name?: string;
    prixUnitairePlat?: number;
    quantitePlat?: number;
    quantite?: number;
    qty?: number;
    quantity?: number;
    soupes?: Record<string, number>;
    prixUnitaireSoupe?: number;
    prixTotalLigne?: number;
    semaineId?: string;
    jour?: string;
    itemType?: 'plat_prepare' | 'menu_fete' | string;
    badge?: string;
    coursesSummary?: string[];
    coursesDescription?: string;
    isAddition?: boolean;
    totalPrice?: number;
    [key: string]: unknown;
}

export interface FestiveOrderRecord {
    id: string; // ex: 'NOEL-64053'
    created_at?: string;
    updated_at?: string;
    reminder_sent_at?: string | null;
    validation_token?: string | null;
    payment_validated_at?: string | null;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    repas_date: string;
    retrait_slot: string;
    payment_mode: 'acompte_30' | 'total_100';
    status: 'pending_payment' | 'deposit_paid' | 'fully_paid' | 'en_attente' | 'acompte_valide' | 'solde_regle' | string;
    total_initial: number;
    early_bird_discount: number;
    amount_paid_initial: number;
    balance_remaining: number;
    items: FestiveOrderItem[];
    additional_items?: FestiveOrderItem[];
    notes?: string;
}

// Fallback fichier / mémoire pour dev sans POSTGRES_URL configurée
const memoryFallbackOrders = new Map<string, FestiveOrderRecord>();
const DEV_FILE_PATH = path.join(process.cwd(), '.festive_orders_dev.json');

function loadDevFallbackOrders(): void {
    try {
        if (fs.existsSync(DEV_FILE_PATH)) {
            const raw = fs.readFileSync(DEV_FILE_PATH, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                parsed.forEach((o: FestiveOrderRecord) => {
                    if (o && o.id) memoryFallbackOrders.set(o.id.toUpperCase(), o);
                });
            }
        }
    } catch {
        // Silencieux si échec
    }
}

function saveFallbackOrder(order: FestiveOrderRecord): void {
    const idKey = order.id.toUpperCase();
    memoryFallbackOrders.set(idKey, order);
    try {
        const arr = Array.from(memoryFallbackOrders.values());
        fs.writeFileSync(DEV_FILE_PATH, JSON.stringify(arr, null, 2), 'utf-8');
    } catch {
        // Silencieux
    }
}

function getFallbackOrder(orderId: string, email?: string): FestiveOrderRecord | null {
    loadDevFallbackOrders();
    const idKey = orderId.toUpperCase();
    const found = memoryFallbackOrders.get(idKey);
    if (!found) return null;
    if (email && found.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
        return null;
    }
    return found;
}

function getDatabaseUrl(): string | null {
    return process.env.POSTGRES_URL ||
        process.env.DATABASE_URL ||
        process.env.POSTGRES_PRISMA_URL ||
        process.env.POSTGRES_URL_NON_POOLING ||
        null;
}

export function getDb(): NeonQueryFunction<false, false> | null {
    const url = getDatabaseUrl();
    if (!url) return null;
    try {
        return neon(url);
    } catch (err) {
        console.error("Erreur initialisation client Neon/Postgres:", err);
        return null;
    }
}

let isTableInitialized = false;

export async function ensureFestiveOrdersTable(): Promise<boolean> {
    const sql = getDb();
    if (!sql) return false;
    if (isTableInitialized) return true;

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS festive_orders (
                id VARCHAR(30) PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                reminder_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
                validation_token VARCHAR(100) UNIQUE DEFAULT NULL,
                payment_validated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
                prenom VARCHAR(100) NOT NULL,
                nom VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telephone VARCHAR(50) NOT NULL,
                repas_date VARCHAR(50) NOT NULL,
                retrait_slot VARCHAR(100) NOT NULL,
                payment_mode VARCHAR(20) NOT NULL,
                status VARCHAR(30) DEFAULT 'pending_payment',
                total_initial NUMERIC(10, 2) NOT NULL,
                early_bird_discount NUMERIC(10, 2) DEFAULT 0,
                amount_paid_initial NUMERIC(10, 2) NOT NULL,
                balance_remaining NUMERIC(10, 2) NOT NULL,
                items JSONB NOT NULL,
                additional_items JSONB DEFAULT '[]'::jsonb,
                notes TEXT
            );
        `;

        // Évolutions de schéma idempotentes si table déjà existante
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS validation_token VARCHAR(100) DEFAULT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS payment_validated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
        `;
        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_festive_orders_validation_token
            ON festive_orders (validation_token)
            WHERE validation_token IS NOT NULL;
        `;

        isTableInitialized = true;
        return true;
    } catch (err) {
        console.error("Erreur ensureFestiveOrdersTable:", err);
        return false;
    }
}

function mapRowToOrder(row: Record<string, unknown>): FestiveOrderRecord {
    return {
        id: String(row.id),
        created_at: row.created_at ? String(row.created_at) : undefined,
        updated_at: row.updated_at ? String(row.updated_at) : undefined,
        reminder_sent_at: row.reminder_sent_at ? new Date(String(row.reminder_sent_at)).toISOString() : null,
        validation_token: row.validation_token ? String(row.validation_token) : null,
        payment_validated_at: row.payment_validated_at ? new Date(String(row.payment_validated_at)).toISOString() : null,
        prenom: String(row.prenom || ''),
        nom: String(row.nom || ''),
        email: String(row.email || ''),
        telephone: String(row.telephone || ''),
        repas_date: String(row.repas_date || ''),
        retrait_slot: String(row.retrait_slot || ''),
        payment_mode: row.payment_mode === 'acompte_30' ? 'acompte_30' : 'total_100',
        status: String(row.status || 'pending_payment'),
        total_initial: Number(row.total_initial || 0),
        early_bird_discount: Number(row.early_bird_discount || 0),
        amount_paid_initial: Number(row.amount_paid_initial || 0),
        balance_remaining: Number(row.balance_remaining || 0),
        items: typeof row.items === 'string' ? JSON.parse(row.items) : ((row.items as FestiveOrderItem[]) || []),
        additional_items: typeof row.additional_items === 'string' ? JSON.parse(row.additional_items) : ((row.additional_items as FestiveOrderItem[]) || []),
        notes: row.notes ? String(row.notes) : ''
    };
}

export async function insertFestiveOrder(order: FestiveOrderRecord): Promise<boolean> {
    const sql = getDb();
    saveFallbackOrder(order);

    if (!sql) {
        return true;
    }

    try {
        await ensureFestiveOrdersTable();
        await sql`
            INSERT INTO festive_orders (
                id, prenom, nom, email, telephone, repas_date, retrait_slot,
                payment_mode, status, total_initial, early_bird_discount,
                amount_paid_initial, balance_remaining, items, additional_items, notes,
                reminder_sent_at, validation_token, payment_validated_at
            ) VALUES (
                ${order.id},
                ${order.prenom},
                ${order.nom},
                ${order.email.toLowerCase().trim()},
                ${order.telephone},
                ${order.repas_date},
                ${order.retrait_slot},
                ${order.payment_mode},
                ${order.status || 'pending_payment'},
                ${order.total_initial},
                ${order.early_bird_discount || 0},
                ${order.amount_paid_initial},
                ${order.balance_remaining},
                ${JSON.stringify(order.items)},
                ${JSON.stringify(order.additional_items || [])},
                ${order.notes || ''},
                ${order.reminder_sent_at || null},
                ${order.validation_token || null},
                ${order.payment_validated_at || null}
            )
            ON CONFLICT (id) DO UPDATE SET
                updated_at = CURRENT_TIMESTAMP,
                total_initial = EXCLUDED.total_initial,
                amount_paid_initial = EXCLUDED.amount_paid_initial,
                balance_remaining = EXCLUDED.balance_remaining,
                items = EXCLUDED.items,
                additional_items = EXCLUDED.additional_items,
                notes = EXCLUDED.notes,
                validation_token = COALESCE(festive_orders.validation_token, EXCLUDED.validation_token);
        `;
        return true;
    } catch (err) {
        console.error("Erreur insertFestiveOrder SQL:", err);
        return false;
    }
}

export async function getFestiveOrder(orderId: string, email?: string): Promise<FestiveOrderRecord | null> {
    const rawId = (orderId || '').trim().toUpperCase();
    const cleanId = rawId.startsWith('NOEL-') ? rawId : `NOEL-${rawId}`;
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            const rows = await sql`
                SELECT * FROM festive_orders 
                WHERE UPPER(id) = ${cleanId}
                LIMIT 1;
            `;

            if (rows && rows.length > 0) {
                const row = rows[0] as Record<string, unknown>;
                const rowEmail = String(row.email || '').toLowerCase().trim();
                if (cleanEmail && rowEmail !== cleanEmail) {
                    return null;
                }

                return mapRowToOrder(row);
            }
        } catch (err) {
            console.error("Erreur getFestiveOrder SQL:", err);
        }
    }

    return getFallbackOrder(cleanId, cleanEmail);
}

export async function getFestiveOrderByToken(token: string): Promise<FestiveOrderRecord | null> {
    const cleanToken = (token || '').trim();
    if (!cleanToken) return null;

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            const rows = await sql`
                SELECT * FROM festive_orders
                WHERE validation_token = ${cleanToken}
                LIMIT 1;
            `;
            if (rows && rows.length > 0) {
                return mapRowToOrder(rows[0] as Record<string, unknown>);
            }
        } catch (err) {
            console.error("Erreur getFestiveOrderByToken SQL:", err);
        }
    }

    loadDevFallbackOrders();
    for (const order of memoryFallbackOrders.values()) {
        if (order.validation_token && order.validation_token === cleanToken) {
            return order;
        }
    }
    return null;
}

export async function confirmFestiveOrderPaymentByToken(token: string): Promise<{
    result: 'not_found' | 'already_validated' | 'validated';
    order?: FestiveOrderRecord;
}> {
    const cleanToken = (token || '').trim();
    if (!cleanToken) return { result: 'not_found' };

    const existing = await getFestiveOrderByToken(cleanToken);
    if (!existing) {
        return { result: 'not_found' };
    }

    const alreadyValidatedStatuses = ['deposit_paid', 'fully_paid', 'solde_regle'];
    if (alreadyValidatedStatuses.includes(existing.status) || Boolean(existing.payment_validated_at)) {
        return { result: 'already_validated', order: existing };
    }

    const nextStatus: 'deposit_paid' | 'fully_paid' =
        existing.payment_mode === 'acompte_30' ? 'deposit_paid' : 'fully_paid';
    const nowIso = new Date().toISOString();

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            // Mise à jour atomique conditionnelle pour garantir l'idempotence stricte même en cas de double clic simultané
            const updatedRows = await sql`
                UPDATE festive_orders
                SET status = ${nextStatus},
                    payment_validated_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE validation_token = ${cleanToken}
                  AND status NOT IN ('deposit_paid', 'fully_paid', 'solde_regle')
                  AND payment_validated_at IS NULL
                RETURNING *;
            `;

            if (!updatedRows || updatedRows.length === 0) {
                const refreshed = await getFestiveOrderByToken(cleanToken);
                return { result: 'already_validated', order: refreshed || existing };
            }

            const updatedOrder = mapRowToOrder(updatedRows[0] as Record<string, unknown>);
            saveFallbackOrder(updatedOrder);
            return { result: 'validated', order: updatedOrder };
        } catch (err) {
            console.error("Erreur confirmFestiveOrderPaymentByToken SQL:", err);
            throw err;
        }
    }

    // Fallback mémoire / dev
    existing.status = nextStatus;
    existing.payment_validated_at = nowIso;
    existing.updated_at = nowIso;
    saveFallbackOrder(existing);
    return { result: 'validated', order: existing };
}

export async function getFestiveOrdersPendingReminder(): Promise<FestiveOrderRecord[]> {
    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            const rows = await sql`
                SELECT * FROM festive_orders 
                WHERE reminder_sent_at IS NULL;
            `;

            return (rows || []).map((r) => mapRowToOrder(r as Record<string, unknown>));
        } catch (err) {
            console.error("Erreur getFestiveOrdersPendingReminder SQL:", err);
        }
    }

    // Fallback mémoire / dev
    loadDevFallbackOrders();
    return Array.from(memoryFallbackOrders.values()).filter(o => !o.reminder_sent_at);
}

export async function markFestiveOrderReminderSent(orderId: string): Promise<boolean> {
    const rawId = (orderId || '').trim().toUpperCase();
    const cleanId = rawId.startsWith('NOEL-') ? rawId : `NOEL-${rawId}`;
    const sql = getDb();
    const nowIso = new Date().toISOString();

    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            await sql`
                UPDATE festive_orders 
                SET reminder_sent_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE UPPER(id) = ${cleanId};
            `;
        } catch (err) {
            console.error("Erreur markFestiveOrderReminderSent SQL:", err);
            return false;
        }
    }

    // Mise à jour fallback dev
    loadDevFallbackOrders();
    const found = memoryFallbackOrders.get(cleanId);
    if (found) {
        found.reminder_sent_at = nowIso;
        saveFallbackOrder(found);
    }

    return true;
}

export async function updateFestiveOrderAdditions(
    orderId: string,
    email: string,
    newAdditionalItems: FestiveOrderItem[],
    newBalanceRemaining: number
): Promise<FestiveOrderRecord | null> {
    const existing = await getFestiveOrder(orderId, email);
    if (!existing) return null;

    const combinedAdditionalItems = [...(existing.additional_items || []), ...newAdditionalItems];
    const sql = getDb();

    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            await sql`
                UPDATE festive_orders SET
                    additional_items = ${JSON.stringify(combinedAdditionalItems)},
                    balance_remaining = ${newBalanceRemaining},
                    status = 'solde_en_attente',
                    updated_at = CURRENT_TIMESTAMP
                WHERE UPPER(id) = ${existing.id.toUpperCase()};
            `;
        } catch (err) {
            console.error("Erreur updateFestiveOrderAdditions SQL:", err);
        }
    }

    existing.additional_items = combinedAdditionalItems;
    existing.balance_remaining = newBalanceRemaining;
    existing.status = 'solde_en_attente';
    saveFallbackOrder(existing);

    return existing;
}

export async function updateFestiveOrderStatus(
    orderId: string,
    email: string,
    newStatus: string
): Promise<FestiveOrderRecord | null> {
    const existing = await getFestiveOrder(orderId, email);
    if (!existing) return null;

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            await sql`
                UPDATE festive_orders SET
                    status = ${newStatus},
                    updated_at = CURRENT_TIMESTAMP
                WHERE UPPER(id) = ${existing.id.toUpperCase()};
            `;
        } catch (err) {
            console.error("Erreur updateFestiveOrderStatus SQL:", err);
        }
    }

    existing.status = newStatus;
    saveFallbackOrder(existing);
    return existing;
}
