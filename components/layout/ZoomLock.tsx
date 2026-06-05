"use client";

import { useEffect } from "react";

/**
 * Verrouille le zoom sur mobile pour un rendu « application ».
 *
 * Complète :
 *  - le viewport (`maximum-scale=1, user-scalable=no`) → respecté en PWA installée ;
 *  - `touch-action: manipulation` (globals.css) → supprime le double-tap zoom.
 *
 * Ici on bloque le pincer-zoomer iOS via les évènements propriétaires `gesture*`
 * (ignorés par le viewport dans Safari). Ces évènements ne sont PAS liés au
 * défilement → aucun impact sur la performance du scroll.
 */
export default function ZoomLock() {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", prevent);
    document.addEventListener("gesturechange", prevent);
    document.addEventListener("gestureend", prevent);
    return () => {
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
    };
  }, []);

  return null;
}
