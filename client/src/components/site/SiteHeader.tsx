import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LOGO_EMBLEM, NAV_LINKS, whatsappLink } from "@/lib/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/25 bg-[#3b0522]/92 backdrop-blur-xl shadow-[0_18px_40px_-30px_rgba(0,0,0,0.9)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-[76px] items-center justify-between gap-4 lg:h-[88px]">
        <a href="#inicio" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={LOGO_EMBLEM}
            alt="Emblema Ventorié Pedras"
            className="h-10 w-auto rounded-xl ring-1 ring-gold/45 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.9)] lg:h-12"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-[0.14em] text-gold lg:text-xl">
              VENTORIÉ PEDRAS
            </span>
            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-gold-soft/85 sm:text-[9.5px] sm:tracking-[0.2em] lg:text-[10.5px] lg:tracking-[0.24em]">
              Márcia Júlia · Idealizadora da marca
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-[15px] font-bold tracking-wide text-gold transition-colors hover:text-gold-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="btn-light hidden !px-6 !py-3 text-sm sm:inline-flex"
          >
            Enviar orçamento
          </a>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen(prev => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-[#3b0522]/98 backdrop-blur-xl lg:hidden">
          <div className="container flex flex-col gap-1 py-5">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 font-display text-lg font-bold text-gold transition-colors hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="btn-light mt-3 w-full"
              onClick={() => setOpen(false)}
            >
              Enviar orçamento
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
