import { whatsappLink } from "@/lib/site";

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Enviar orçamento pelo WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-white/70 bg-white px-4 py-3.5 text-[#12000a] shadow-[0_18px_45px_-15px_rgba(0,0,0,0.8)] transition-transform hover:-translate-y-0.5 sm:bottom-7 sm:right-7"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-[#12000a]">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.93L2 22l5.35-1.4a9.8 9.8 0 0 0 4.69 1.19h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 18a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.03-.2-.31a8.16 8.16 0 0 1-1.25-4.31c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.2 8.2Z" />
      </svg>
      <span className="hidden font-display text-sm font-extrabold tracking-wide sm:block">
        Enviar orçamento
      </span>
    </a>
  );
}
