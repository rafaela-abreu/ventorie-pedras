import { ArrowUpRight, Leaf } from "lucide-react";
import Reveal from "./Reveal";

const images = [
  ["/manus-storage/async-images/iXWHRGB3OS1g5DNrznWaO2/image-1.webp", "Parede natural iluminada ao entardecer"],
  ["/manus-storage/async-images/iXWHRGB3OS1g5DNrznWaO2/image-2.webp", "Muro externo com paisagismo"],
  ["/manus-storage/async-images/iXWHRGB3OS1g5DNrznWaO2/image-3.webp", "Pátio com parede de presença"],
  ["/manus-storage/async-images/iXWHRGB3OS1g5DNrznWaO2/image-4.webp", "Textura artesanal em detalhe"],
  ["/manus-storage/async-images/iXWHRGB3OS1g5DNrznWaO2/image-5.webp", "Jardim com luz acolhedora"],
  ["/manus-storage/async-images/VbRLBWqI9LuvIYNgmcnJSK/image-1.webp", "Entrada contemporânea"],
  ["/manus-storage/async-images/VbRLBWqI9LuvIYNgmcnJSK/image-2.webp", "Paisagismo em níveis"],
  ["/manus-storage/async-images/VbRLBWqI9LuvIYNgmcnJSK/image-3.webp", "Sala com parede de destaque"],
  ["/manus-storage/async-images/VbRLBWqI9LuvIYNgmcnJSK/image-4.webp", "Curvas e luz indireta"],
  ["/manus-storage/async-images/VbRLBWqI9LuvIYNgmcnJSK/image-5.webp", "Fachada de alto padrão"],
  ["/manus-storage/async-images/SxO0seFGtkTP0yez1XZbON/image-1.webp", "Piscina e pedra natural"],
  ["/manus-storage/async-images/SxO0seFGtkTP0yez1XZbON/image-2.webp", "Passagem de jardim"],
  ["/manus-storage/async-images/SxO0seFGtkTP0yez1XZbON/image-3.webp", "Arco entre ambientes"],
  ["/manus-storage/async-images/SxO0seFGtkTP0yez1XZbON/image-4.webp", "Estudo de textura"],
  ["/manus-storage/async-images/SxO0seFGtkTP0yez1XZbON/image-5.webp", "Pátio ao anoitecer"],
  ["/manus-storage/async-images/WG8KvpvLYEDpIv4sdjExnL/image-1.webp", "Pedra e folhagem em detalhe"],
  ["/manus-storage/async-images/WG8KvpvLYEDpIv4sdjExnL/image-2.webp", "Terraço externo elegante"],
  ["/manus-storage/async-images/WG8KvpvLYEDpIv4sdjExnL/image-3.webp", "Escadaria de entrada"],
  ["/manus-storage/async-images/WG8KvpvLYEDpIv4sdjExnL/image-4.webp", "Atmosfera de spa"],
  ["/manus-storage/async-images/WG8KvpvLYEDpIv4sdjExnL/image-5.webp", "Muro iluminado depois da chuva"],
  ["/manus-storage/async-images/YK4ER1lEkkSY1jnjNh5WE3/image-1.webp", "Casa integrada à paisagem"],
  ["/manus-storage/async-images/YK4ER1lEkkSY1jnjNh5WE3/image-2.webp", "Nicho externo tropical"],
  ["/manus-storage/async-images/YK4ER1lEkkSY1jnjNh5WE3/image-3.webp", "Sala com divisão em pedra"],
  ["/manus-storage/async-images/YK4ER1lEkkSY1jnjNh5WE3/image-4.webp", "Muro junto à água"],
  ["/manus-storage/async-images/YK4ER1lEkkSY1jnjNh5WE3/image-5.webp", "Tons quentes e naturais"],
  ["/manus-storage/async-images/d3d38vQt96nHHKE7dS3gGC/image-1.webp", "Entrada tropical monumental"],
  ["/manus-storage/async-images/d3d38vQt96nHHKE7dS3gGC/image-2.webp", "Pedra junto à piscina"],
  ["/manus-storage/async-images/d3d38vQt96nHHKE7dS3gGC/image-3.webp", "Sala de jantar acolhedora"],
  ["/manus-storage/async-images/d3d38vQt96nHHKE7dS3gGC/image-4.webp", "Caminho entre muros"],
  ["/manus-storage/async-images/d3d38vQt96nHHKE7dS3gGC/image-5.webp", "Textura que assina o ambiente"],
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
            <span className="absolute inset-x-4 bottom-3 font-display text-xs font-extrabold leading-tight text-gold-soft sm:text-sm">
              {alt}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
