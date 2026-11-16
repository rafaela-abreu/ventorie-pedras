import { Leaf, Mountain, Rows3, TreePine } from "lucide-react";
import Reveal from "./Reveal";
import { ICON_LEAF, ICON_STONE, ICON_WALL, whatsappLink } from "@/lib/site";

const services = [
  {
    icon: Mountain,
    image: ICON_STONE,
    title: "Pedra",
    text: "Pedra selecionada pela textura, tonalidade e presença que entrega ao projeto.",
  },
  {
    icon: Rows3,
    image: ICON_WALL,
    title: "Paredes de pedra",
    text: "Muros e paredes com encaixe orgânico, volume e acabamento para valorizar fachadas e jardins.",
  },
  {
    icon: TreePine,
    image: ICON_LEAF,
    title: "Paisagismo com pedra",
    text: "Composições de pedra que conversam com verde, luz e arquitetura sem perder a naturalidade.",
  },
  {
    icon: Leaf,
    image: ICON_LEAF,
    title: "Acabamento autoral",
    text: "Cada parede é pensada para revelar a beleza irregular da pedra com acabamento preciso.",
  },
];

export default function Services() {
  return (
    <section id="servicos" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px gold-line opacity-70" />
      <div className="container relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">O que fazemos</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.9rem]">
            <span className="text-gold-shine">Serviços pensados</span>{" "}
            <span className="text-gold">para durar gerações</span>
          </h2>
          <p className="mt-5 text-base font-semibold leading-relaxed text-gold-soft sm:text-lg">
            Do primeiro esboço à instalação, acompanhamos cada etapa para que a pedra chegue ao
            ambiente exatamente como foi imaginada.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const isWide = index === 0;
            return (
              <Reveal
                key={service.title}
                delay={0.06 * index}
                className={isWide ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-gold/25 bg-[linear-gradient(160deg,rgba(120,10,70,0.6),rgba(42,3,23,0.85))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/40 bg-[#2a0317]/60 transition-colors group-hover:bg-gold">
                    <img src={service.image} alt="" className="h-8 w-8 object-contain" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold text-gold">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-gold-soft/90">
                    {service.text}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-[0.18em] text-gold/80">
                    Sob medida
                  </span>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={0.3}>
            <div className="flex h-full flex-col justify-between rounded-[1.6rem] border border-gold/45 bg-[#2a0317]/70 p-6">
              <div>
                <p className="eyebrow !text-[10px]">Atendimento</p>
                <h3 className="mt-3 font-display text-xl font-extrabold text-gold">
                  Fale com a Márcia Júlia
                </h3>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-gold-soft/90">
                  Conte o ambiente, as medidas e a sua referência. Retornamos com sugestões de
                  pedras e um orçamento personalizado.
                </p>
              </div>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="btn-light mt-6 w-full"
              >
                Enviar orçamento
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
