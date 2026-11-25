import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import crypto from 'crypto';
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
    balance_validation_token?: string | null;
    balance_validated_at?: string | null;
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
    resume_commande?: string | null;
    notes?: string;
}

/**
 * Retourne l'horodatage courant à l'heure de Bruxelles (YYYY-MM-DD HH:mm:ss)
 */
export function getBrusselsTimestamp(date: Date = new Date()): string {
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Brussels',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
}

/**
 * Normalise une valeur TIMESTAMP issue de Postgres/Neon sans décalage UTC
 */
function normalizeDbTimestamp(raw: unknown): string | null {
    if (!raw) return null;
    if (raw instanceof Date) {
        if (isNaN(raw.getTime())) return null;
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${raw.getFullYear()}-${pad(raw.getMonth() + 1)}-${pad(raw.getDate())} ${pad(raw.getHours())}:${pad(raw.getMinutes())}:${pad(raw.getSeconds())}`;
    }
    const str = String(raw).trim();
    if (!str) return null;
    // Si la chaîne comporte encore un offset explicite (ex: ancien format ISO), convertir en Europe/Brussels
    if (/[+-]\d{2}:?\d{2}$|Z$/i.test(str)) {
        const parsed = new Date(str);
        if (!isNaN(parsed.getTime())) {
            return getBrusselsTimestamp(parsed);
        }
    }
    return str.replace('T', ' ').replace(/\.\d+$/, '');
}

/**
 * Formate une liste d'articles en texte lisible pour la colonne resume_commande
 * Ex: "1x Formule Réveillon (59€) [Velouté de potiron, Foie gras, Pintadeau, Bûchette] | 4x Blini de maquereau (4€)"
 */
export function formatFestiveItemsSummary(items: FestiveOrderItem[]): string {
    if (!Array.isArray(items) || items.length === 0) return '';

    return items
        .map((item) => {
            const qty = Number(item.quantitePlat ?? item.quantite ?? item.qty ?? item.quantity ?? 1);
            const rawTitle = String(item.nomPlat || item.title || item.nom || item.name || 'Article').trim();
            const unitPrice = Number(item.prixUnitairePlat || 0);
            const hasPriceInTitle = /\(\d+(?:[.,]\d+)?\s*€\)/.test(rawTitle);
            const titleWithPrice = !hasPriceInTitle && unitPrice > 0
                ? `${rawTitle} (${Number.isInteger(unitPrice) ? unitPrice : unitPrice.toFixed(2).replace('.', ',')}€)`
                : rawTitle;

            let coursesText = '';
            if (Array.isArray(item.coursesSummary) && item.coursesSummary.length > 0) {
                const cleanedCourses = item.coursesSummary
                    .map((line) => {
                        const s = String(line || '').trim();
                        const colonIdx = s.indexOf(':');
                        const afterColon = colonIdx !== -1 ? s.slice(colonIdx + 1).trim() : s;
                        return afterColon.replace(/^[•\-*]\s*/, '').trim();
                    })
                    .filter(Boolean);

                if (cleanedCourses.length > 0) {
                    coursesText = ` [${cleanedCourses.join(', ')}]`;
                }
            } else if (
                item.coursesDescription &&
                typeof item.coursesDescription === 'string' &&
                !item.coursesDescription.includes('€ /')
            ) {
                coursesText = ` [${item.coursesDescription.trim()}]`;
            }

            return `${qty}x ${titleWithPrice}${coursesText}`;
        })
        .filter(Boolean)
        .join(' | ');
}

/**
 * Construit le texte complet de resume_commande (commande initiale + éventuels ajouts)
 */
export function buildFestiveOrderResume(
    items: FestiveOrderItem[],
    additionalItems?: FestiveOrderItem[]
): string {
    const initialSummary = formatFestiveItemsSummary(items || []);
    const additionsSummary = formatFestiveItemsSummary(additionalItems || []);

    if (initialSummary && additionsSummary) {
        return `${initialSummary} | + AJOUT : ${additionsSummary}`;
    }
    if (additionsSummary) {
        return `+ AJOUT : ${additionsSummary}`;
    }
    return initialSummary;
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
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                reminder_sent_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
                validation_token VARCHAR(100) UNIQUE DEFAULT NULL,
                payment_validated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
                balance_validation_token VARCHAR(100) UNIQUE DEFAULT NULL,
                balance_validated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
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
                resume_commande TEXT DEFAULT NULL,
                notes TEXT
            );
        `;

        // Évolutions de schéma idempotentes si table déjà existante
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS validation_token VARCHAR(100) DEFAULT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS payment_validated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL;
        `;
        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_festive_orders_validation_token
            ON festive_orders (validation_token)
            WHERE validation_token IS NOT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS balance_validation_token VARCHAR(100) DEFAULT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders 
            ADD COLUMN IF NOT EXISTS balance_validated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL;
        `;
        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_festive_orders_balance_token
            ON festive_orders (balance_validation_token)
            WHERE balance_validation_token IS NOT NULL;
        `;
        await sql`
            ALTER TABLE festive_orders
            ADD COLUMN IF NOT EXISTS resume_commande TEXT DEFAULT NULL;
        `;

        // Migration idempotente des colonnes TIMESTAMP WITH TIME ZONE existantes vers TIMESTAMP (heure de Bruxelles)
        const tzCols = await sql`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'festive_orders'
              AND column_name IN ('created_at', 'updated_at', 'reminder_sent_at', 'payment_validated_at', 'balance_validated_at');
        `;

        const tzColMap = new Map<string, string>();
        for (const col of tzCols || []) {
            const rec = col as Record<string, unknown>;
            tzColMap.set(String(rec.column_name), String(rec.data_type));
        }

        if (tzColMap.get('created_at') === 'timestamp with time zone') {
            await sql`ALTER TABLE festive_orders ALTER COLUMN created_at DROP DEFAULT;`;
            await sql`
                ALTER TABLE festive_orders
                ALTER COLUMN created_at TYPE TIMESTAMP WITHOUT TIME ZONE
                USING (created_at AT TIME ZONE 'Europe/Brussels');
            `;
        }
        await sql`
            ALTER TABLE festive_orders
            ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels');
        `;

        if (tzColMap.get('updated_at') === 'timestamp with time zone') {
            await sql`ALTER TABLE festive_orders ALTER COLUMN updated_at DROP DEFAULT;`;
            await sql`
                ALTER TABLE festive_orders
                ALTER COLUMN updated_at TYPE TIMESTAMP WITHOUT TIME ZONE
                USING (updated_at AT TIME ZONE 'Europe/Brussels');
            `;
        }
        await sql`
            ALTER TABLE festive_orders
            ALTER COLUMN updated_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels');
        `;

        if (tzColMap.get('reminder_sent_at') === 'timestamp with time zone') {
            await sql`ALTER TABLE festive_orders ALTER COLUMN reminder_sent_at DROP DEFAULT;`;
            await sql`
                ALTER TABLE festive_orders
                ALTER COLUMN reminder_sent_at TYPE TIMESTAMP WITHOUT TIME ZONE
                USING (reminder_sent_at AT TIME ZONE 'Europe/Brussels');
            `;
            await sql`ALTER TABLE festive_orders ALTER COLUMN reminder_sent_at SET DEFAULT NULL;`;
        }

        if (tzColMap.get('payment_validated_at') === 'timestamp with time zone') {
            await sql`ALTER TABLE festive_orders ALTER COLUMN payment_validated_at DROP DEFAULT;`;
            await sql`
                ALTER TABLE festive_orders
                ALTER COLUMN payment_validated_at TYPE TIMESTAMP WITHOUT TIME ZONE
                USING (payment_validated_at AT TIME ZONE 'Europe/Brussels');
            `;
            await sql`ALTER TABLE festive_orders ALTER COLUMN payment_validated_at SET DEFAULT NULL;`;
        }

        if (tzColMap.get('balance_validated_at') === 'timestamp with time zone') {
            await sql`ALTER TABLE festive_orders ALTER COLUMN balance_validated_at DROP DEFAULT;`;
            await sql`
                ALTER TABLE festive_orders
                ALTER COLUMN balance_validated_at TYPE TIMESTAMP WITHOUT TIME ZONE
                USING (balance_validated_at AT TIME ZONE 'Europe/Brussels');
            `;
            await sql`ALTER TABLE festive_orders ALTER COLUMN balance_validated_at SET DEFAULT NULL;`;
        }

        // Rétro-remplissage automatique de resume_commande pour les éventuelles commandes déjà présentes
        try {
            const missingResumeRows = await sql`
                SELECT id, items, additional_items
                FROM festive_orders
                WHERE resume_commande IS NULL OR resume_commande = '';
            `;
            for (const r of missingResumeRows || []) {
                const rowRec = r as Record<string, unknown>;
                const parsedItems = typeof rowRec.items === 'string'
                    ? JSON.parse(rowRec.items)
                    : ((rowRec.items as FestiveOrderItem[]) || []);
                const parsedAdditions = typeof rowRec.additional_items === 'string'
                    ? JSON.parse(rowRec.additional_items)
                    : ((rowRec.additional_items as FestiveOrderItem[]) || []);
                const generatedResume = buildFestiveOrderResume(parsedItems, parsedAdditions);
                if (generatedResume) {
                    await sql`
                        UPDATE festive_orders
                        SET resume_commande = ${generatedResume}
                        WHERE id = ${String(rowRec.id)};
                    `;
                }
            }
        } catch (backfillErr) {
            console.error("Erreur non-bloquante backfill resume_commande:", backfillErr);
        }

        isTableInitialized = true;
        return true;
    } catch (err) {
        console.error("Erreur ensureFestiveOrdersTable:", err);
        return false;
    }
}

function mapRowToOrder(row: Record<string, unknown>): FestiveOrderRecord {
    const parsedItems = typeof row.items === 'string' ? JSON.parse(row.items) : ((row.items as FestiveOrderItem[]) || []);
    const parsedAdditional = typeof row.additional_items === 'string' ? JSON.parse(row.additional_items) : ((row.additional_items as FestiveOrderItem[]) || []);
    return {
        id: String(row.id),
        created_at: normalizeDbTimestamp(row.created_at) ?? undefined,
        updated_at: normalizeDbTimestamp(row.updated_at) ?? undefined,
        reminder_sent_at: normalizeDbTimestamp(row.reminder_sent_at),
        validation_token: row.validation_token ? String(row.validation_token) : null,
        payment_validated_at: normalizeDbTimestamp(row.payment_validated_at),
        balance_validation_token: row.balance_validation_token ? String(row.balance_validation_token) : null,
        balance_validated_at: normalizeDbTimestamp(row.balance_validated_at),
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
        items: parsedItems,
        additional_items: parsedAdditional,
        resume_commande: row.resume_commande
            ? String(row.resume_commande)
            : buildFestiveOrderResume(parsedItems, parsedAdditional),
        notes: row.notes ? String(row.notes) : ''
    };
}

export async function insertFestiveOrder(order: FestiveOrderRecord): Promise<boolean> {
    const sql = getDb();
    const nowBrussels = getBrusselsTimestamp();
    const resumeCommande = (order.resume_commande && order.resume_commande.trim())
        ? order.resume_commande.trim()
        : buildFestiveOrderResume(order.items, order.additional_items);

    const enrichedOrder: FestiveOrderRecord = {
        ...order,
        created_at: order.created_at || nowBrussels,
        updated_at: order.updated_at || nowBrussels,
        resume_commande: resumeCommande
    };

    if (!sql) {
        loadDevFallbackOrders();
        const idKey = enrichedOrder.id.toUpperCase();
        if (memoryFallbackOrders.has(idKey)) {
            return false;
        }
        saveFallbackOrder(enrichedOrder);
        return true;
    }

    try {
        await ensureFestiveOrdersTable();
        const insertedRows = await sql`
            INSERT INTO festive_orders (
                id, created_at, updated_at, prenom, nom, email, telephone, repas_date, retrait_slot,
                payment_mode, status, total_initial, early_bird_discount,
                amount_paid_initial, balance_remaining, items, additional_items, resume_commande, notes,
                reminder_sent_at, validation_token, payment_validated_at
            ) VALUES (
                ${enrichedOrder.id},
                (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                ${enrichedOrder.prenom},
                ${enrichedOrder.nom},
                ${enrichedOrder.email.toLowerCase().trim()},
                ${enrichedOrder.telephone},
                ${enrichedOrder.repas_date},
                ${enrichedOrder.retrait_slot},
                ${enrichedOrder.payment_mode},
                ${enrichedOrder.status || 'pending_payment'},
                ${enrichedOrder.total_initial},
                ${enrichedOrder.early_bird_discount || 0},
                ${enrichedOrder.amount_paid_initial},
                ${enrichedOrder.balance_remaining},
                ${JSON.stringify(enrichedOrder.items)},
                ${JSON.stringify(enrichedOrder.additional_items || [])},
                ${resumeCommande},
                ${enrichedOrder.notes || ''},
                ${enrichedOrder.reminder_sent_at || null},
                ${enrichedOrder.validation_token || null},
                ${enrichedOrder.payment_validated_at || null}
            )
            ON CONFLICT (id) DO NOTHING
            RETURNING id;
        `;

        if (!insertedRows || insertedRows.length === 0) {
            return false;
        }

        saveFallbackOrder(enrichedOrder);
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

    const alreadyValidatedStatuses = ['deposit_paid', 'fully_paid', 'solde_regle', 'solde_en_attente'];
    if (alreadyValidatedStatuses.includes(existing.status) || Boolean(existing.payment_validated_at)) {
        return { result: 'already_validated', order: existing };
    }

    const isDepositMode = existing.payment_mode === 'acompte_30';
    const nextStatus: 'deposit_paid' | 'fully_paid' = isDepositMode ? 'deposit_paid' : 'fully_paid';
    const balanceToken = isDepositMode ? (existing.balance_validation_token || crypto.randomUUID()) : null;
    const nowBrussels = getBrusselsTimestamp();

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            // Mise à jour atomique conditionnelle pour garantir l'idempotence stricte même en cas de double soumission
            const updatedRows = await sql`
                UPDATE festive_orders
                SET status = ${nextStatus},
                    payment_validated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                    balance_validation_token = COALESCE(balance_validation_token, ${balanceToken}),
                    updated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels')
                WHERE validation_token = ${cleanToken}
                  AND status NOT IN ('deposit_paid', 'fully_paid', 'solde_regle', 'solde_en_attente')
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
    existing.payment_validated_at = nowBrussels;
    existing.balance_validation_token = balanceToken;
    existing.updated_at = nowBrussels;
    saveFallbackOrder(existing);
    return { result: 'validated', order: existing };
}

export async function getFestiveOrderByBalanceToken(token: string): Promise<FestiveOrderRecord | null> {
    const cleanToken = (token || '').trim();
    if (!cleanToken) return null;

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            const rows = await sql`
                SELECT * FROM festive_orders
                WHERE balance_validation_token = ${cleanToken}
                LIMIT 1;
            `;
            if (rows && rows.length > 0) {
                return mapRowToOrder(rows[0] as Record<string, unknown>);
            }
        } catch (err) {
            console.error("Erreur getFestiveOrderByBalanceToken SQL:", err);
        }
    }

    loadDevFallbackOrders();
    for (const order of memoryFallbackOrders.values()) {
        if (order.balance_validation_token && order.balance_validation_token === cleanToken) {
            return order;
        }
    }
    return null;
}

