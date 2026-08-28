import "./globals.css";
import type { Metadata, Viewport } from "next";
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://sejatidimedia.web.id"),
  title: {
    template: "%s | SejatiDimedia",
    default: "Jasa Pembuatan Aplikasi & Website Balikpapan | SejatiDimedia",
  },
  description: "Jasa pembuatan aplikasi mobile (iOS & Android), pembuatan website profesional, hingga integrasi AI di Balikpapan. Bangun sistem digital yang membantu bisnis Anda bekerja lebih efisien bersama SejatiDimedia.",
  keywords: [
    "software balikpapan",
    "pembuatan web",
    "balikpapan software agency",
    "pembuatan aplikasi balikpapan",
    "jasa pembuatan aplikasi balikpapan",
    "jasa pembuatan website balikpapan",
    "pembuatan website balikpapan",
    "jasa pembuatan web",
    "pembuatan web balikpapan",
    "software agency balikpapan",
    "software house balikpapan",
    "developer aplikasi balikpapan",
    "jasa buat aplikasi balikpapan",
    "jasa buat website balikpapan",
    "web development balikpapan",
    "mobile app development balikpapan",
    "aplikasi kasir balikpapan",
    "aplikasi erp balikpapan",
    "sejatidimedia",
    "sejati dimedia",
    "Timur Dian Radha Sejati",
    "software agency indonesia",
    "SaaS builder",
  ],
  authors: [{ name: "Timur Dian Radha Sejati" }],
  creator: "Timur Dian Radha Sejati",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sejatidimedia.web.id",
    title: "Jasa Pembuatan Aplikasi & Website Balikpapan | SejatiDimedia",
    description: "Jasa pembuatan aplikasi mobile (iOS & Android), pembuatan website profesional, dan sistem SaaS kustom berkinerja tinggi di Balikpapan.",
    siteName: "SejatiDimedia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Pembuatan Aplikasi & Website Balikpapan | SejatiDimedia",
    description: "Jasa pembuatan aplikasi mobile, website, dan sistem SaaS kustom di Balikpapan.",
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

import { Plus_Jakarta_Sans, Sora, JetBrains_Mono, Inter, Zen_Dots } from "next/font/google";
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

const zenDots = Zen_Dots({
  subsets: ["latin"],
  variable: "--font-zen-dots",
  display: "swap",
  weight: "400",
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
      className={`${plusJakarta.variable} ${sora.variable} ${jetbrainsMono.variable} ${inter.variable} ${zenDots.variable}`}
    >
      <head>
        <meta name="google-site-verification" content="Wm-o9TjYVWYqL5cxsP8hRnHGlRbdCPbpsNv0pEQN_QY" />
        <link rel="preload" href="/hero_bg.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap" rel="stylesheet" />
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
        {/* Google tag (gtag.js) - Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-003JB1NX1M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-003JB1NX1M', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ProfessionalService", "LocalBusiness"],
              "name": "SejatiDimedia - Jasa Pembuatan Aplikasi & Website Balikpapan",
              "alternateName": "SejatiDimedia",
              "url": "https://sejatidimedia.web.id",
              "logo": "https://sejatidimedia.web.id/logo.svg",
              "image": "https://sejatidimedia.web.id/logo.svg",
              "description": "Jasa pembuatan aplikasi mobile (iOS & Android), pembuatan website profesional, sistem SaaS, dan solusi software kustom di Balikpapan, Kalimantan Timur.",
              "founder": {
                "@type": "Person",
                "name": "Timur Dian Radha Sejati",
                "jobTitle": "Lead Software Engineer & Founder",
                "url": "https://sejatidimedia.web.id"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Balikpapan",
                "addressRegion": "Kalimantan Timur",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -1.2379,
                "longitude": 116.8529
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Balikpapan"
                },
                {
                  "@type": "Country",
                  "name": "Indonesia"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Layanan Pengembangan Perangkat Lunak",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Jasa Pembuatan Aplikasi Mobile Balikpapan (iOS & Android)"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Jasa Pembuatan Website & Web App Balikpapan"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Pengembangan Sistem SaaS & ERP Custom"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Integrasi Sistem & AI / LLM"
                    }
                  }
                ]
              },
              "priceRange": "$$",
              "sameAs": [
                "https://fastwork.id/en/user/timurradhadian",
                "https://www.upwork.com/freelancers/~017698b392e21b4b6c",
                "https://github.com/timursejati"
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
