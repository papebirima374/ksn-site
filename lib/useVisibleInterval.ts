"use client";

import { useEffect, useRef } from "react";

/** setInterval qui ne tourne que lorsque le tab est visible.
 *  Economie batterie + CPU sur mobile, surtout pour les compteurs live
 *  (Salaatu, Journee, Challenge) qui mettaient l'iPhone en chauffe. */
export function useVisibleInterval(fn: () => void, ms: number) {
  const cb = useRef(fn);
  cb.current = fn;

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      stop();
      id = setInterval(() => cb.current(), ms);
    };
    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };
    const onVis = () => {
      if (document.visibilityState === "visible") {
        // Tick immediat au retour pour rattraper le delta
        cb.current();
        start();
      } else {
        stop();
      }
    };

    if (typeof document !== "undefined") {
      if (document.visibilityState === "visible") start();
      document.addEventListener("visibilitychange", onVis);
    }

    return () => {
      stop();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVis);
      }
    };
  }, [ms]);
}
