import "./globals.css";
import type { Metadata, Viewport } from "next";
import NextTopLoader from 'nextjs-toploader';
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://sejatidimedia.web.id"),
  title: {
    template: "%s | SejatiDimedia",
    default: "SejatiDimedia - Software Agency & Development",
  },
  description: "SejatiDimedia adalah software agency di Balikpapan. Kami membangun sistem produksi, aplikasi SaaS, dan produk mobile kustom berkinerja tinggi.",
  keywords: [
    "sejatidimedia",
    "sejati dimedia",
    "software agency balikpapan",
    "software agency indonesia",
    "web development",
    "mobile app development",
    "jasa pembuatan website balikpapan",
    "jasa pembuatan aplikasi",
    "Timur Dian Radha Sejati",
    "SaaS builder",
  ],
  authors: [{ name: "Timur Dian Radha Sejati" }],
  creator: "Timur Dian Radha Sejati",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sejatidimedia.web.id",
    title: "SejatiDimedia - Software Agency Balikpapan",
    description: "Software agency di Balikpapan yang berfokus pada aplikasi SaaS, web, dan produk mobile berkualitas tinggi.",
    siteName: "SejatiDimedia",
  },
  twitter: {
    card: "summary_large_image",
    title: "SejatiDimedia - Software Agency",
    description: "Membangun sistem produksi, aplikasi SaaS, dan produk mobile kustom.",
  },
  verification: {
    google: "Wm-o9TjYVWYqL5cxsP8hRnHGlRbdCPbpsNv0pEQN_QY",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050506",
};

import { Plus_Jakarta_Sans, Sora, JetBrains_Mono, Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${sora.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <meta name="google-site-verification" content="Wm-o9TjYVWYqL5cxsP8hRnHGlRbdCPbpsNv0pEQN_QY" />
        <link rel="preload" href="/hero_minimal_horizon.webp" as="image" type="image/webp" fetchPriority="high" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var tmpl = localStorage.getItem('sejatidimedia-active-template');
                  var theme = localStorage.getItem('sejatidimedia-theme');
                  var isLight = tmpl === 'professional' || (!tmpl && (!theme || theme === 'light')) || theme === 'light';
                  if (isLight) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-theme-deep text-theme-fore" suppressHydrationWarning>
        <NextTopLoader
          color="#4A85D9"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #4A85D9,0 0 5px #4A85D9"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "SejatiDimedia",
              "url": "https://sejatidimedia.web.id",
              "logo": "https://sejatidimedia.web.id/logo.svg",
              "image": "https://sejatidimedia.web.id/logo.svg",
              "description": "SejatiDimedia adalah software agency & media command center premium. Kami membangun sistem produksi, aplikasi SaaS, dan produk mobile kustom.",
              "founder": {
                "@type": "Person",
                "name": "Timur Dian Radha Sejati",
                "url": "https://sejatidimedia.web.id"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Balikpapan",
                "addressRegion": "East Kalimantan",
                "addressCountry": "ID"
              },
              "areaServed": ["Balikpapan", "Indonesia"],
              "priceRange": "$$",
              "sameAs": [
                "https://fastwork.id/en/user/timurradhadian",
                "https://www.upwork.com/freelancers/~017698b392e21b4b6c"
              ]
            })
          }}
        />
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
