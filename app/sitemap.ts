import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

// Routes publiques indexables. /admin et /admin/* sont volontairement exclus.
const PUBLIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/dahira", priority: 0.9, changeFrequency: "monthly" },
  { path: "/spiritualite", priority: 0.95, changeFrequency: "daily" },
  { path: "/media", priority: 0.85, changeFrequency: "weekly" },
  { path: "/boutique", priority: 0.85, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/don", priority: 0.9, changeFrequency: "monthly" },
  { path: "/inscription", priority: 0.85, changeFrequency: "monthly" },
  { path: "/espace-membre", priority: 0.7, changeFrequency: "monthly" },
  { path: "/challenge", priority: 0.95, changeFrequency: "daily" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  return PUBLIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
