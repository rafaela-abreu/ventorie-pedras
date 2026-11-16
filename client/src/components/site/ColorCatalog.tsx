import { BookOpen, Download, Leaf } from "lucide-react";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/site";

const CATALOG_PDF = "/manus-storage/catalogo_cores_moledo_ventorie_8b8378f0.pdf";
const pages = [
  {
    number: "01",
    label: "A essência da Ventorié",
    image: "/manus-storage/catalogo-cores-1_cd95a471.png",
  },
  {
    number: "02",
    label: "Paleta de cores",
    image: "/manus-storage/catalogo-cores-2_6d048f35.png",
  },
  {
    number: "03",
    label: "Acabamentos especiais",
    image: "/manus-storage/catalogo-cores-3_70126311.png",
  },
];

export default function ColorCatalog() {
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
              Explore a seleção de tons da Ventorié Pedras e encontre a nuance que combina com a
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
              Quero escolher uma cor com a Ventorié
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
                      alt={`Página ${page.number} do catálogo de cores Ventorié Pedras`}
                      className="aspect-[0.707] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a0317]/85 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border border-gold/55 bg-[#2a0317]/75 px-2 py-1 font-display text-[10px] font-extrabold tracking-[0.16em] text-gold backdrop-blur">
                      {page.number}
                    </span>
                    <span className="absolute inset-x-3 bottom-3 font-display text-[11px] font-extrabold leading-tight text-gold-soft sm:text-sm">
                      {page.label}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <div className="mt-10 rounded-2xl border border-gold/20 bg-[#3b0522]/45 px-5 py-4 text-sm font-semibold leading-relaxed text-gold-soft/80 backdrop-blur sm:px-6">
            <strong className="text-gold">Importante:</strong> as tonalidades são referências
            ilustrativas. A pedra natural pode apresentar variações de cor, textura, formato e
            intensidade do brilho. A confirmação final deve ser feita por amostra física e conforme
            a disponibilidade do fornecedor.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
