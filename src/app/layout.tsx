import "./globals.css";
import type { Metadata, Viewport } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
