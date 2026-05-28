/** Wrapper Google Cloud Text-to-Speech.
 *  Utilise l'API REST directe (pas le SDK) pour rester serverless-friendly :
 *  pas besoin d'installer @google-cloud/text-to-speech (qui embarque gRPC). */

import { toSpiritualSSML, type SpiritualSSMLOptions } from "./ssml";

export type GoogleTTSVoice = {
  languageCode: string;
  name: string;
  ssmlGender: "FEMALE" | "MALE" | "NEUTRAL";
};

/** Catalogue des voix recommandées pour KSN.
 *  Chaque voix est testée et choisie pour son caractère spirituel. */
export const GOOGLE_TTS_VOICES: Record<string, GoogleTTSVoice & { label: string; character: string }> = {
  // ─── FRANÇAIS ──────────────────────────────────────────────────
  "fr-FR-Neural2-B": {
    languageCode: "fr-FR",
    name: "fr-FR-Neural2-B",
    ssmlGender: "MALE",
    label: "Henri (Magistère religieux)",
    character: "Masculine, posée, autorité spirituelle. Idéal Tazawwud.",
  },
  "fr-FR-Neural2-D": {
    languageCode: "fr-FR",
    name: "fr-FR-Neural2-D",
    ssmlGender: "FEMALE",
    label: "Élise (Contemplative)",
    character: "Féminine, douce, chuchotée. Idéal hadiths du soir.",
  },
  "fr-FR-Neural2-A": {
    languageCode: "fr-FR",
    name: "fr-FR-Neural2-A",
    ssmlGender: "FEMALE",
    label: "Sophie (Enseignement)",
    character: "Féminine claire, didactique. Idéal cours structurés.",
  },
  "fr-FR-Neural2-C": {
    languageCode: "fr-FR",
    name: "fr-FR-Neural2-C",
    ssmlGender: "MALE",
    label: "Marc (Chaleureux)",
    character: "Masculine chaleureuse, narrative. Idéal rappels.",
  },

  // ─── ANGLAIS ───────────────────────────────────────────────────
  "en-US-Neural2-F": {
    languageCode: "en-US",
    name: "en-US-Neural2-F",
    ssmlGender: "FEMALE",
    label: "Rachel (Warm)",
    character: "Warm, calm, narrator-style. Recommended.",
  },
  "en-US-Neural2-J": {
    languageCode: "en-US",
    name: "en-US-Neural2-J",
    ssmlGender: "MALE",
    label: "Henry (Authoritative)",
    character: "Deep, posed, religious authority feel.",
  },

  // ─── ARABE ─────────────────────────────────────────────────────
  "ar-XA-Wavenet-B": {
    languageCode: "ar-XA",
    name: "ar-XA-Wavenet-B",
    ssmlGender: "MALE",
    label: "صوت ذكوري دافئ",
    character: "Masculine arabe respectueux, idéal versets.",
  },
  "ar-XA-Wavenet-D": {
    languageCode: "ar-XA",
    name: "ar-XA-Wavenet-D",
    ssmlGender: "FEMALE",
    label: "صوت أنثوي",
    character: "Féminine arabe douce.",
  },

  // ─── ITALIEN ───────────────────────────────────────────────────
  "it-IT-Neural2-A": {
    languageCode: "it-IT",
    name: "it-IT-Neural2-A",
    ssmlGender: "FEMALE",
    label: "Bianca (Narrativa)",
    character: "Italiana posata, narrativa religieuse.",
  },

  // ─── ESPAGNOL ──────────────────────────────────────────────────
  "es-ES-Neural2-A": {
    languageCode: "es-ES",
    name: "es-ES-Neural2-A",
    ssmlGender: "FEMALE",
    label: "Carmen (Cálida)",
    character: "Espagnole posée, chaleureuse.",
  },
};

export const DEFAULT_VOICE_BY_LANG: Record<string, string> = {
  // FR : Marc (Neural2-C) — masculine chaleureuse, narrative.
  // Validé par Pape Birima comme la voix officielle de la
  // Commission Éducation & Culture pour les enseignements.
  fr: "fr-FR-Neural2-C",
  en: "en-US-Neural2-J",
  ar: "ar-XA-Wavenet-B",
  it: "it-IT-Neural2-A",
  es: "es-ES-Neural2-A",
};

export type GoogleTTSResult = {
  audioBuffer: Buffer;
  contentType: string;
  provider: "google";
  voiceId: string;
  billableChars: number;
};

/** Génère un MP3 via l'API Google Cloud TTS REST.
 *  Lance une erreur si GOOGLE_TTS_API_KEY n'est pas définie. */
export async function generateWithGoogleTTS(
  text: string,
  voiceId: string,
  ssmlOptions?: SpiritualSSMLOptions
): Promise<GoogleTTSResult> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_TTS_API_KEY n'est pas définie dans .env.local");
  }

  const voice = GOOGLE_TTS_VOICES[voiceId];
  if (!voice) {
    throw new Error(`Voix Google inconnue : ${voiceId}`);
  }

  const ssml = toSpiritualSSML(text, ssmlOptions);

  const body = {
    input: { ssml },
    voice: {
      languageCode: voice.languageCode,
      name: voice.name,
      ssmlGender: voice.ssmlGender,
    },
    audioConfig: {
      audioEncoding: "MP3",
      sampleRateHertz: 24000,
      effectsProfileId: ["headphone-class-device"], // optimise pour casque
      pitch: 0,
      speakingRate: 1.0, // on gère la vitesse via SSML prosody
    },
  };

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google TTS erreur ${res.status} : ${errText.slice(0, 300)}`);
  }

  const data: { audioContent: string } = await res.json();
  const audioBuffer = Buffer.from(data.audioContent, "base64");

  return {
    audioBuffer,
    contentType: "audio/mpeg",
    provider: "google",
    voiceId,
    billableChars: ssml.length,
  };
}
