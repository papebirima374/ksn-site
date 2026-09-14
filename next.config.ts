import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  /* La section Éducation (Tazawwud) a ete retiree du site en septembre 2026.
     Ses adresses restent indexees par les moteurs et figurent peut-etre dans
     des liens partages : plutot qu'une page 404, on renvoie le visiteur vers
     la page Spiritualite. Redirection permanente (308) pour que Google
     remplace l'ancienne entree au lieu de la garder. */
  async redirects() {
    return [
      { source: "/education", destination: "/spiritualite", permanent: true },
      { source: "/education/:path*", destination: "/spiritualite", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
