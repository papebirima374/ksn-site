import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Amiri, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import PWAInstaller from "@/components/layout/PWAInstaller";

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

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  alternates: { canonical: SITE.url },
  title: {
    default: `${SITE.name} — ${SITE.fullName}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Kippangog Salaatu 'Alaa Nabii (KSN) — Dahira international au service du Salaatu sur le Prophète Muhammad ﷺ. Fondé en 2021 à Touba, Sénégal. Rejoignez la communauté spirituelle mouride pour le Salaatou Alan Nabi.",
  keywords: [
    // Nom officiel et variantes orthographiques
    "KSN",
    "Kippangog Salaatu",
    "Kippangog Salaatou",
    "Salaatu Alaa Nabii",
    "Salaatou Alan Nabi",
    "Salaatu Alan Nabii",
    "Salaat Alan Nabi",
    "Salaatoul Alan Nabi",
    "Salat Ala Nabi",
    "Salaatou Ala Nabi",
    "Salaatu",
    "Salaatou",
    "Salaat",
    "salaatualaanabii",
    "salatoualanabi",
    "salaatou alan nabi",
    // Organisation
    "Dahira",
    "Dahira Touba",
    "Dahira mouride",
    "Dahira islamique",
    "KSN Dahira",
    "Kippangog",
    // Géographie
    "Touba",
    "Sénégal",
    "Touba Sénégal",
    // Spiritualité
    "Mouridiyya",
    "Mouride",
    "Tariqa mouride",
    "Cheikh Ahmadou Bamba",
    "Spiritualité islamique",
    "Islam",
    "Prophète Muhammad",
    "Prophète Muhammad ﷺ",
    "communauté islamique",
    "dhikr",
    "invocations islamiques",
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
    apple: [
      { url: "/logo/ksn-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  // PWA — site installable comme application
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Site KSN",
    statusBarStyle: "black-translucent",
  },
  applicationName: "Site KSN",
  formatDetection: {
    telephone: false,
  },
};

/** Theme color + viewport — Next 16 separe ces metadata du reste */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F7C55" },
    { media: "(prefers-color-scheme: dark)", color: "#0A3D24" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${amiri.variable} ${crimson.variable} h-full antialiased`}
    >
      <head>
        <OrganizationSchema />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <PWAInstaller />
      </body>
    </html>
  );
}
