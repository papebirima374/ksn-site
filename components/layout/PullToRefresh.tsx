"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowRotateRight } from "react-icons/fa6";

/** Tirer-pour-actualiser (mobile).
 *  Quand l'utilisateur est tout en haut de la page et tire vers le bas
 *  au-delà d'un seuil, on recharge la page. */
const THRESHOLD = 80; // px à tirer pour déclencher
const MAX_PULL = 120; // distance visuelle max

export default function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const active = useRef(false);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      // N'arme le geste que si on est tout en haut de la page
      if (window.scrollY <= 0 && e.touches.length === 1) {
        startY.current = e.touches[0].clientY;
        active.current = true;
      } else {
        active.current = false;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!active.current || startY.current === null || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        // Résistance : on amortit la distance tirée
        const damped = Math.min(MAX_PULL, delta * 0.5);
        setPull(damped);
      }
    }

    function onTouchEnd() {
      if (!active.current) return;
      active.current = false;
      startY.current = null;
      if (pull >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setPull(THRESHOLD);
        setTimeout(() => window.location.reload(), 300);
      } else {
        setPull(0);
      }
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pull, refreshing]);

  const triggered = pull >= THRESHOLD;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] flex justify-center pointer-events-none"
      style={{
        transform: `translateY(${pull - 50}px)`,
        opacity: pull > 0 ? 1 : 0,
        transition: active.current ? "none" : "transform 0.25s ease, opacity 0.25s ease",
      }}
    >
      <div className="mt-2 w-11 h-11 rounded-full bg-[#0A3D24] border border-[#D4AF37]/40 shadow-xl flex items-center justify-center text-[#D4AF37]">
        {refreshing ? (
          <FaArrowRotateRight className="animate-spin text-base" />
        ) : triggered ? (
          <FaArrowRotateRight className="text-base" />
        ) : (
          <FaArrowDown
            className="text-base transition-transform"
            style={{ transform: `rotate(${Math.min(180, (pull / THRESHOLD) * 180)}deg)` }}
          />
        )}
      </div>
    </div>
  );
}
