import type { Metadata } from "next";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

async function getLecon(id: string) {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/eduLecons/${id}?key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const f = data?.fields;
    return {
      title: f?.title?.mapValue?.fields?.fr?.stringValue ?? f?.title?.stringValue ?? null,
      description: f?.description?.mapValue?.fields?.fr?.stringValue ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lecon = await getLecon(id);

  const title = lecon?.title ? `${lecon.title} — KSN Éducation` : "Leçon — Éducation Islamique KSN";
  const description =
    lecon?.description ??
    "Leçon spirituelle tirée du Tazawwud-ss-Sighar de Cheikh Ahmadou Bamba, par le Dahira KSN.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://salaatualaanabii.com/education/lecons/${id}`,
      images: [{ url: "/logo/ksn-logo.png", width: 800, height: 800, alt: "KSN" }],
    },
    alternates: { canonical: `https://salaatualaanabii.com/education/lecons/${id}` },
  };
}

export default function LeconLayout({ children }: { children: React.ReactNode }) {
  return children;
}
