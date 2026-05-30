import type { Metadata } from "next";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

async function getModule(id: string) {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/eduModules/${id}?key=${API_KEY}`,
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
  const mod = await getModule(id);

  const title = mod?.title ? `${mod.title} — Éducation KSN` : "Module — Éducation Islamique KSN";
  const description =
    mod?.description ??
    "Module d'éducation islamique — Tazawwud-ss-Sighar de Cheikh Ahmadou Bamba, par le Dahira KSN.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://salaatualaanabii.com/education/modules/${id}`,
      images: [{ url: "/logo/ksn-logo.png", width: 800, height: 800, alt: "KSN" }],
    },
    alternates: { canonical: `https://salaatualaanabii.com/education/modules/${id}` },
  };
}

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
