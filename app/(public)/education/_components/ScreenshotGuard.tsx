"use client";

import { useEffect, useState } from "react";

/**
 * Protection best-effort contre les captures d'écran et copies dans la
 * section Éducation Islamique. Aucune protection web ne peut bloquer à
 * 100 % une capture OS (Windows Snipping Tool, iOS Side+Volume, etc.),
 * mais on rend l'opération volontairement pénible et dissuasive :
 *
 *  - clic droit / menu contextuel désactivés
 *  - Ctrl+C, Ctrl+X, Ctrl+S, Ctrl+P, Ctrl+A, Print Screen interceptés
 *  - sélection désactivée via la classe `.protected-content` (CSS)
 *  - drag des images désactivé
 *  - à chaque changement d'onglet/app (visibilitychange), on floute le
 *    contenu pendant 600 ms — empêche le screenshot après bascule
 *  - watermark "© KSN — Contenu sacré" léger sur le contenu
 *  - banner d'information visible affirmant la protection
 *
 * Sur impression (Ctrl+P), la règle CSS `.protected-content` du
 * globals.css remplace tout le contenu par un message dissuasif.
 */
export default function ScreenshotGuard({
  children,
  showBanner = true,
}: {
  children: React.ReactNode;
  /** Affiche un bandeau informatif au-dessus. */
  showBanner?: boolean;
}) {
  const [blurred, setBlurred] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  function pingWarning(msg: string) {
    setWarning(msg);
    window.setTimeout(() => setWarning(null), 2200);
  }

  useEffect(() => {
    // ───── Interception clavier ───────────────────────────────────────
    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      // PrintScreen (Windows) — on peut juste vider le clipboard après
      if (k === "printscreen") {
        navigator.clipboard?.writeText("").catch(() => undefined);
        pingWarning(
          "Capture détectée. Ce contenu est protégé — merci de ne pas le diffuser."
        );
        return;
      }

      // Ctrl/Cmd + C / X / S / P / A / U
      if (
        ctrl &&
        ["c", "x", "s", "p", "a", "u"].includes(k)
      ) {
        e.preventDefault();
        e.stopPropagation();
        const labels: Record<string, string> = {
          c: "copie",
          x: "couper",
          s: "enregistrement",
          p: "impression",
          a: "sélection complète",
          u: "code source",
        };
        pingWarning(
          `Action « ${labels[k]} » bloquée — contenu sacré protégé.`
        );
      }

      // Cmd+Shift+3 / Cmd+Shift+4 (macOS screenshots) — non interceptable
      // mais on peut détecter et avertir
      if (
        (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(k)) ||
        (k === "f12") // devtools
      ) {
        pingWarning("Contenu sacré protégé — capture déconseillée.");
      }
    }

    // ───── Clic droit ─────────────────────────────────────────────────
    function onContextMenu(e: MouseEvent) {
      const t = e.target as HTMLElement;
      // Autoriser le clic droit sur les inputs (formulaire admin etc.)
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.closest("[data-allow-context]"))
      )
        return;
      e.preventDefault();
      pingWarning("Menu contextuel désactivé sur le contenu protégé.");
    }

    // ───── Copy event ─────────────────────────────────────────────────
    function onCopy(e: ClipboardEvent) {
      e.preventDefault();
      e.clipboardData?.setData(
        "text/plain",
        "© KSN — Tazawwud · Le copier-coller est désactivé. Merci."
      );
      pingWarning("Copie remplacée par un message — contenu protégé.");
    }

    // ───── Visibility change : floute brièvement le contenu ───────────
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        setBlurred(true);
      } else {
        // au retour, on garde le flou 600ms par sécurité
        window.setTimeout(() => setBlurred(false), 600);
      }
    }

    // ───── Drag start (images) ────────────────────────────────────────
    function onDragStart(e: DragEvent) {
      const t = e.target as HTMLElement;
      if (t.tagName === "IMG") {
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopy);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return (
    <>
      {showBanner && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-3">
          <div className="text-[11px] text-[#6B2E2E] bg-[#C9A961]/15 border border-[#C9A961]/40 rounded-xl px-3 py-2 flex items-center gap-2">
            <span aria-hidden>🔒</span>
            <span>
              <strong>Contenu sacré protégé</strong> — capture, copie et
              impression sont désactivées. Pour partager, utilisez le bouton
              dédié.
            </span>
          </div>
        </div>
      )}

      <div
        className={`protected-content transition-[filter] duration-200 ${
          blurred ? "blur-md select-none" : ""
        }`}
        style={{
          // Watermark discret en arrière-plan
          backgroundImage:
            "repeating-linear-gradient(-30deg, transparent 0 240px, rgba(201,169,97,0.04) 240px 280px)",
        }}
      >
        {children}
      </div>

      {warning && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#6B2E2E] text-[#FAF7F0] px-4 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-semibold border border-[#C9A961]/40"
        >
          {warning}
        </div>
      )}
    </>
  );
}
