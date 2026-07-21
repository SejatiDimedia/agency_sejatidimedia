import "./globals.css";
import type { Metadata, Viewport } from "next";
import NextTopLoader from 'nextjs-toploader';
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://sejatidimedia.web.id"),
  title: {
    template: "%s | SejatiDimedia",
    default: "SejatiDimedia - Premium Software Agency & Development",
  },
  description: "SejatiDimedia adalah software agency & media command center premium. Kami membangun sistem produksi, aplikasi SaaS, dan produk mobile kustom berkinerja tinggi.",
  keywords: [
    "sejatidimedia",
    "sejati dimedia",
    "software agency indonesia",
    "web development",
    "mobile app development",
    "jasa pembuatan website",
    "jasa pembuatan aplikasi",
    "Timur Dian Radhasejati",
    "SaaS builder",
  ],
  authors: [{ name: "Timur Dian Radhasejati" }],
  creator: "SejatiDimedia",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sejatidimedia.web.id",
    title: "SejatiDimedia - Premium Software Agency",
    description: "Software agency premium yang berfokus pada aplikasi SaaS, web, dan produk mobile berkualitas tinggi.",
    siteName: "SejatiDimedia",
  },
  twitter: {
    card: "summary_large_image",
    title: "SejatiDimedia - Premium Software Agency",
    description: "Membangun sistem produksi, aplikasi SaaS, dan produk mobile kustom.",
  },
  verification: {
    google: "VDJFy4jlvNQW0Xibu-TmVqJt9ZuNH-hBwIPG3W8TIn8",
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

import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
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
                "name": "Timur Dian Radhasejati"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID"
              },
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
