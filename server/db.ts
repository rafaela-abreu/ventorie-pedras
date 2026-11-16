import { asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { catalogItems, InsertCatalogItem, InsertUser, settings, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listCatalogItems() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(catalogItems)
    .orderBy(desc(catalogItems.featured), asc(catalogItems.sortOrder), desc(catalogItems.id));
}

export async function getCatalogItem(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(catalogItems).where(eq(catalogItems.id, id)).limit(1);
  return rows[0];
}

export async function createCatalogItem(item: InsertCatalogItem) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [result] = await db.insert(catalogItems).values(item);
  return Number(result.insertId);
}

export async function updateCatalogItem(
  id: number,
  data: Partial<Pick<InsertCatalogItem, "title" | "description" | "category" | "featured" | "sortOrder">>
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(catalogItems).set(data).where(eq(catalogItems.id, id));
}

export async function deleteCatalogItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.delete(catalogItems).where(eq(catalogItems.id, id));
}

export async function countCatalogItems() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ total: sql<number>`count(*)` }).from(catalogItems);
  return Number(rows[0]?.total ?? 0);
}

export async function listCategories() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ category: catalogItems.category })
    .from(catalogItems)
    .groupBy(catalogItems.category)
    .orderBy(asc(catalogItems.category));
  return rows.map(row => row.category);
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows.length > 0 ? rows[0].value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db
    .insert(settings)
    .values({ key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

export async function deleteSetting(key: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.delete(settings).where(eq(settings.key, key));
}
