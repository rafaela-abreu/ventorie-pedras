import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import {
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOGO_LOCKUP,
  OWNER_NAME,
  OWNER_ROLE,
  WHATSAPP_DISPLAY,
  mailtoLink,
  whatsappLink,
} from "@/lib/site";

export default function Contact() {
  return (
    <section id="contato" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px gold-line opacity-70" />
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Contato</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.9rem]">
              <span className="text-gold-shine">Vamos conversar</span>
              <br />
              <span className="text-gold">sobre o seu projeto?</span>
            </h2>
            <p className="mt-5 max-w-lg text-base font-semibold leading-relaxed text-gold-soft sm:text-lg">
              Envie uma mensagem contando o ambiente que você quer transformar. Respondemos com
              sugestões de pedras, amostras disponíveis e um orçamento personalizado.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-light">
                <MessageCircle size={18} />
                Enviar orçamento
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-outline-gold">
                <Instagram size={18} />
                Ver Instagram
              </a>
            </div>

            <div className="mt-9 space-y-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-[#3b0522]/55 p-4 transition-colors hover:border-gold/60 hover:bg-[#5c0838]/60"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#12000a]">
                  <MessageCircle size={19} />
                </span>
                <span>
                  <span className="block font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold/80">
                    WhatsApp
                  </span>
                  <span className="block font-display text-lg font-bold text-gold">
                    {WHATSAPP_DISPLAY}
                  </span>
                  <span className="block text-xs font-semibold text-gold-soft/80">
                    {OWNER_NAME} · {OWNER_ROLE}
                  </span>
                </span>
              </a>

              <a
                href={mailtoLink()}
                className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-[#3b0522]/55 p-4 transition-colors hover:border-gold/60 hover:bg-[#5c0838]/60"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#12000a]">
                  <Mail size={19} />
                </span>
                <span>
                  <span className="block font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold/80">
                    E-mail
                  </span>
                  <span className="block break-all font-display text-lg font-bold text-gold">
                    {EMAIL}
                  </span>
                </span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-[#3b0522]/55 p-4 transition-colors hover:border-gold/60 hover:bg-[#5c0838]/60"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#12000a]">
                  <Instagram size={19} />
                </span>
                <span>
                  <span className="block font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold/80">
                    Instagram
                  </span>
                  <span className="block font-display text-lg font-bold text-gold">
                    {INSTAGRAM_HANDLE}
                  </span>
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-[2rem] border border-gold/35 bg-[linear-gradient(165deg,rgba(120,10,70,0.72),rgba(42,3,23,0.94))] p-6 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.95)] sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-2xl" />
              <img
                src={LOGO_LOCKUP}
                alt="Logotipo Ventorié Pedras com Márcia Júlia, designer de interiores"
                className="w-full rounded-[1.4rem] border border-gold/25"
              />
              <div className="mt-6 space-y-4">
                <div>
                  <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold/80">
                    Responsável
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-gold">
                    {OWNER_NAME}
                  </p>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-soft/85">
                    {OWNER_ROLE}
                  </p>
                </div>
                <div className="h-px w-full gold-line opacity-60" />
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                  <p className="text-sm font-semibold leading-relaxed text-gold-soft">
                    Atendimento em Brasília e entorno, com projetos e entregas em todo o Brasil.
                    Visitas ao showroom e curadoria de pedras agendadas pelo WhatsApp.
                  </p>
                </div>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-light w-full"
                >
                  Enviar orçamento no WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
