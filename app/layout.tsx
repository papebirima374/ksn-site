import type { Metadata } from "next";
import { Playfair_Display, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.fullName}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Kippangog Salaatu 'Alaa Nabii (KSN) — Dahira international au service du Salaatu sur le Prophète Muhammad ﷺ. Fondé en 2021 à Touba, Sénégal.",
  keywords: [
    "KSN",
    "Kippangog Salaatu",
    "Salaatu Alaa Nabii",
    "Dahira",
    "Touba",
    "Sénégal",
    "Mouridiyya",
    "Spiritualité",
    "Islam",
    "Prophète Muhammad",
  ],
  authors: [{ name: "KSN — Kippangog Salaatu 'Alaa Nabii" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.fullName}`,
    description:
      "Une communauté spirituelle moderne au service du Salaatu sur le Prophète Muhammad ﷺ.",
    images: [
      {
        url: "/logo/ksn-logo.png",
        width: 800,
        height: 800,
        alt: "Logo KSN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.fullName}`,
    description:
      "Une communauté spirituelle moderne au service du Salaatu sur le Prophète Muhammad ﷺ.",
    images: ["/logo/ksn-logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="relative min-h-screen overflow-hidden bg-[#082F22]">
          <Background />
          <Navbar />
          {children}
          <Footer />
          <WhatsAppFloat />
        </main>
      </body>
    </html>
  );
}
