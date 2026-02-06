import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pinky's Store | Cosméticos, Joyería y Perfumes Premium",
  description: "Descubre la exclusiva colección de Pinky's Store. Cosméticos de alta calidad, joyería elegante y perfumes premium en Honduras. Envíos a nivel nacional.",
  keywords: ["cosméticos", "joyería", "perfumes", "maquillaje", "accesorios", "Honduras", "San Pedro Sula", "belleza", "tienda online"],
  authors: [{ name: "Pinky's Store" }],
  openGraph: {
    title: "Pinky's Store | Cosméticos, Joyería y Perfumes Premium",
    description: "Tu destino para cosméticos premium, joyería elegante y fragancias exclusivas en Honduras.",
    type: "website",
    locale: "es_HN",
    siteName: "Pinky's Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinky's Store | Cosméticos, Joyería y Perfumes Premium",
    description: "Tu destino para cosméticos premium, joyería elegante y fragancias exclusivas en Honduras.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf4f7" },
    { media: "(prefers-color-scheme: dark)", color: "#2a1a20" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
