"use client";

import { useEffect, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  FaWandMagicSparkles,
  FaCircleInfo,
  FaPlay,
  FaPause,
  FaDownload,
  FaCloudArrowUp,
  FaTriangleExclamation,
  FaCheck,
} from "react-icons/fa6";

type Voice = {
  id: string;
  provider: "google" | "edge";
  languageCode: string;
  gender: string;
  label: string;
  character: string;
};

type VoicesData = {
  voices: { google: Voice[]; edge: Voice[] };
  providers: { google: { configured: boolean }; edge: { configured: boolean } };
};

const SAMPLE_TEXTS: Record<string, string> = {
  fr: `Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Cheikh Ahmadou Bamba, dans le Tazawwud, enseigne aux jeunes les fondements de la pratique islamique.

La Salaatu sur le Prophète Muhammad ﷺ est l'un des actes les plus aimés d'Allah. Celui qui prie sur le Prophète une fois, Allah prie sur lui dix fois — telle est la promesse divine rapportée par Muslim.

Multiplie tes Salaatu, mon frère, ma sœur, et tu trouveras dans cet acte une lumière qui guide ton cœur.`,
  en: `In the name of Allah, the Most Merciful, the Most Compassionate. The Prophet Muhammad ﷺ said: "Whoever sends one blessing upon me, Allah will send ten blessings upon him." This is the noble path of the Salaatu.`,
  ar: `بسم الله الرحمن الرحيم. اللهم صل على سيدنا محمد وعلى آله وصحبه وسلم.`,
  it: `Nel nome di Allah, il Misericordioso, il Compassionevole. La Salaatu sul Profeta Muhammad ﷺ è uno degli atti più amati da Allah.`,
  es: `En el nombre de Allah, el Más Misericordioso, el Más Compasivo. La Salaatu sobre el Profeta Muhammad ﷺ es uno de los actos más amados por Allah.`,
};

