"use client";

import { useEffect, useState } from "react";

type ProtectionState = {
  hidden: boolean; // overlay the content when true
  reason: string;
};

/**
 * Best-effort screen capture / screenshot deterrence. Browsers cannot
 * actually block OS-level screenshots, but we can:
 * - Hide the content when the tab is not visible
 * - Hide it when the window loses focus (most screenshot tools steal focus
 *   to draw a selection rectangle — macOS Cmd+Shift+4/5, Win Win+Shift+S,
 *   and the macOS Screenshot.app all fire window.blur)
 * - Block Print Screen / Cmd+Shift+3-5 / Ctrl+Shift+S key combos
 * - Block right-click and copy
 */
export function useProtectionShield(enabled: boolean): ProtectionState {
  const [state, setState] = useState<ProtectionState>({
    hidden: false,
    reason: "",
  });

  useEffect(() => {
    if (!enabled) return;

    function reveal() {
      setState({ hidden: false, reason: "" });
    }
    function hideForBlur() {
      setState({
        hidden: true,
        reason:
          "Contenu masqué. Recliquez sur la page pour réafficher la bibliothèque.",
      });
    }
    function hideForVisibility() {
      setState({
        hidden: true,
        reason: "Contenu masqué — fenêtre en arrière-plan.",
      });
    }

    function onVisibility() {
      if (document.hidden) hideForVisibility();
      else reveal();
    }
    function onBlur() {
      hideForBlur();
    }
    function onFocus() {
      reveal();
    }

    function onKey(e: KeyboardEvent) {
      const k = e.key;
      // Print Screen (Windows) — Chrome/Firefox cannot prevent the OS
      // screenshot but we can still hide the content and warn.
      if (k === "PrintScreen") {
        setState({
          hidden: true,
          reason: "Capture détectée. Contenu masqué.",
        });
        setTimeout(reveal, 1500);
        return;
      }
      // macOS Cmd+Shift+3 (full screen) / 4 (selection) / 5 (toolbar)
      if (e.metaKey && e.shiftKey && /^[3-5]$/.test(k)) {
        e.preventDefault();
        setState({
          hidden: true,
          reason: "Capture détectée. Contenu masqué.",
        });
        setTimeout(reveal, 1500);
        return;
      }
      // Windows Win+Shift+S — we don't get the Win key reliably but the
      // Snipping Tool blurs the window which our blur handler catches.
      // Ctrl+Shift+S (some browsers' save shortcut)
      if (e.ctrlKey && e.shiftKey && (k === "s" || k === "S")) {
        e.preventDefault();
      }
      // Block Ctrl+P / Cmd+P print
      if ((e.ctrlKey || e.metaKey) && (k === "p" || k === "P")) {
        e.preventDefault();
        setState({
          hidden: true,
          reason: "Impression désactivée pour ce contenu.",
        });
        setTimeout(reveal, 1500);
      }
      // Block Ctrl+C / Cmd+C inside protected zones (we also use onCopy on
      // the wrapper, but the keydown catches more edge cases)
      if ((e.ctrlKey || e.metaKey) && (k === "c" || k === "C")) {
        // Don't override globally — only when the user is inside the
        // protected wrapper (handled via React onCopy too).
      }
    }

    function onCopy(e: ClipboardEvent) {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", "Contenu protégé KSN");
    }
    function onContext(e: Event) {
      e.preventDefault();
    }
    function onSelectionChange() {
      window.getSelection()?.removeAllRanges();
    }
    function onDragStart(e: Event) {
      e.preventDefault();
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("keydown", onKey);
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, [enabled]);

  return state;
}
