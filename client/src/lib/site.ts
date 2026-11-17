export const WHATSAPP_NUMBER = "5561985737591";
export const WHATSAPP_DISPLAY = "+55 61 98573-7591";
export const WHATSAPP_MESSAGE = "Gostaria de realizar um orçamento com a empresa VentoriÉ Pedras";

export const EMAIL = "pedrasventorie@gmail.com";
export const INSTAGRAM_HANDLE = "@ventoriepedras";
export const INSTAGRAM_URL = "https://www.instagram.com/ventoriepedras";
export const OWNER_NAME = "Márcia Júlia";
export const OWNER_ROLE = "Idealizadora da marca Ventorié Pedras";
export const BRAND_SLOGAN = "O ÁPICE DA MAGNITUDE.";
export const SHARE_TITLE = "VentoriÉ Pedras | O encontro da elegância ao Paisagismo";
export const BRAND_POSITIONING = "Especialista em design de paredes de pedra.";
export const BRAND_SIGNATURE =
  "Porque, quando o assunto é exuberância, minha escolha é sempre você: VENTORIÉ.";

export const LOGO_EMBLEM = "/manus-storage/logo-emblem_7d8dbac1.jpg";

export const HERO_IMAGE = "/manus-storage/async-images/Ss46ePoNAF5A2Dlk9z3b5t/image-1.webp";
export const SHOWROOM_IMAGE = HERO_IMAGE;
export const ICON_LEAF = "/manus-storage/async-images/Ss46ePoNAF5A2Dlk9z3b5t/image-2.webp";
export const ICON_STONE = "/manus-storage/async-images/Ss46ePoNAF5A2Dlk9z3b5t/image-3.webp";
export const ICON_WALL = "/manus-storage/async-images/Ss46ePoNAF5A2Dlk9z3b5t/image-4.webp";

export function whatsappLink(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject = "Orçamento Ventorié Pedras"): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Inspirações", href: "#inspiracoes" },
  { label: "Serviços", href: "#servicos" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Cores", href: "#cores" },
  { label: "Contato", href: "#contato" },
];

export const CATEGORY_SUGGESTIONS = ["Pedra", "Paredes de Pedra", "Projetos em Pedra"];
