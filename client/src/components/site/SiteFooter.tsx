import { Instagram, Mail, MessageCircle } from "lucide-react";
import {
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOGO_EMBLEM,
  NAV_LINKS,
  OWNER_NAME,
  OWNER_ROLE,
  WHATSAPP_DISPLAY,
  mailtoLink,
  whatsappLink,
} from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-gold/25 bg-[#2a0317]/85 py-14">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <img
              src={LOGO_EMBLEM}
              alt="Emblema Ventorié Pedras — Márcia Júlia, idealizadora da marca"
              className="w-full max-w-[290px] rounded-xl border border-gold/25"
            />
            <p className="mt-5 max-w-sm text-sm font-semibold leading-relaxed text-gold-soft/85">
              Paredes de pedra com presença, textura e acabamento autoral. O ápice da
              magnitude para fachadas, jardins e áreas externas.
            </p>
          </div>

          <div>
            <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold/80">
              Navegação
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-display text-base font-bold text-gold transition-colors hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/admin"
                  className="font-display text-base font-bold text-gold/70 transition-colors hover:text-gold"
                >
                  Painel administrativo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold/80">
              Fale com a gente
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-gold-soft transition-colors hover:text-gold"
                >
                  <MessageCircle size={16} className="text-gold" />
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={mailtoLink()}
                  className="flex items-center gap-3 break-all text-sm font-semibold text-gold-soft transition-colors hover:text-gold"
                >
                  <Mail size={16} className="text-gold" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-gold-soft transition-colors hover:text-gold"
                >
                  <Instagram size={16} className="text-gold" />
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold/20 pt-6 sm:flex-row">
          <p className="text-xs font-semibold tracking-wide text-gold-soft/70">
            © {new Date().getFullYear()} Ventorié Pedras · {OWNER_NAME}, {OWNER_ROLE}
          </p>
          <p className="text-xs font-semibold tracking-[0.16em] text-gold-soft/60">
            PAREDES DE PEDRA · O ÁPICE DA MAGNITUDE
          </p>
        </div>
      </div>
    </footer>
  );
}
