export const WHATSAPP_NUMBER = "5561985737591";
export const WHATSAPP_DISPLAY = "+55 61 98573-7591";
export const WHATSAPP_MESSAGE = "Gostaria de realizar um orçamento com a empresa VentoriÉ Pedras";

export const EMAIL = "pedrasventorie@gmail.com";
export const INSTAGRAM_HANDLE = "@ventoriepedras";
export const INSTAGRAM_URL = "https://www.instagram.com/ventoriepedras";
export const OWNER_NAME = "Márcia Júlia";
export const OWNER_ROLE = "Designer de Interiores";

export const LOGO_LOCKUP = "/manus-storage/logo-lockup_f1b4cf8f.jpg";
export const LOGO_EMBLEM = "/manus-storage/logo-emblem_7d8dbac1.jpg";

export const HERO_IMAGE = "/manus-storage/async-images/eKCduYPpzI8BUkHiyTrmmX/image-1.webp";
export const SHOWROOM_IMAGE = "/manus-storage/async-images/eKCduYPpzI8BUkHiyTrmmX/image-2.webp";

export function whatsappLink(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject = "Orçamento Ventorié Pedras"): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Contato", href: "#contato" },
];

export const CATEGORY_SUGGESTIONS = [
  "Mármores",
  "Granitos",
  "Quartzitos",
  "Pedras Naturais",
  "Revestimentos",
  "Ambientes",
];
