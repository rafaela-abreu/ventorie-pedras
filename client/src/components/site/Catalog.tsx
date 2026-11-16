import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ImageOff, Leaf, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/site";

type CatalogItem = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  featured: number;
};

export default function Catalog() {
  const { data, isLoading, isError, refetch } = trpc.catalog.list.useQuery(undefined, {
    staleTime: 30_000,
  });
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [selected, setSelected] = useState<CatalogItem | null>(null);

  const items = (data ?? []) as CatalogItem[];

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
    return ["Todas", ...unique];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === "Todas") return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="catalogo" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px gold-line opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_0%,rgba(255,210,74,0.09),transparent_70%)]" />
      <div className="container relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Catálogo</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.9rem]">
            <span className="text-gold-shine">Paredes de pedra</span>{" "}
            <span className="text-gold">pedra selecionadas</span>
          </h2>
          <p className="mt-5 text-base font-semibold leading-relaxed text-gold-soft sm:text-lg">
            Uma vitrine viva dos nossos projetos em pedra. As fotos abaixo são publicadas
            diretamente pela Ventorié Pedras e atualizadas conforme novas paredes são entregues.
          </p>
        </Reveal>

        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2.5">
            {categories.map(category => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 font-display text-[13px] font-bold tracking-wide transition-all ${
                    isActive
                      ? "border-white bg-white text-[#12000a] shadow-[0_10px_25px_-14px_rgba(0,0,0,0.9)]"
                      : "border-gold/40 bg-[#3b0522]/50 text-gold hover:border-gold hover:bg-[#5c0838]/70"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-[1.6rem] border border-gold/20 bg-[#5c0838]/50"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-10 rounded-3xl border border-gold/30 bg-[#3b0522]/60 p-8 text-center">
            <ImageOff className="mx-auto text-gold" size={26} />
            <p className="mt-3 font-display text-lg font-bold text-gold">
              Não foi possível carregar o catálogo agora.
            </p>
            <button type="button" onClick={() => refetch()} className="btn-light mt-5">
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="mt-10 rounded-[1.8rem] border border-gold/30 bg-[#3b0522]/60 p-10 text-center">
            <Leaf className="mx-auto text-gold" size={28} />
            <p className="mt-4 font-display text-2xl font-extrabold text-gold">
              Novas pedras a caminho
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-relaxed text-gold-soft/90">
              O catálogo está sendo atualizado com novas paredes de pedra. Enquanto isso,
              fale com a Márcia Júlia e receba referências, medidas e orçamento.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="btn-light mt-6"
            >
              Enviar orçamento
            </a>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 0.05, 0.3)}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="group relative block h-full w-full overflow-hidden rounded-[1.6rem] border border-gold/25 bg-[#2a0317] text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_35px_70px_-35px_rgba(0,0,0,0.95)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,3,23,0.05)_0%,rgba(42,3,23,0.25)_45%,rgba(42,3,23,0.95)_100%)]" />
                    {item.featured === 1 && (
                      <span className="absolute left-4 top-4 rounded-full border border-gold/60 bg-[#2a0317]/80 px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold backdrop-blur">
                        Destaque
                      </span>
                    )}
                    <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-[#2a0317]/70 text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-display text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold/80">
                      {item.category}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-extrabold text-gold">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-gold-soft/85">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1a000d]/88 p-4 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={event => event.stopPropagation()}
              className="relative grid max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[1.8rem] border border-gold/40 bg-[#2a0317] shadow-[0_50px_120px_-40px_rgba(0,0,0,1)] lg:grid-cols-[1.25fr_0.75fr]"
            >
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-[#2a0317]/85 text-gold backdrop-blur transition-colors hover:bg-white hover:text-[#12000a]"
              >
                <X size={18} />
              </button>
              <div className="max-h-[52vh] overflow-hidden lg:max-h-[90vh]">
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                <p className="eyebrow !text-[10px]">{selected.category}</p>
                <h3 className="font-display text-2xl font-extrabold text-gold sm:text-3xl">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="text-sm font-semibold leading-relaxed text-gold-soft">
                    {selected.description}
                  </p>
                )}
                <p className="text-[13px] font-semibold leading-relaxed text-gold-soft/75">
                  Gostou desta parede? Envie uma mensagem e receba referências, medidas e valores
                  com atendimento da Márcia Júlia.
                </p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-light w-full"
                >
                  Enviar orçamento
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
