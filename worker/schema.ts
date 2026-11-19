import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  role: text("role").notNull().default("user"),
  loginMethod: text("loginMethod"),
  lastSignedIn: text("lastSignedIn"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const catalogItems = sqliteTable("catalogItems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  imageKey: text("imageKey").notNull(),
  imageUrl: text("imageUrl").notNull(),
  featured: integer("featured").notNull().default(0),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type CatalogItem = typeof catalogItems.$inferSelect;
export type NewCatalogItem = typeof catalogItems.$inferInsert;
