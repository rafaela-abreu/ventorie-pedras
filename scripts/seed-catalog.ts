import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { catalogItems } from "../drizzle/schema";

const initialItems = [
  {
    title: "Mármore Verde Imperial",
    description:
      "Verde profundo com veios dourados. Ideal para paredes de destaque, lavabos e bancadas de alto padrão.",
    category: "Mármores",
    imageUrl: "/manus-storage/async-images/eKCduYPpzI8BUkHiyTrmmX/image-3.webp",
    imageKey: "async-images/eKCduYPpzI8BUkHiyTrmmX/image-3.webp",
    featured: 1,
    sortOrder: 1,
  },
  {
    title: "Mármore Branco Dolomita",
    description:
      "Fundo branco leitoso com delicados veios cinza e champagne. Sofisticação atemporal para cozinhas e banheiros.",
    category: "Mármores",
    imageUrl: "/manus-storage/async-images/eKCduYPpzI8BUkHiyTrmmX/image-4.webp",
    imageKey: "async-images/eKCduYPpzI8BUkHiyTrmmX/image-4.webp",
    featured: 0,
    sortOrder: 2,
  },
  {
    title: "Granito Preto Absoluto",
    description:
      "Preto profundo com pontuações minerais prateadas. Resistência e elegância para superfícies de uso intenso.",
    category: "Granitos",
    imageUrl: "/manus-storage/async-images/eKCduYPpzI8BUkHiyTrmmX/image-5.webp",
    imageKey: "async-images/eKCduYPpzI8BUkHiyTrmmX/image-5.webp",
    featured: 0,
    sortOrder: 3,
  },
  {
    title: "Quartzito Azul Imperial",
    description:
      "Translucidez rara com veios azuis e dourados. Peça exclusiva para projetos autorais e ambientes assinados.",
    category: "Quartzitos",
    imageUrl: "/manus-storage/async-images/41oQNTf2yBURvdBKcXwr3H/image-1.webp",
    imageKey: "async-images/41oQNTf2yBURvdBKcXwr3H/image-1.webp",
    featured: 1,
    sortOrder: 4,
  },
  {
    title: "Revestimento Travertino",
    description:
      "Textura natural e tons quentes que aquecem paredes e fachadas, com acabamento artesanal e luz dourada.",
    category: "Revestimentos",
    imageUrl: "/manus-storage/async-images/41oQNTf2yBURvdBKcXwr3H/image-2.webp",
    imageKey: "async-images/41oQNTf2yBURvdBKcXwr3H/image-2.webp",
    featured: 0,
    sortOrder: 5,
  },
  {
    title: "Banheiro em Mármore",
    description:
      "Projeto assinado por Márcia Júlia: parede em mármore branco e dourado com banheira em pedra escura.",
    category: "Ambientes",
    imageUrl: "/manus-storage/async-images/41oQNTf2yBURvdBKcXwr3H/image-3.webp",
    imageKey: "async-images/41oQNTf2yBURvdBKcXwr3H/image-3.webp",
    featured: 0,
    sortOrder: 6,
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
