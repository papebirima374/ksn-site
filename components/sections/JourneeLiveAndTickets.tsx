"use client";

import { useState, useEffect } from "react";
import { getStreamingLink } from "@/lib/admin-data";
import { FaYoutube, FaVideo } from "react-icons/fa6";

function getEmbedUrl(url: string): string {
  const defaultEmbed = "https://www.youtube.com/embed/Ea-OwQNhH0I";
  if (!url) return defaultEmbed;
  const clean = url.trim();

  // Match youtube.com/live/ID
  const liveMatch = clean.match(/(?:youtube\.com\/live\/)([a-zA-Z0-9_-]+)/);
  if (liveMatch && liveMatch[1]) return `https://www.youtube.com/embed/${liveMatch[1]}`;

  // Match youtu.be/ID
  const shortMatch = clean.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // Match embed/ID
  if (clean.includes("youtube.com/embed/")) return clean;

  // Match watch?v=ID or features like ?feature=share
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  return clean;
}

const CHAT_MESSAGES = [
  { user: "Serigne Modou", text: "MachaAllah, que la paix soit sur le Prophète ﷺ !" },
  { user: "Fatou Diop", text: "Allahoumma Salli 'Alaa Sayyidina Muhammad !" },
  { user: "Cheikh Tidiane", text: "Hâte d'être à Touba pour cette belle journée." },
  { user: "Awa Ndiaye", text: "Sallallahou 'Alaa Muhammad !" },
  { user: "Ibrahima Fall", text: "Un grand jour de dévotion et de prières collectives." },
];

export default function JourneeLiveAndTickets() {
  // Chat simulation
  const [chatList, setChatList] = useState<{ user: string; text: string }[]>(CHAT_MESSAGES.slice(0, 3));
  
  // Streaming URL state
  const [embedSrc, setEmbedSrc] = useState("https://www.youtube.com/embed/Ea-OwQNhH0I");

  // Load streaming URL on mount
  useEffect(() => {
    getStreamingLink()
      .then((url) => {
        if (url) {
          setEmbedSrc(getEmbedUrl(url));
        } else {
          setEmbedSrc("https://www.youtube.com/embed/Ea-OwQNhH0I");
        }
      })
      .catch((err) => {
        console.error("Failed to load streaming link, using fallback", err);
        setEmbedSrc("https://www.youtube.com/embed/Ea-OwQNhH0I");
      });
  }, []);

  // Chat message generation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const randomMsg = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
      setChatList((prev) => [...prev.slice(1), randomMsg]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-[#0A3D24] border border-[#D4AF37]/30 rounded-[28px] sm:rounded-[45px] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-white text-xs font-bold uppercase tracking-wider">
              Direct Officiel (Prochaine Édition)
            </span>
          </div>
          <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            26 Déc. 2026
          </span>
        </div>

        {/* YouTube Video Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedSrc}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Live badge overlay on top left */}
          <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded flex items-center gap-1 uppercase shadow-md select-none">
            <FaVideo className="text-xs" /> direct
          </div>
        </div>

        {/* Stream details & live chat simulation */}
        <div className="mt-5 space-y-4">
          <div className="bg-black/35 rounded-2xl p-4 border border-white/5">
            <h3 className="text-white font-display font-bold text-base sm:text-lg flex items-center gap-2">
              <FaYoutube className="text-red-500 text-xl" />
              Journée Salaatu &apos;Alaa Nabii en direct de Touba
            </h3>
            <p className="text-white/60 text-xs mt-1">
              La retransmission vidéo débutera le matin de l&apos;événement à 07h00 GMT. Abonnez-vous à notre chaîne officielle pour ne rater aucun live.
            </p>
          </div>

          {/* Simulatated Live Chat */}
          <div className="bg-black/25 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-3">
              Flux de prières des fidèles
            </p>
            <div className="space-y-2 h-[95px] overflow-hidden flex flex-col justify-end">
              {chatList.map((msg, i) => (
                <div key={i} className="text-xs flex items-start gap-1.5 animate-fadeIn">
                  <span className="font-bold text-[#D4AF37] min-w-[100px] text-right truncate">
                    {msg.user} :
                  </span>
                  <span className="text-white/80">{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
