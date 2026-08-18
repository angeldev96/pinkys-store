import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  OrganizationSchema,
  LocalBusinessSchema,
  WebSiteSchema,
  BreadcrumbSchema,
} from "@/components/StructuredData";

// Self-hosted by next/font: no render-blocking request to fonts.googleapis.com.
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pinkysstorehn.com";

// Products are fetched from Supabase on the client, so warm the connection early.
const SUPABASE_ORIGIN = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pinky's Store | Maquillaje, Joyería y Perfumes en Honduras",
    template: "%s | Pinky's Store Honduras",
  },
  description:
    "Compra maquillaje, joyería y perfumes premium en Honduras. Pinky's Store ofrece cosméticos de alta calidad, accesorios elegantes y fragancias exclusivas con envío a nivel nacional desde San Pedro Sula.",
  keywords: [
    "maquillaje Honduras",
    "joyería Honduras",
    "perfumes Honduras",
    "cosméticos San Pedro Sula",
    "tienda de maquillaje Honduras",
    "perfumes originales Honduras",
    "joyería elegante Honduras",
    "accesorios de belleza Honduras",
    "tienda online Honduras",
    "maquillaje premium Honduras",
    "fragancias exclusivas Honduras",
    "cosméticos premium San Pedro Sula",
    "Pinky's Store",
    "belleza Honduras",
    "comprar maquillaje en línea Honduras",
    "perfumería Honduras",
    "joyería para dama Honduras",
    "perfumes para caballero Honduras",
    "regalos Honduras",
    "tienda de belleza San Pedro Sula",
  ],
  authors: [{ name: "Pinky's Store", url: SITE_URL }],
  creator: "Pinky's Store",
  publisher: "Pinky's Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-HN": SITE_URL,
    },
  },
  openGraph: {
    title: "Pinky's Store | Maquillaje, Joyería y Perfumes en Honduras",
    description:
      "Compra maquillaje, joyería y perfumes premium en Honduras. Cosméticos de alta calidad, accesorios y fragancias exclusivas con envío nacional.",
    type: "website",
    locale: "es_HN",
    url: SITE_URL,
    siteName: "Pinky's Store",
    images: [
      {
        url: `${SITE_URL}/hero-banner.jpg`,
        width: 1200,
        height: 630,
        alt: "Pinky's Store - Maquillaje, Joyería y Perfumes Premium en Honduras",
        type: "image/jpeg",
      },
      {
        url: `${SITE_URL}/pinkys-logo.jpg`,
        width: 512,
        height: 512,
        alt: "Logo de Pinky's Store",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinky's Store | Maquillaje, Joyería y Perfumes en Honduras",
    description:
      "Compra maquillaje, joyería y perfumes premium en Honduras. Envíos a nivel nacional desde San Pedro Sula.",
    images: [`${SITE_URL}/hero-banner.jpg`],
    creator: "@pinkysstore2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "ecommerce",
  classification: "Business",
  other: {
    "geo.region": "HN-CR",
    "geo.placename": "San Pedro Sula",
    "geo.position": "15.5049;-88.0252",
    ICBM: "15.5049, -88.0252",
    "content-language": "es-HN",
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
    <html lang="es-HN" dir="ltr" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        {SUPABASE_ORIGIN && (
          <>
            <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="" />
            <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
          </>
        )}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/pinkys-logo.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pinky's Store" />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <WebSiteSchema />
        <BreadcrumbSchema />
      </head>
      <body>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
