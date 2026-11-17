import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { catalogItems } from "../drizzle/schema";

const initialItems = [
  {
    title: "Parede de Pedra",
    description:
      "Parede de pedra com textura natural e presença marcante para fachadas e jardins.",
    category: "Paredes de Pedra",
    imageUrl: "/images/wall-house.webp",
    imageKey: "async-images/Ss46ePoNAF5A2Dlk9z3b5t/image-1.webp",
    featured: 1,
    sortOrder: 1,
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada");
  const db = drizzle(url);

  const rows = await db.select({ total: sql<number>`count(*)` }).from(catalogItems);
  const total = Number(rows[0]?.total ?? 0);

  if (total > 0) {
    console.log(`Catálogo já possui ${total} itens. Nada a fazer.`);
    return;
  }

  await db.insert(catalogItems).values(initialItems);
  console.log(`Seed concluído: ${initialItems.length} itens inseridos.`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
