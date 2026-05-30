import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

const PUBLIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/dahira", priority: 0.9, changeFrequency: "monthly" },
  { path: "/notre-histoire", priority: 0.85, changeFrequency: "monthly" },
  { path: "/spiritualite", priority: 0.95, changeFrequency: "daily" },
  { path: "/media", priority: 0.85, changeFrequency: "weekly" },
  { path: "/boutique", priority: 0.85, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.75, changeFrequency: "monthly" },
  { path: "/don", priority: 0.9, changeFrequency: "monthly" },
  { path: "/inscription", priority: 0.85, changeFrequency: "monthly" },
  { path: "/espace-membre", priority: 0.7, changeFrequency: "monthly" },
  { path: "/challenge", priority: 0.95, changeFrequency: "daily" },
  { path: "/journee-salaatu", priority: 0.9, changeFrequency: "monthly" },
  { path: "/education", priority: 0.8, changeFrequency: "weekly" },
  { path: "/evenements", priority: 0.85, changeFrequency: "weekly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

async function fetchPublishedArticles(): Promise<{ slug: string; updatedAt: number }[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "articles" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "status" },
                op: "EQUAL",
                value: { stringValue: "published" },
              },
            },
            select: {
              fields: [{ fieldPath: "slug" }, { fieldPath: "updatedAt" }],
            },
          },
        }),
        next: { revalidate: 3600 },
      }
    );
    const data: Array<{ document?: { fields?: Record<string, { stringValue?: string; integerValue?: string }> } }> = await res.json();
    return data
      .map((d) => ({
        slug: d.document?.fields?.slug?.stringValue ?? "",
        updatedAt: parseInt(d.document?.fields?.updatedAt?.integerValue ?? "0"),
      }))
      .filter((a) => a.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const articles = await fetchPublishedArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
