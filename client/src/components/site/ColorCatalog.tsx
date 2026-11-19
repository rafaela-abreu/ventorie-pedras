import { BookOpen, Download, Leaf, X } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/site";

const CATALOG_PDF = "./catalogo/catalogo-cores-ventorie.pdf";
const pages = [
  {
    number: "01",
    label: "A essência da VentoriÊ",
    image: "./catalogo/pagina-1.png",
  },
  {
    number: "02",
    label: "Paleta de cores",
    image: "./catalogo/pagina-2.png",
  },
  {
    number: "03",
    label: "Acabamentos especiais",
    image: "./catalogo/pagina-3.png",
  },
];

type PaletteColor = readonly [string, string];

const palette: readonly PaletteColor[] = [
  ["Azul Bebê", "#a8d8f0"],
  ["Azul Serenity", "#9fc5e8"],
  ["Azul Tiffany", "#81d8d0"],
  ["Azul Petróleo", "#176b78"],
  ["Azul Marinho", "#162b52"],
  ["Pêssego", "#f5b7a3"],
  ["Rosé", "#c8899e"],
  ["Rosa Queimado", "#a96773"],
  ["Nude", "#d8b6a5"],
  ["Terracota", "#bb6748"],
  ["Bordô", "#6f2638"],
  ["Vinho", "#7a1f3d"],
  ["Verde Esmeralda", "#1d8a68"],
  ["Verde Oliva", "#708238"],
  ["Verde Sálvia", "#a4b494"],
  ["Verde Musgo", "#596b45"],
  ["Branco Clean", "#f4f2e8"],
  ["Branco Pérola", "#f0e1c5"],
  ["Off-White", "#ede7db"],
  ["Areia", "#d9c39a"],
  ["Palha", "#d1b27b"],
  ["Camurça", "#a88968"],
  ["Bege Champagne", "#d5b486"],
  ["Marrom Café", "#664536"],
  ["Marrom Conhaque", "#8a5a3b"],
  ["Cobre", "#b66b45"],
  ["Cinza Claro", "#b8bdba"],
  ["Cinza Concreto", "#929997"],
  ["Grafite", "#3c4144"],
  ["Preto Ônix", "#17181b"],
];

const featuredWalls = [
  {
    title: "Pedra cinza com glitter",
    subtitle: "Sofisticação mineral",
    alt: "Amostra de pedra cinza com glitter mineral",
    image: "/images/stone-gray-glitter.webp",
  },
  {
    title: "Pedra azul bebê com glitter",
    subtitle: "Delicadeza luminosa",
    alt: "Amostra de pedra azul bebê com glitter mineral",
    image: "/images/stone-light-blue-glitter.webp",
  },
] as const;

export default function ColorCatalog() {
  const [selectedColor, setSelectedColor] = useState<PaletteColor | null>(null);

  return (
    <section id="cores" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px gold-line opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_420px_at_50%_10%,rgba(255,210,74,0.12),transparent_70%)]" />
      <div className="container relative">
        <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Catálogo de cores</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.9rem]">
              <span className="text-gold-shine">A cor que traduz</span>{" "}
              <span className="text-gold">a sua presença.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-gold-soft sm:text-lg">
              Explore a seleção de tons da VentoriÊ Pedras e encontre a nuance que combina com a
              personalidade do seu projeto. Um catálogo visual para escolher com calma e segurança.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={CATALOG_PDF} target="_blank" rel="noreferrer" className="btn-light">
                <BookOpen size={18} />
                Abrir catálogo completo
              </a>
              <a href={CATALOG_PDF} download className="btn-outline-gold">
                <Download size={18} />
                Baixar PDF
              </a>
            </div>
            <a
              href={whatsappLink("Gostaria de receber ajuda para escolher a cor da minha parede de pedra.")}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-display text-sm font-extrabold text-gold transition-colors hover:text-gold-soft"
            >
              <Leaf size={16} />
              Quero escolher uma cor com a VentoriÊ
            </a>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {pages.map(page => (
                <a
                  key={page.number}
                  href={CATALOG_PDF}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-[1.35rem] border border-gold/30 bg-[#2a0317] p-1.5 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-2 hover:border-gold/75"
                >
                  <div className="relative overflow-hidden rounded-[1rem]">
                    <img
                      src={page.image}
                      alt={`Página ${page.number} do catálogo de cores VentoriÊ Pedras`}
                      className="aspect-[0.707] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a0317]/85 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border border-gold/55 bg-[#2a0317]/75 px-2 py-1 font-display text-[10px] font-extrabold tracking-[0.16em] text-gold backdrop-blur">
                      {page.number}
                    </span>
                    <span className="sr-only">{page.label}</span>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <div className="mt-14">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {palette.map(([name, hex]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedColor([name, hex])}
                  className="flex items-center gap-2 rounded-2xl border border-gold/20 bg-[#3b0522]/50 px-3 py-3 text-left font-display text-xs font-extrabold text-gold-soft transition-colors hover:border-gold/60 hover:bg-[#5c0838]/60 sm:text-sm"
                  aria-label={`Ver a cor ${name}`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border border-white/35"
                    style={{ background: hex }}
                  />
                  {name}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-16 rounded-[2rem] border border-gold/30 bg-[linear-gradient(135deg,rgba(59,5,34,0.92),rgba(42,3,23,0.96))] p-5 shadow-[0_34px_90px_-50px_rgba(0,0,0,0.95)] sm:p-7">
            <div className="text-center">
              <p className="eyebrow">Destaque especial</p>
              <h3 className="mt-3 text-2xl sm:text-3xl">
                <span className="text-gold-shine">Nosso carro-chefe</span>{" "}
                <span className="text-gold">do catálogo das cores.</span>
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-gold-soft/80 sm:text-base">
                Duas leituras sofisticadas da pedra com glitter mineral: a profundidade do cinza e
                a luminosidade delicada do azul bebê.
              </p>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {featuredWalls.map(wall => (
                <article key={wall.title} className="group overflow-hidden rounded-[1.4rem] border border-gold/25 bg-[#2a0317]">
                  <div className="relative aspect-[1.45] overflow-hidden">
                    <img
                      src={wall.image}
                      alt={wall.alt}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a0317]/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-5 bottom-4">
                      <p className="font-display text-xl font-extrabold text-gold sm:text-2xl">{wall.title}</p>
                      <p className="mt-1 text-sm font-bold text-gold-soft">{wall.subtitle}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        {selectedColor && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#16000d]/85 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-sm rounded-[2rem] border border-gold/40 bg-[#2a0317] p-5 shadow-[0_40px_100px_-35px_rgba(0,0,0,0.95)]">
              <button
                type="button"
                onClick={() => setSelectedColor(null)}
                aria-label="Fechar visualização da cor"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/45 bg-[#2a0317]/80 text-gold hover:bg-white hover:text-[#12000a]"
              >
                <X size={18} />
              </button>
              <div
                className="h-56 rounded-[1.4rem] border border-white/20 shadow-inner"
                style={{ backgroundColor: selectedColor[1] }}
              />
              <div className="px-1 pb-1 pt-5">
                <p className="eyebrow">Amostra selecionada</p>
                <h3 className="mt-2 font-display text-3xl font-extrabold text-gold">{selectedColor[0]}</h3>
                <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.18em] text-gold-soft/80">
                  {selectedColor[1]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
