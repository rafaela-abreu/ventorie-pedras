import { asc, desc, eq } from "drizzle-orm";
import type { AppDb } from "./context";
import { catalogItems, settings, type NewCatalogItem } from "./schema";

export async function listCatalogItems(db: AppDb) {
  return db
    .select()
    .from(catalogItems)
    .orderBy(desc(catalogItems.featured), asc(catalogItems.sortOrder), desc(catalogItems.id));
}

export async function getCatalogItem(db: AppDb, id: number) {
  const rows = await db.select().from(catalogItems).where(eq(catalogItems.id, id)).limit(1);
  return rows[0];
}

export async function createCatalogItem(db: AppDb, item: NewCatalogItem): Promise<number> {
  const rows = await db.insert(catalogItems).values(item).returning({ id: catalogItems.id });
  if (!rows[0]) throw new Error("Não foi possível criar o item do catálogo.");
  return rows[0].id;
}

export async function updateCatalogItem(
  db: AppDb,
  id: number,
  data: Partial<Pick<NewCatalogItem, "title" | "description" | "category" | "featured" | "sortOrder">>,
) {
  await db
    .update(catalogItems)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(catalogItems.id, id));
}

export async function deleteCatalogItem(db: AppDb, id: number) {
  await db.delete(catalogItems).where(eq(catalogItems.id, id));
}

export async function listCategories(db: AppDb) {
  const rows = await db
    .selectDistinct({ category: catalogItems.category })
    .from(catalogItems)
    .orderBy(asc(catalogItems.category));
  return rows.map(row => row.category);
}

export async function getSetting(db: AppDb, key: string): Promise<string | null> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? null;
}

export async function setSetting(db: AppDb, key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date().toISOString() })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date().toISOString() } });
}

export async function deleteSetting(db: AppDb, key: string): Promise<void> {
  await db.delete(settings).where(eq(settings.key, key));
}