export async function confirmFestiveOrderBalanceByToken(token: string): Promise<{
    result: 'not_found' | 'already_validated' | 'validated';
    order?: FestiveOrderRecord;
    balancePaidAmount?: number;
}> {
    const cleanToken = (token || '').trim();
    if (!cleanToken) return { result: 'not_found' };

    const existing = await getFestiveOrderByBalanceToken(cleanToken);
    if (!existing) {
        return { result: 'not_found' };
    }

    const fullyPaidStatuses = ['fully_paid', 'solde_regle'];
    if (fullyPaidStatuses.includes(existing.status) || Boolean(existing.balance_validated_at)) {
        return { result: 'already_validated', order: existing };
    }

    const balancePaidAmount = Number(existing.balance_remaining || 0);
    const nowBrussels = getBrusselsTimestamp();

    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            const updatedRows = await sql`
                UPDATE festive_orders
                SET status = 'fully_paid',
                    balance_remaining = 0,
                    balance_validated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                    updated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels')
                WHERE balance_validation_token = ${cleanToken}
                  AND status NOT IN ('fully_paid', 'solde_regle')
                  AND balance_validated_at IS NULL
                RETURNING *;
            `;

            if (!updatedRows || updatedRows.length === 0) {
                const refreshed = await getFestiveOrderByBalanceToken(cleanToken);
                return { result: 'already_validated', order: refreshed || existing };
            }

            const updatedOrder = mapRowToOrder(updatedRows[0] as Record<string, unknown>);
            saveFallbackOrder(updatedOrder);
            return { result: 'validated', order: updatedOrder, balancePaidAmount };
        } catch (err) {
            console.error("Erreur confirmFestiveOrderBalanceByToken SQL:", err);
            throw err;
        }
    }

    // Fallback mémoire / dev
    existing.status = 'fully_paid';
    existing.balance_remaining = 0;
    existing.balance_validated_at = nowBrussels;
    existing.updated_at = nowBrussels;
    saveFallbackOrder(existing);
    return { result: 'validated', order: existing, balancePaidAmount };
}

