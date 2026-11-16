import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import {
  BRAND_POSITIONING,
  BRAND_SIGNATURE,
  BRAND_SLOGAN,
  HERO_IMAGE,
  ICON_LEAF,
  ICON_STONE,
  ICON_WALL,
  LOGO_LOCKUP,
  whatsappLink,
} from "@/lib/site";

const highlights = [
  ["Pedra selecionada", ICON_STONE],
  ["Paredes com presença", ICON_WALL],
  ["Acabamento autoral", ICON_LEAF],
];

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-[76px] lg:pt-[88px]">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Ambiente de alto padrão com parede de pedra natural e iluminação dourada"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(59,5,34,0.80)_0%,rgba(74,6,41,0.64)_38%,rgba(138,11,84,0.30)_68%,rgba(42,3,23,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_78%_18%,rgba(255,210,74,0.10),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#4a0629]" />
      </div>

      <div className="container relative flex min-h-[calc(100vh-88px)] flex-col justify-center py-16 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-[#3b0522]/50 px-4 py-2 backdrop-blur"
            >
              <Leaf size={14} className="text-gold" />
              <span className="eyebrow !text-[10px] sm:!text-[11px]">
                Paredes de pedra · Design de exteriores
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08 }}
              className="mt-6 font-display text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-[4.4rem]"
            >
              <span className="text-gold-shine block">Paredes de pedra</span>
              <span className="text-gold-shine block">pedra que impõem</span>
              <span className="block text-gold">presença.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18 }}
              className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-gold-soft sm:text-lg"
            >
              A Ventorié Pedras cria paredes de pedra com força, textura e acabamento
              impecável para fachadas, jardins e ambientes que pedem presença.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.26 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-light">
                Enviar orçamento
                <ArrowRight size={18} />
              </a>
              <a href="#catalogo" className="btn-outline-gold">
                Explorar o catálogo
              </a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.36 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {highlights.map(([item, icon]) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-bold tracking-wide text-gold-soft"
                >
                  <img src={icon} alt="" className="h-6 w-6 object-contain" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mx-auto hidden w-full max-w-md lg:block"
          >
            <div className="animate-float-slow rounded-[2rem] border border-gold/45 bg-[#2a0317]/55 p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <img
                src={LOGO_LOCKUP}
                alt="Logotipo Ventorié Pedras — Márcia Júlia, designer de interiores"
                className="w-full rounded-[1.6rem]"
              />
            </div>
            <div className="mt-5 rounded-2xl border border-gold/30 bg-[#3b0522]/70 px-5 py-4 text-center backdrop-blur">
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">
                {BRAND_SLOGAN}
              </p>
              <p className="mt-1 text-sm font-semibold text-gold-soft">
                {BRAND_POSITIONING}
              </p>
            </div>
            <p className="mt-4 text-center font-display text-sm font-bold leading-relaxed text-gold-soft">
              {BRAND_SIGNATURE}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
