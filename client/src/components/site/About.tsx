import { Leaf } from "lucide-react";
import Reveal from "./Reveal";
import {
  BRAND_POSITIONING,
  BRAND_SIGNATURE,
  BRAND_SLOGAN,
  LOGO_EMBLEM,
  OWNER_NAME,
  OWNER_ROLE,
  SHOWROOM_IMAGE,
} from "@/lib/site";

const pillars = [
  {
    title: "Pedra moledo selecionada",
    text: "Escolha cuidadosa das pedras que formarão cada parede residencial.",
  },
  {
    title: "Parede com presença",
    text: "Cada parede de pedra moledo é planejada para valorizar o espaço da residência.",
  },
  {
    title: "Acabamento preciso",
    text: "O assentamento preciso revela a beleza natural da pedra moledo.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" />
      <div className="container relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <div className="gold-frame overflow-hidden rounded-[2rem]">
                <img
                  src={SHOWROOM_IMAGE}
                  alt="Residência contemporânea com parede de pedra natural"
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                />
              </div>
              <div className="absolute -bottom-8 left-6 flex items-center gap-3 rounded-2xl border border-gold/40 bg-[#2a0317]/92 px-4 py-3 backdrop-blur sm:left-10">
                <img
                  src={LOGO_EMBLEM}
                  alt="Emblema VentoriÊ Pedras"
                  className="h-10 w-auto rounded-lg ring-1 ring-gold/40"
                />
                <div>
                  <p className="font-display text-sm font-extrabold tracking-[0.16em] text-gold">
                    VENTORIÊ PEDRAS
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-soft/85">
                    {BRAND_SLOGAN}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow">A marca</p>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.9rem]">
                <span className="text-gold-shine">O ápice da magnitude</span>
                <br />
                <span className="text-gold">em paredes de pedra moledo</span>
              </h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-gold-soft sm:text-lg">
                Sob a direção de {OWNER_NAME}, a VentoriÊ dedica seu trabalho a um único serviço:
                paredes residenciais de pedra moledo, executadas com presença e cuidado.
              </p>
              <p className="mt-4 text-base font-semibold leading-relaxed text-gold-soft/90">
                A empresa não realiza paisagismo nem outras decorações. Cada projeto é focado na
                seleção, no assentamento e no acabamento da parede de pedra moledo.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={0.08 * index}>
                  <div className="h-full rounded-2xl border border-gold/25 bg-[#3b0522]/55 p-4 backdrop-blur">
                    <p className="font-display text-sm font-extrabold text-gold">{pillar.title}</p>
                    <p className="mt-2 text-[13px] font-semibold leading-snug text-gold-soft/85">
                      {pillar.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-gold/30 bg-[#2a0317]/45 p-5">
                    <Leaf aria-hidden="true" className="mt-1 h-8 w-8 shrink-0 text-gold" strokeWidth={1.8} />
                    <div>
                      <p className="font-display text-lg font-bold leading-snug text-gold">
                    “{BRAND_POSITIONING}”
                      </p>
                      <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-gold-soft/80">
                    {BRAND_SIGNATURE}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
