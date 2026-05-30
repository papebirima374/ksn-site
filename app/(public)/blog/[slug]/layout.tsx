import type { Metadata } from "next";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

async function getArticleBySlug(slug: string) {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "articles" }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "slug" },
                      op: "EQUAL",
                      value: { stringValue: slug },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
                    },
                  },
                ],
              },
            },
            limit: 1,
          },
        }),
        next: { revalidate: 3600 },
      }
    );
    const data = await res.json();
    const doc = data?.[0]?.document;
    if (!doc) return null;
    const f = doc.fields;
    return {
      title: f?.title?.stringValue ?? null,
      excerpt: f?.excerpt?.stringValue ?? null,
      coverImage: f?.coverImage?.stringValue ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const title = article?.title ?? "Article — KSN Blog";
  const description =
    article?.excerpt ??
    "Retrouvez nos articles spirituels et actualités du Dahira KSN.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://salaatualaanabii.com/blog/${slug}`,
      images: article?.coverImage
        ? [{ url: article.coverImage, alt: title }]
        : [{ url: "/logo/ksn-logo.png", width: 800, height: 800, alt: "KSN" }],
    },
    alternates: { canonical: `https://salaatualaanabii.com/blog/${slug}` },
  };
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
