import "./globals.css";
import type { Metadata, Viewport } from "next";
import NextTopLoader from 'nextjs-toploader';
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata: Metadata = {
  title: "SejatiDimedia",
  description: "A premium dual-theme design system and media command center designed in a Linear/Modern style.",
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
