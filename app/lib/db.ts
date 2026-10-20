import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

export interface FestiveOrderRecord {
    id: string; // ex: 'NOEL-64053'
    created_at?: string;
    updated_at?: string;
    reminder_sent_at?: string | null;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    repas_date: string;
    retrait_slot: string;
    payment_mode: 'acompte_30' | 'total_100';
    status: 'en_attente' | 'acompte_valide' | 'solde_regle' | string;
    total_initial: number;
    early_bird_discount: number;
    amount_paid_initial: number;
    balance_remaining: number;
    items: any[];
    additional_items?: any[];
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
                prenom VARCHAR(100) NOT NULL,
                nom VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telephone VARCHAR(50) NOT NULL,
                repas_date VARCHAR(50) NOT NULL,
                retrait_slot VARCHAR(100) NOT NULL,
                payment_mode VARCHAR(20) NOT NULL,
                status VARCHAR(30) DEFAULT 'en_attente',
                total_initial NUMERIC(10, 2) NOT NULL,
                early_bird_discount NUMERIC(10, 2) DEFAULT 0,
                amount_paid_initial NUMERIC(10, 2) NOT NULL,
                balance_remaining NUMERIC(10, 2) NOT NULL,
                items JSONB NOT NULL,
                additional_items JSONB DEFAULT '[]'::jsonb,
                notes TEXT
            );
        `;

        // Évolution de schéma : ajout idempotent de la colonne reminder_sent_at si table existante
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
        `;

        isTableInitialized = true;
        return true;
    } catch (err) {
        console.error("Erreur ensureFestiveOrdersTable:", err);
        return false;
    }
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
                amount_paid_initial, balance_remaining, items, additional_items, notes, reminder_sent_at
            ) VALUES (
                ${order.id},
                ${order.prenom},
                ${order.nom},
                ${order.email.toLowerCase().trim()},
                ${order.telephone},
                ${order.repas_date},
                ${order.retrait_slot},
                ${order.payment_mode},
                ${order.status || 'en_attente'},
                ${order.total_initial},
                ${order.early_bird_discount || 0},
                ${order.amount_paid_initial},
                ${order.balance_remaining},
                ${JSON.stringify(order.items)},
                ${JSON.stringify(order.additional_items || [])},
                ${order.notes || ''},
                ${order.reminder_sent_at || null}
            )
            ON CONFLICT (id) DO UPDATE SET
                updated_at = CURRENT_TIMESTAMP,
                total_initial = EXCLUDED.total_initial,
                amount_paid_initial = EXCLUDED.amount_paid_initial,
                balance_remaining = EXCLUDED.balance_remaining,
                items = EXCLUDED.items,
                additional_items = EXCLUDED.additional_items,
                notes = EXCLUDED.notes;
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
                const row = rows[0] as any;
                if (cleanEmail && row.email.toLowerCase().trim() !== cleanEmail) {
                    return null;
                }

                return {
                    id: row.id,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    reminder_sent_at: row.reminder_sent_at ? new Date(row.reminder_sent_at).toISOString() : null,
                    prenom: row.prenom,
                    nom: row.nom,
                    email: row.email,
                    telephone: row.telephone,
                    repas_date: row.repas_date,
                    retrait_slot: row.retrait_slot,
                    payment_mode: row.payment_mode,
                    status: row.status,
                    total_initial: Number(row.total_initial),
                    early_bird_discount: Number(row.early_bird_discount || 0),
                    amount_paid_initial: Number(row.amount_paid_initial),
                    balance_remaining: Number(row.balance_remaining),
                    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
                    additional_items: typeof row.additional_items === 'string' ? JSON.parse(row.additional_items) : (row.additional_items || []),
                    notes: row.notes || ''
                };
            }
        } catch (err) {
            console.error("Erreur getFestiveOrder SQL:", err);
        }
    }

    return getFallbackOrder(cleanId, cleanEmail);
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

            return (rows || []).map((row: any) => ({
                id: row.id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                reminder_sent_at: row.reminder_sent_at ? new Date(row.reminder_sent_at).toISOString() : null,
                prenom: row.prenom,
                nom: row.nom,
                email: row.email,
                telephone: row.telephone,
                repas_date: row.repas_date,
                retrait_slot: row.retrait_slot,
                payment_mode: row.payment_mode,
                status: row.status,
                total_initial: Number(row.total_initial),
                early_bird_discount: Number(row.early_bird_discount || 0),
                amount_paid_initial: Number(row.amount_paid_initial),
                balance_remaining: Number(row.balance_remaining),
                items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
                additional_items: typeof row.additional_items === 'string' ? JSON.parse(row.additional_items) : (row.additional_items || []),
                notes: row.notes || ''
            }));
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
    newAdditionalItems: any[],
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
