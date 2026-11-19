import { ArrowUpRight, Leaf } from "lucide-react";
import Reveal from "./Reveal";

const images = [
  ["/images/moledo-reference-01.webp", "Referência visual de parede de pedra natural em cozinha residencial."],
  ["/images/moledo-reference-02.webp", "Parede residencial revestida de pedras naturais irregulares."],
  ["/images/moledo-reference-03.webp", "Parede de pedras naturais em sala residencial."],
  ["/images/moledo-reference-04.webp", "Parede interna de pedras naturais em sala de estar."],
  ["/images/moledo-reference-05.webp", "Parede de pedra natural em ambiente residencial."],
  ["/images/moledo-reference-06.webp", "Parede residencial de pedra natural com iluminação."],
  ["/images/moledo-reference-07.webp", "Referência de parede de pedra natural em área de lazer residencial."],
  ["/images/moledo-reference-08.webp", "Parede de pedras naturais em banheiro residencial."],
  ["/images/moledo-reference-09.webp", "Parede de pedra clara em banheiro residencial."],
  ["/images/moledo-reference-10.webp", "Painel de pedras naturais em ambiente residencial."],
] as const;

export default function InspirationMarquee() {
  const loop = [...images, ...images];

  return (
    <section id="inspiracoes" className="overflow-hidden py-16 sm:py-20">
      <div className="container mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="eyebrow">Atmosferas VentoriÊ</p>
          <h2 className="mt-3 max-w-2xl text-3xl sm:text-4xl">
            <span className="text-gold-shine">Paredes de pedra</span>{" "}
            <span className="text-gold">em casas.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-gold-soft sm:text-base">
            Referências visuais de paredes residenciais em pedra natural. A VentoriÊ executa
            exclusivamente paredes de pedra moledo.
          </p>
        </Reveal>
        <a href="#contato" className="btn-outline-gold self-start sm:self-auto">
          <Leaf size={17} />
          Criar minha parede
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="relative flex w-max gap-4 inspiration-marquee" aria-label="Galeria de referências visuais de paredes de pedra em residências">
        {loop.map(([src, alt], index) => (
          <a
            key={`${src}-${index}`}
            href="#contato"
            className="group relative block h-44 w-64 shrink-0 overflow-hidden rounded-[1.35rem] border border-gold/25 bg-[#2a0317] shadow-[0_22px_60px_-34px_rgba(0,0,0,0.9)] sm:h-56 sm:w-80"
          >
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              loading={index < 3 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a0317]/85 via-transparent to-transparent opacity-80" />
            <span className="sr-only">{alt}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
