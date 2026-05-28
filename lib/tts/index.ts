/** Interface unifiée de génération audio TTS.
 *  Stratégie : Google Cloud TTS en primaire (qualité maximale via SSML),
 *  Edge TTS en fallback (gratuit illimité si Google quota dépassé ou
 *  clé absente). */

import { generateWithGoogleTTS, GOOGLE_TTS_VOICES, DEFAULT_VOICE_BY_LANG } from "./google-tts";
import { generateWithEdgeTTS, EDGE_TTS_VOICES, DEFAULT_EDGE_VOICE_BY_LANG } from "./edge-tts";
import { estimateBillableChars, estimateDurationSeconds, type SpiritualSSMLOptions } from "./ssml";

export type TTSProvider = "google" | "edge" | "auto";

export type TTSLanguage = "fr" | "en" | "ar" | "it" | "es";

export type TTSGenerationRequest = {
  text: string;
  language: TTSLanguage;
  /** ID de voix explicite. Si omis, on choisit la défaut de la langue. */
  voiceId?: string;
  /** Provider explicite. "auto" = Google si dispo + clé, sinon Edge. */
  provider?: TTSProvider;
  ssmlOptions?: SpiritualSSMLOptions;
};

export type TTSGenerationResult = {
  audioBuffer: Buffer;
  contentType: string;
  provider: "google" | "edge";
  voiceId: string;
  billableChars: number;
  estimatedSeconds: number;
};

/** Génère un MP3 à partir d'un texte selon la stratégie demandée. */
export async function generateAudio(
  req: TTSGenerationRequest
): Promise<TTSGenerationResult> {
  const provider = req.provider ?? "auto";
  const estimatedSeconds = estimateDurationSeconds(req.text, req.ssmlOptions?.rate);

  // Détection clé Google
  const hasGoogleKey = Boolean(process.env.GOOGLE_TTS_API_KEY);
  const shouldUseGoogle =
    provider === "google" || (provider === "auto" && hasGoogleKey);

  if (shouldUseGoogle) {
    const voiceId = req.voiceId ?? DEFAULT_VOICE_BY_LANG[req.language];
    if (!voiceId || !GOOGLE_TTS_VOICES[voiceId]) {
      throw new Error(`Voix Google manquante pour la langue ${req.language}`);
    }
    try {
      const r = await generateWithGoogleTTS(req.text, voiceId, req.ssmlOptions);
      return { ...r, estimatedSeconds };
    } catch (err) {
      // Fallback automatique vers Edge si Google échoue (quota, etc.)
      if (provider === "auto") {
        console.warn(`Google TTS failed, falling back to Edge:`, err);
        return generateWithEdgeFallback(req, estimatedSeconds);
      }
      throw err;
    }
  }

  return generateWithEdgeFallback(req, estimatedSeconds);
}

async function generateWithEdgeFallback(
  req: TTSGenerationRequest,
  estimatedSeconds: number
): Promise<TTSGenerationResult> {
  const voiceId = req.voiceId && EDGE_TTS_VOICES[req.voiceId]
    ? req.voiceId
    : DEFAULT_EDGE_VOICE_BY_LANG[req.language];
  if (!voiceId) {
    throw new Error(`Voix Edge manquante pour la langue ${req.language}`);
  }
  const rate = req.ssmlOptions?.rate
    ? `${Math.round((req.ssmlOptions.rate - 1) * 100)}%`
    : "-8%";
  const r = await generateWithEdgeTTS(req.text, voiceId, { rate });
  return { ...r, estimatedSeconds };
}

/** Liste consolidée des voix disponibles, groupées par provider. */
export function listAllVoices() {
  return {
    google: Object.entries(GOOGLE_TTS_VOICES).map(([id, v]) => ({
      id,
      provider: "google" as const,
      languageCode: v.languageCode,
      gender: v.ssmlGender,
      label: v.label,
      character: v.character,
    })),
    edge: Object.entries(EDGE_TTS_VOICES).map(([id, v]) => ({
      id,
      provider: "edge" as const,
      languageCode: v.locale,
      gender: v.gender === "Male" ? "MALE" as const : "FEMALE" as const,
      label: v.label,
      character: v.character,
    })),
  };
}

export { estimateBillableChars, estimateDurationSeconds };
export { DEFAULT_VOICE_BY_LANG, DEFAULT_EDGE_VOICE_BY_LANG };

/** Indique si la clé Google Cloud est configurée côté serveur. */
export function isGoogleTTSConfigured(): boolean {
  return Boolean(process.env.GOOGLE_TTS_API_KEY);
}
