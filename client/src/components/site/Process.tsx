import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Conversa e medida",
    text: "Entendemos o espaço, a altura, a extensão e o resultado que você deseja.",
  },
  {
    number: "02",
    title: "Seleção da pedra moledo",
    text: "Selecionamos e organizamos as pedras que farão parte da sua parede.",
  },
  {
    number: "03",
    title: "Composição da parede",
    text: "Planejamos a paginação e os encaixes para valorizar a parede de pedra moledo.",
  },
  {
    number: "04",
    title: "Assentamento e acabamento",
    text: "Acompanhamos a execução até a parede de pedra revelar todo o seu impacto.",
  },
];

export default function Process() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              <span className="text-gold-shine">Um processo próximo,</span>
              <br />
              <span className="text-gold">do início ao acabamento</span>
            </h2>
            <p className="mt-5 max-w-md text-base font-semibold leading-relaxed text-gold-soft">
              Quatro etapas simples, todas dedicadas à execução da sua parede de pedra moledo.
            </p>
          </Reveal>

          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-gold/60 via-gold/25 to-transparent sm:block" />
            <ul className="space-y-5">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={0.07 * index}>
                  <li className="flex items-start gap-5">
                    <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-[#2a0317] font-display text-lg font-extrabold text-gold shadow-[0_0_0_6px_rgba(74,6,41,0.9)]">
                      {step.number}
                    </span>
                    <div className="rounded-2xl border border-gold/20 bg-[#3b0522]/45 px-5 py-4 backdrop-blur-sm">
                      <h3 className="font-display text-lg font-extrabold text-gold">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-gold-soft/85">
                        {step.text}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
