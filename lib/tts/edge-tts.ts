/** Wrapper Microsoft Edge TTS (unofficial, gratuit illimité).
 *  Utilise msedge-tts qui imite le navigateur Edge pour accéder
 *  aux voix neurales Azure sans clé API.
 *
 *  ATTENTION : la librairie msedge-tts ne supporte pas SSML complet —
 *  on lui passe le TEXTE BRUT et on gère vitesse/pitch via ses options. */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export type EdgeTTSVoice = {
  shortName: string;
  locale: string;
  label: string;
  character: string;
  gender: "Male" | "Female";
};

/** Voix Edge sélectionnées pour KSN. Toutes neurales Azure. */
export const EDGE_TTS_VOICES: Record<string, EdgeTTSVoice> = {
  // ─── FRANÇAIS ──────────────────────────────────────────────────
  "fr-FR-HenriNeural": {
    shortName: "fr-FR-HenriNeural",
    locale: "fr-FR",
    gender: "Male",
    label: "Henri (Azure)",
    character: "Masculine posée, équivalent gratuit de Neural2-B.",
  },
  "fr-FR-DeniseNeural": {
    shortName: "fr-FR-DeniseNeural",
    locale: "fr-FR",
    gender: "Female",
    label: "Denise (Azure)",
    character: "Féminine chaleureuse, narrative.",
  },
  "fr-FR-VivienneMultilingualNeural": {
    shortName: "fr-FR-VivienneMultilingualNeural",
    locale: "fr-FR",
    gender: "Female",
    label: "Vivienne (Multilingue)",
    character: "Peut lire FR/EN/IT/ES avec UNE seule voix cohérente.",
  },
  "fr-FR-RemyMultilingualNeural": {
    shortName: "fr-FR-RemyMultilingualNeural",
    locale: "fr-FR",
    gender: "Male",
    label: "Rémy (Multilingue)",
    character: "Multilingue masculine, idéal contenu pédagogique.",
  },

  // ─── ANGLAIS ───────────────────────────────────────────────────
  "en-US-GuyNeural": {
    shortName: "en-US-GuyNeural",
    locale: "en-US",
    gender: "Male",
    label: "Guy (Azure)",
    character: "Calm, narrative, religious-friendly.",
  },
  "en-US-JennyNeural": {
    shortName: "en-US-JennyNeural",
    locale: "en-US",
    gender: "Female",
    label: "Jenny (Azure)",
    character: "Warm, contemplative.",
  },

  // ─── ARABE ─────────────────────────────────────────────────────
  "ar-SA-HamedNeural": {
    shortName: "ar-SA-HamedNeural",
    locale: "ar-SA",
    gender: "Male",
    label: "Hamed (Arabe)",
    character: "Voix arabe saoudienne masculine respectueuse.",
  },
  "ar-SA-ZariyahNeural": {
    shortName: "ar-SA-ZariyahNeural",
    locale: "ar-SA",
    gender: "Female",
    label: "Zariyah (Arabe)",
    character: "Voix arabe féminine douce.",
  },

  // ─── ITALIEN ───────────────────────────────────────────────────
  "it-IT-DiegoNeural": {
    shortName: "it-IT-DiegoNeural",
    locale: "it-IT",
    gender: "Male",
    label: "Diego (Azure)",
    character: "Voix italienne masculine narrative.",
  },

  // ─── ESPAGNOL ──────────────────────────────────────────────────
  "es-ES-AlvaroNeural": {
    shortName: "es-ES-AlvaroNeural",
    locale: "es-ES",
    gender: "Male",
    label: "Álvaro (Azure)",
    character: "Voix espagnole masculine calme.",
  },
};

export const DEFAULT_EDGE_VOICE_BY_LANG: Record<string, string> = {
  fr: "fr-FR-HenriNeural",
  en: "en-US-GuyNeural",
  ar: "ar-SA-HamedNeural",
  it: "it-IT-DiegoNeural",
  es: "es-ES-AlvaroNeural",
};

export type EdgeTTSResult = {
  audioBuffer: Buffer;
  contentType: string;
  provider: "edge";
  voiceId: string;
  billableChars: number;
};

/** Convertit le texte en MP3 via Edge TTS.
 *  Pas de SSML — on utilise les options rate/pitch de la lib pour donner
 *  un rendu contemplatif (rate -8% = ~0.92x). */
export async function generateWithEdgeTTS(
  text: string,
  voiceId: string,
  options: { rate?: string; pitch?: string } = {}
): Promise<EdgeTTSResult> {
  const voice = EDGE_TTS_VOICES[voiceId];
  if (!voice) {
    throw new Error(`Voix Edge inconnue : ${voiceId}`);
  }

  // Edge TTS attend les % comme "-8%" pour ralentir
  const rate = options.rate ?? "-8%";
  const pitch = options.pitch ?? "+0Hz";

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice.shortName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // Préparation du texte : nettoyage et préservation des respirations
  // (Edge TTS lit littéralement, donc les points/virgules suffisent)
  const cleanText = text
    .replace(/\n\n+/g, "\n\n")
    .trim();

  const stream = tts.toStream(cleanText, {
    rate,
    pitch,
    volume: "+0%",
  });

  // Accumule le stream en buffer
  const chunks: Buffer[] = [];
  return new Promise<EdgeTTSResult>((resolve, reject) => {
    stream.audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.audioStream.on("close", () => {
      const audioBuffer = Buffer.concat(chunks);
      resolve({
        audioBuffer,
        contentType: "audio/mpeg",
        provider: "edge",
        voiceId,
        billableChars: cleanText.length,
      });
    });
    stream.audioStream.on("error", reject);

    // Timeout de sécurité (Edge TTS peut hang sur les très longs textes)
    setTimeout(() => reject(new Error("Edge TTS timeout (60s)")), 60_000);
  });
}
