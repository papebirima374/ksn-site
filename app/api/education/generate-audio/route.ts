/** Endpoint serveur pour la génération d'audios éducatifs.
 *
 *  POST /api/education/generate-audio
 *  Body : { text, language, voiceId?, provider?, rate? }
 *  Reponse : audio/mpeg (le MP3 directement, à charger dans <audio>)
 *
 *  Note : la sauvegarde dans Firebase Storage se fait CÔTÉ CLIENT
 *  après réception du buffer, pour rester serverless-friendly et
 *  réutiliser les credentials Storage du client. L'API route ne fait
 *  QUE la génération TTS. */

import { NextRequest, NextResponse } from "next/server";
import { generateAudio, type TTSLanguage, type TTSProvider } from "@/lib/tts";

export const runtime = "nodejs"; // edge-tts utilise des modules Node
export const maxDuration = 60;

const MAX_TEXT_LENGTH = 8000; // ~ 8 minutes d'audio max par génération

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body.text ?? "").trim();
    const language = String(body.language ?? "fr") as TTSLanguage;
    const voiceId = body.voiceId ? String(body.voiceId) : undefined;
    const provider = body.provider ? String(body.provider) as TTSProvider : "auto";
    const rate = typeof body.rate === "number" ? body.rate : undefined;

    // Validations
    if (text.length === 0) {
      return NextResponse.json({ error: "Le texte est obligatoire." }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Texte trop long (${text.length} chars). Max ${MAX_TEXT_LENGTH}.` },
        { status: 400 }
      );
    }
    if (!["fr", "en", "ar", "it", "es"].includes(language)) {
      return NextResponse.json({ error: "Langue invalide." }, { status: 400 });
    }

    const startedAt = Date.now();
    const result = await generateAudio({
      text,
      language,
      voiceId,
      provider,
      ssmlOptions: rate ? { rate } : undefined,
    });
    const elapsedMs = Date.now() - startedAt;

    // Retourne directement le MP3 binaire
    return new NextResponse(new Uint8Array(result.audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Length": String(result.audioBuffer.length),
        // Métadonnées exposées dans les headers (lisibles côté client)
        "X-Tts-Provider": result.provider,
        "X-Tts-Voice": result.voiceId,
        "X-Tts-Billable-Chars": String(result.billableChars),
        "X-Tts-Estimated-Seconds": String(result.estimatedSeconds),
        "X-Tts-Generation-Ms": String(elapsedMs),
        // Pas de cache HTTP : chaque appel est unique (admin tester)
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[/api/education/generate-audio] failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Métadonnées : retourne la liste des voix disponibles + état des providers. */
export async function GET() {
  const { listAllVoices, isGoogleTTSConfigured } = await import("@/lib/tts");
  return NextResponse.json({
    voices: listAllVoices(),
    providers: {
      google: { configured: isGoogleTTSConfigured() },
      edge: { configured: true }, // toujours dispo
    },
  });
}
