export interface ProductTool {
  id: string;
  name: string;
  tagline: {
    id: string;
    en: string;
  };
  description: {
    id: string;
    en: string;
  };
  url: string;
  icon?: string;
  logo?: string;
  badge?: {
    id: string;
    en: string;
  };
  badgeVariant?: "live" | "beta" | "new";
  isExternal?: boolean;
}

export const PRODUCT_TOOLS: ProductTool[] = [
  {
    id: "secoret",
    name: "Secoret",
    tagline: {
      id: "Papan Tulis Digital & Wireframe Instan",
      en: "Instant & Smooth Sketching Canvas",
    },
    description: {
      id: "Aplikasi kanvas digital interaktif untuk brainstorming visual, diagram arsitektur, dan sketching ide secara bebas.",
      en: "Interactive sketching canvas for visual brainstorming, system architecture diagrams, and rapid ideas sketching.",
    },
    url: "https://secoret.vercel.app",
    logo: "/product-images/secoret.jpg",
    badge: {
      id: "Live App",
      en: "Live App",
    },
    badgeVariant: "live",
    isExternal: true,
  },
  {
    id: "seclip",
    name: "SeClip",
    tagline: {
      id: "Studio Klip Video 9:16 Otomatis",
      en: "Automated 9:16 Vertical Video Studio",
    },
    description: {
      id: "Studio klip video vertikal otomatis untuk TikTok, Reels, dan Shorts dengan pelacakan pembicara cerdas serta subtitle karaoke.",
      en: "Automated vertical video clip generator for TikTok, Reels, and Shorts featuring smart speaker tracking and dynamic karaoke subtitles.",
    },
    url: "https://seclip.vercel.app",
    logo: "/product-images/seclip.png",
    badge: {
      id: "Live App",
      en: "Live App",
    },
    badgeVariant: "live",
    isExternal: true,
  },
];