export const VALIDATED_REMINDER_STATUSES = [
    'deposit_paid',
    'solde_en_attente',
    'fully_paid',
    'solde_regle'
] as const;

export async function getFestiveOrdersPendingReminder(): Promise<FestiveOrderRecord[]> {
    const sql = getDb();
    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            const rows = await sql`
                SELECT * FROM festive_orders 
                WHERE reminder_sent_at IS NULL
                  AND status IN ('deposit_paid', 'solde_en_attente', 'fully_paid', 'solde_regle');
            `;

            return (rows || []).map((r) => mapRowToOrder(r as Record<string, unknown>));
        } catch (err) {
            console.error("Erreur getFestiveOrdersPendingReminder SQL:", err);
        }
    }

    // Fallback mémoire / dev
    loadDevFallbackOrders();
    return Array.from(memoryFallbackOrders.values()).filter(
        o => !o.reminder_sent_at && (VALIDATED_REMINDER_STATUSES as readonly string[]).includes(o.status)
    );
}

export async function markFestiveOrderReminderSent(orderId: string): Promise<boolean> {
    const rawId = (orderId || '').trim().toUpperCase();
    const cleanId = rawId.startsWith('NOEL-') ? rawId : `NOEL-${rawId}`;
    const sql = getDb();
    const nowBrussels = getBrusselsTimestamp();

    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            await sql`
                UPDATE festive_orders 
                SET reminder_sent_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels'),
                    updated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels')
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
        found.reminder_sent_at = nowBrussels;
        found.updated_at = nowBrussels;
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
    const baseResume = (existing.resume_commande && existing.resume_commande.trim())
        ? existing.resume_commande.trim()
        : buildFestiveOrderResume(existing.items, existing.additional_items);
    const newAdditionSegment = formatFestiveItemsSummary(newAdditionalItems);
    const updatedResume = newAdditionSegment
        ? (baseResume ? `${baseResume} | + AJOUT : ${newAdditionSegment}` : `+ AJOUT : ${newAdditionSegment}`)
        : baseResume;

    const nowBrussels = getBrusselsTimestamp();
    const sql = getDb();

    if (sql) {
        try {
            await ensureFestiveOrdersTable();
            await sql`
                UPDATE festive_orders SET
                    additional_items = ${JSON.stringify(combinedAdditionalItems)},
                    resume_commande = ${updatedResume},
                    balance_remaining = ${newBalanceRemaining},
                    status = 'solde_en_attente',
                    updated_at = (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Brussels')
                WHERE UPPER(id) = ${existing.id.toUpperCase()};
            `;
        } catch (err) {
            console.error("Erreur updateFestiveOrderAdditions SQL:", err);
        }
    }

    existing.additional_items = combinedAdditionalItems;
    existing.resume_commande = updatedResume;
    existing.balance_remaining = newBalanceRemaining;
    existing.status = 'solde_en_attente';
    existing.updated_at = nowBrussels;
    saveFallbackOrder(existing);

    return existing;
}
