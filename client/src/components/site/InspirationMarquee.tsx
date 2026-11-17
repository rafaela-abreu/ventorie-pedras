import { ArrowUpRight, Leaf } from "lucide-react";
import Reveal from "./Reveal";

const images = [
  ["/images/wall-detail.jpg", "Parede natural iluminada ao entardecer"],
  ["/images/wall-interior.jpg", "Muro externo com paisagismo"],
  ["/images/wall-bath.jpg", "Pátio com parede de presença"],
  ["/images/wall-garden.webp", "Textura artesanal em detalhe"],
  ["/images/wall-evening.jpg", "Jardim com luz acolhedora"],
  ["/images/wall-landscape.jpg", "Entrada contemporânea"],
  ["/images/wall-house.webp", "Paisagismo em níveis"],
  ["/images/wall-night.jpg", "Sala com parede de destaque"],
  ["/images/wall-detail.jpg", "Curvas e luz indireta"],
  ["/images/wall-interior.jpg", "Fachada de alto padrão"],
  ["/images/wall-bath.jpg", "Piscina e pedra natural"],
  ["/images/wall-garden.webp", "Passagem de jardim"],
  ["/images/wall-evening.jpg", "Arco entre ambientes"],
  ["/images/wall-landscape.jpg", "Estudo de textura"],
  ["/images/wall-house.webp", "Pátio ao anoitecer"],
  ["/images/wall-night.jpg", "Pedra e folhagem em detalhe"],
  ["/images/wall-detail.jpg", "Terraço externo elegante"],
  ["/images/wall-interior.jpg", "Escadaria de entrada"],
  ["/images/wall-bath.jpg", "Atmosfera de spa"],
  ["/images/wall-garden.webp", "Muro iluminado depois da chuva"],
  ["/images/wall-evening.jpg", "Casa integrada à paisagem"],
  ["/images/wall-landscape.jpg", "Nicho externo tropical"],
  ["/images/wall-house.webp", "Sala com divisão em pedra"],
  ["/images/wall-night.jpg", "Muro junto à água"],
  ["/images/wall-detail.jpg", "Tons quentes e naturais"],
  ["/images/wall-interior.jpg", "Entrada tropical monumental"],
  ["/images/wall-bath.jpg", "Pedra junto à piscina"],
  ["/images/wall-garden.webp", "Sala de jantar acolhedora"],
  ["/images/wall-evening.jpg", "Caminho entre muros"],
  ["/images/wall-landscape.jpg", "Textura que assina o ambiente"],
] as const;

export default function InspirationMarquee() {
  const loop = [...images, ...images];

  return (
    <section id="inspiracoes" className="overflow-hidden py-16 sm:py-20">
      <div className="container mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="eyebrow">Atmosferas Ventorié</p>
          <h2 className="mt-3 max-w-2xl text-3xl sm:text-4xl">
            <span className="text-gold-shine">Pedra que transforma</span>{" "}
            <span className="text-gold">o olhar.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-gold-soft sm:text-base">
            Uma curadoria visual original para inspirar paredes de pedra com presença, luz e
            personalidade.
          </p>
        </Reveal>
        <a href="#contato" className="btn-outline-gold self-start sm:self-auto">
          <Leaf size={17} />
          Criar minha parede
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="relative flex w-max gap-4 inspiration-marquee" aria-label="Galeria de inspirações de paredes de pedra">
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
              loading={index < 8 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a0317]/85 via-transparent to-transparent opacity-80" />
            <span className="sr-only">{alt}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