export default function AdminEducationPage() {
  const { user } = useAuth();

  const [voicesData, setVoicesData] = useState<VoicesData | null>(null);
  const [text, setText] = useState(SAMPLE_TEXTS.fr);
  const [language, setLanguage] = useState<"fr" | "en" | "ar" | "it" | "es">("fr");
  const [provider, setProvider] = useState<"auto" | "google" | "edge">("auto");
  const [voiceId, setVoiceId] = useState<string>("fr-FR-Neural2-B");
  const [rate, setRate] = useState(0.92);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<{
    provider: string;
    voice: string;
    chars: number;
    seconds: number;
    elapsedMs: number;
    sizeKB: number;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Charge la liste des voix au mount
  useEffect(() => {
    fetch("/api/education/generate-audio")
      .then((r) => r.json())
      .then(setVoicesData)
      .catch(() => setError("Impossible de charger la liste des voix."));
  }, []);

  // Préfill du texte d'exemple quand la langue change
  useEffect(() => {
    if (SAMPLE_TEXTS[language]) {
      setText(SAMPLE_TEXTS[language]);
    }
  }, [language]);

  // Auto-set la voix par défaut quand provider ou langue change
  useEffect(() => {
    if (!voicesData) return;
    const filterVoices = (vs: Voice[]) =>
      vs.filter((v) => v.languageCode.toLowerCase().startsWith(language));
    const googleFor = filterVoices(voicesData.voices.google);
    const edgeFor = filterVoices(voicesData.voices.edge);
    if (provider === "google" && googleFor.length > 0) {
      setVoiceId(googleFor[0].id);
    } else if (provider === "edge" && edgeFor.length > 0) {
      setVoiceId(edgeFor[0].id);
    } else if (provider === "auto") {
      // Préfère Google s'il est configuré, sinon Edge
      if (voicesData.providers.google.configured && googleFor.length > 0) {
        setVoiceId(googleFor[0].id);
      } else if (edgeFor.length > 0) {
        setVoiceId(edgeFor[0].id);
      }
    }
  }, [provider, language, voicesData]);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Le texte est vide.");
      return;
    }
    setGenerating(true);
    setError("");
    setLastResult(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const startTs = Date.now();
      const res = await fetch("/api/education/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, voiceId, provider, rate }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(errJson.error || "Échec de la génération");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      setLastResult({
        provider: res.headers.get("X-Tts-Provider") || "?",
        voice: res.headers.get("X-Tts-Voice") || voiceId,
        chars: Number(res.headers.get("X-Tts-Billable-Chars") || 0),
        seconds: Number(res.headers.get("X-Tts-Estimated-Seconds") || 0),
        elapsedMs: Date.now() - startTs,
        sizeKB: Math.round(blob.size / 1024),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setGenerating(false);
    }
  }

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setIsPlaying(true);
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }

  function downloadMp3() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `ksn-education-${language}-${Date.now()}.mp3`;
    a.click();
  }

  if (!user || user.role !== "admin") {
    return (
      <AdminShell>
        <div className="bg-white rounded-3xl p-8 text-center">
          <FaTriangleExclamation className="mx-auto text-4xl text-[#B8860B] mb-3" />
          <p className="text-gray-600">
            Section réservée à l&apos;administrateur principal pendant la phase
            de test. La permission <code className="bg-gray-100 px-1.5 py-0.5 rounded">education.write</code> sera créée prochainement.
          </p>
        </div>
      </AdminShell>
    );
  }

  // Voix filtrées par langue
  const filteredVoices = voicesData
    ? [
        ...voicesData.voices.google.filter((v) =>
          v.languageCode.toLowerCase().startsWith(language)
        ),
        ...voicesData.voices.edge.filter((v) =>
          v.languageCode.toLowerCase().startsWith(language)
        ),
      ].filter((v) => {
        if (provider === "auto") return true;
        return v.provider === provider;
      })
    : [];

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Commission Éducation & Culture
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Atelier audio TTS
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-3xl">
          Testez la génération audio des enseignements en plusieurs langues.
          Cette page est <strong>réservée au développement</strong> — la section
          publique <code className="bg-gray-100 px-1.5 py-0.5 rounded">/education</code> affiche
          actuellement « À venir Inch&apos;Allah » pour les visiteurs.
        </p>
      </header>

      {/* Bandeau état providers */}
      {voicesData && (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <ProviderStatus
            label="Google Cloud TTS"
            sub="Voix premium WaveNet/Neural2 — 1 M chars gratuits/mois"
            configured={voicesData.providers.google.configured}
            voiceCount={voicesData.voices.google.length}
          />
          <ProviderStatus
            label="Microsoft Edge TTS"
            sub="Voix Azure Neural — gratuit illimité (unofficial)"
            configured={voicesData.providers.edge.configured}
            voiceCount={voicesData.voices.edge.length}
          />
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Texte à lire
            <span className="ml-2 text-gray-400 font-normal">
              ({text.length} caractères, ~{Math.ceil(text.length / 13 / 0.92)} sec)
            </span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#0F7C55] leading-7 font-mono focus:border-[#0F7C55] focus:outline-none"
            placeholder="Écris ici le texte à transformer en audio…"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Langue
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="ar">🇸🇦 العربية</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="es">🇪🇸 Español</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as typeof provider)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
            >
              <option value="auto">Auto (Google si dispo, sinon Edge)</option>
              <option value="google">Google Cloud (premium)</option>
              <option value="edge">Microsoft Edge (gratuit)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Vitesse · {rate.toFixed(2)}x
            </label>
            <input
              type="range"
              min={0.75}
              max={1.15}
              step={0.01}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#0F7C55]"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              0.92 = contemplatif (recommandé pour Tazawwud)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Voix ({filteredVoices.length} disponibles pour {language.toUpperCase()})
          </label>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
          >
            {filteredVoices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} · {v.provider === "google" ? "🌐 Google" : "⚡ Edge"} · {v.gender}
              </option>
            ))}
          </select>
          {filteredVoices.find((v) => v.id === voiceId) && (
            <p className="mt-2 text-xs text-gray-500 italic">
              {filteredVoices.find((v) => v.id === voiceId)?.character}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !text.trim()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-3 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 text-sm"
          >
            <FaWandMagicSparkles />
            {generating ? "Génération en cours…" : "Générer l'audio"}
          </button>
          <p className="text-xs text-gray-500">
            Le temps de génération varie de 2 à 15 secondes selon la longueur.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
            <FaTriangleExclamation className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Erreur de génération</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Audio Player Result */}
      {audioUrl && lastResult && (
        <div className="bg-gradient-to-br from-[#0A3D24] to-[#082F22] rounded-3xl shadow-xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 mb-5">
            <FaCheck className="text-emerald-400" />
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
              Audio généré
            </p>
          </div>

          <h3 className="font-display text-xl font-bold mb-1">
            {lastResult.provider === "google" ? "🌐 Google Cloud" : "⚡ Microsoft Edge"} ·{" "}
            <span className="text-[#D4AF37]">{lastResult.voice}</span>
          </h3>
          <p className="text-white/60 text-xs mb-5">
            {lastResult.chars.toLocaleString("fr-FR")} caractères ·{" "}
            ~{lastResult.seconds}s audio · {lastResult.sizeKB} Ko ·{" "}
            généré en {(lastResult.elapsedMs / 1000).toFixed(1)}s
          </p>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/20">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              controls
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F7C55] font-bold px-4 py-2.5 rounded-xl text-sm transition"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? "Pause" : "Écouter"}
            </button>
            <button
              type="button"
              onClick={downloadMp3}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
            >
              <FaDownload /> Télécharger le MP3
            </button>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/40 font-semibold px-4 py-2.5 rounded-xl text-sm cursor-not-allowed"
              title="À venir dans le prochain sprint"
            >
              <FaCloudArrowUp /> Sauvegarder dans la bibliothèque (à venir)
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 bg-[#F8F5EF] border border-[#D4AF37]/30 rounded-3xl p-6 text-[#0F7C55] text-sm leading-7">
        <p className="flex items-start gap-2">
          <FaCircleInfo className="text-[#B8860B] mt-1 flex-shrink-0" />
          <span>
            <strong>Phase actuelle (Sprint 1).</strong> Cette page sert à valider
            la qualité audio sur différentes voix et langues. Les prochaines
            étapes : (1) édition complète des leçons Tazawwud, (2) sauvegarde
            automatique dans Firebase Storage avec cache content-hash,
            (3) upload manuel des audios wolof par la commission, (4) player
            premium côté membre.
          </span>
        </p>
      </div>
    </AdminShell>
  );
}

function ProviderStatus({
  label,
  sub,
  configured,
  voiceCount,
}: {
  label: string;
  sub: string;
  configured: boolean;
  voiceCount: number;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        configured
          ? "bg-emerald-50 border-emerald-200"
          : "bg-orange-50 border-orange-200"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-sm text-[#0F7C55]">{label}</p>
        <span
          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
            configured
              ? "bg-emerald-600 text-white"
              : "bg-orange-600 text-white"
          }`}
        >
          {configured ? "Prêt" : "Non configuré"}
        </span>
      </div>
      <p className="text-xs text-gray-600">{sub}</p>
      <p className="text-[10px] text-gray-500 mt-1">
        {voiceCount} voix disponibles
      </p>
    </div>
  );
}
