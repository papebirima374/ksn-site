import { NextRequest } from "next/server";

// Proxy d'images same-origin : permet à html2canvas (génération de la planche
// de cartes PDF) de capturer la photo (Firebase Storage) et le QR (qrserver)
// sans erreur CORS. Allowlist stricte des hôtes pour éviter le SSRF.
const ALLOWED_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "api.qrserver.com",
]);

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return new Response("Paramètre 'url' manquant", { status: 400 });
  }
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("URL invalide", { status: 400 });
  }
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return new Response("Hôte non autorisé", { status: 403 });
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const upstream = await fetch(parsed.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!upstream.ok) {
      return new Response("Image indisponible", { status: upstream.status });
    }
    const buf = await upstream.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Erreur de récupération", { status: 502 });
  }
}
