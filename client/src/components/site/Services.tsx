import { Leaf, Mountain, Rows3 } from "lucide-react";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/site";

const services = [
  {
    icon: Mountain,
    title: "Paredes de pedra moledo",
    text: "Esse é o serviço da VentoriÊ: paredes residenciais executadas exclusivamente com pedra moledo.",
  },
  {
    icon: Rows3,
    title: "Planejamento sob medida",
    text: "Cada parede é planejada conforme o espaço da residência e a composição natural da pedra.",
  },
  {
    icon: Leaf,
    title: "Assentamento e acabamento",
    text: "Execução cuidadosa da parede de pedra moledo, do encaixe das peças ao acabamento final.",
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
            <span className="text-gold-shine">Um trabalho, feito</span>{" "}
            <span className="text-gold">com excelência</span>
          </h2>
          <p className="mt-5 text-base font-semibold leading-relaxed text-gold-soft sm:text-lg">
            A VentoriÊ realiza exclusivamente paredes de pedra moledo em residências. Do
            planejamento ao assentamento, cada etapa é dedicada a esse único serviço.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const isWide = index === 0;
            const Icon = service.icon;
            return (
              <Reveal
                key={service.title}
                delay={0.06 * index}
                className={isWide ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-gold/25 bg-[linear-gradient(160deg,rgba(120,10,70,0.6),rgba(42,3,23,0.85))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/40 bg-[#2a0317]/60 transition-colors group-hover:bg-gold">
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-gold transition-colors group-hover:text-[#2a0317]"
                      strokeWidth={1.8}
                    />
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
                  Conte onde deseja a parede de pedra moledo, informe as medidas e receba um
                  orçamento personalizado.
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
