"use client";

import { useState, useEffect, FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { getStreamingLink } from "@/lib/admin-data";
import { FaYoutube, FaTicket, FaCheck, FaLocationDot, FaUsers, FaArrowRight, FaVideo } from "react-icons/fa6";

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

  // Form states
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [typeParticipation, setTypeParticipation] = useState("physique");
  const [accompagnants, setAccompagnants] = useState("0");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  // Chat message generation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const randomMsg = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
      setChatList((prev) => [...prev.slice(1), randomMsg]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const db = getDb();
      const generatedTicket = "KSN-" + Math.floor(100000 + Math.random() * 900000);
      
      await addDoc(collection(db, "event_registrations"), {
        prenom,
        nom,
        email,
        tel,
        typeParticipation,
        accompagnants: parseInt(accompagnants, 10),
        ticketNumber: generatedTicket,
        createdAt: Date.now(),
      });

      setTicketNumber(generatedTicket);
      setSuccess(true);
    } catch (err) {
      console.error("Error saving event registration:", err);
      setError("Une erreur est survenue lors de votre inscription. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LIVE STREAM PLAYER */}
        <div className="lg:col-span-7 bg-[#0A3D24] border border-[#D4AF37]/30 rounded-[28px] sm:rounded-[45px] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
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

        {/* RIGHT COLUMN: TICKETING / INSCRIPTION */}
        <div className="lg:col-span-5 bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10 border border-[#E9E3D5] relative overflow-hidden flex flex-col justify-between min-h-[580px]">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#0F7C55]/5 rounded-full blur-3xl pointer-events-none" />

          {!success ? (
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 bg-[#0F7C55]/10 border border-[#0F7C55]/20 text-[#0F7C55] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <FaTicket className="text-xs" /> Billetterie Gratuite
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0F7C55]">
                  Réserver un billet
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
                  Inscrivez-vous pour valider votre présence physique ou recevoir vos accès direct exclusifs et votre ticket souvenir.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl mb-4 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Prénom"
                    className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                  />
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom"
                    className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                  />
                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse email"
                  className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                />

                <input
                  type="tel"
                  required
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="Téléphone (ex: +221...)"
                  className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                />

                {/* Participation mode */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1.5">
                    Mode de participation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTypeParticipation("physique")}
                      className={`rounded-xl p-3 border text-center flex flex-col items-center justify-center gap-1 transition ${
                        typeParticipation === "physique"
                          ? "border-[#0F7C55] bg-[#0F7C55]/5 text-[#0F7C55]"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <FaLocationDot className="text-sm" />
                      <span className="text-[11px] font-bold">À Touba</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTypeParticipation("distance")}
                      className={`rounded-xl p-3 border text-center flex flex-col items-center justify-center gap-1 transition ${
                        typeParticipation === "distance"
                          ? "border-[#0F7C55] bg-[#0F7C55]/5 text-[#0F7C55]"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <FaUsers className="text-sm" />
                      <span className="text-[11px] font-bold">À distance</span>
                    </button>
                  </div>
                </div>

                {/* Accompanists for physical participation */}
                {typeParticipation === "physique" && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1.5 mb-1.5">
                      Nombre d&apos;accompagnants
                    </label>
                    <select
                      value={accompagnants}
                      onChange={(e) => setAccompagnants(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                    >
                      <option value="0">Aucun accompagnant (Je viens seul)</option>
                      <option value="1">1 accompagnant</option>
                      <option value="2">2 accompagnants</option>
                      <option value="3">3 accompagnants</option>
                      <option value="4">4+ accompagnants</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] hover:opacity-95 text-xs sm:text-sm font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition disabled:opacity-75"
                >
                  {submitting ? "Traitement en cours..." : "Réserver mon ticket gratuit"}
                  {!submitting && <FaArrowRight />}
                </button>
              </form>
            </div>
          ) : (
            // Success ticket rendering
            <div className="flex flex-col items-center justify-center py-6 text-center animate-scaleUp">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-600 text-2xl mb-4">
                <FaCheck />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F7C55]">
                Votre ticket est validé !
              </h3>
              <p className="text-gray-500 text-xs mt-1 px-4">
                Merci {prenom}. Votre réservation a été enregistrée avec succès. Vous recevrez une confirmation par e-mail.
              </p>

              {/* Graphical Ticket Card */}
              <div className="mt-8 w-full max-w-[280px] bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] border border-[#D4AF37]/40 rounded-2xl p-5 text-white relative shadow-xl overflow-hidden">
                {/* Decorative tickets holes */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-white border border-gray-200 -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white border border-gray-200 -translate-y-1/2" />
                
                <div className="text-center border-b border-white/10 pb-4 mb-4">
                  <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    Dahira KSN International
                  </p>
                  <h4 className="font-display text-sm font-bold text-white mt-1">
                    Journée Salaatu &apos;Alaa Nabii
                  </h4>
                </div>

                <div className="space-y-2 text-left text-[11px] px-2">
                  <div className="flex justify-between">
                    <span className="opacity-75">Nom :</span>
                    <span className="font-bold text-[#D4AF37]">{prenom} {nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Participation :</span>
                    <span className="font-bold text-white">
                      {typeParticipation === "physique" ? "À Touba" : "À distance"}
                    </span>
                  </div>
                  {typeParticipation === "physique" && (
                    <div className="flex justify-between">
                      <span className="opacity-75">Invités :</span>
                      <span className="font-bold text-white">+{accompagnants}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="opacity-75">Date :</span>
                    <span className="font-bold text-white">26 Décembre 2026</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/20 mt-4 pt-4 text-center">
                  <p className="text-[10px] opacity-75 font-semibold">TICKET N°</p>
                  <p className="font-display font-black text-base text-[#D4AF37] tracking-wider mt-0.5 select-all">
                    {ticketNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSuccess(false)}
                className="mt-8 text-xs text-gray-500 font-bold hover:underline"
              >
                Réserver un autre ticket
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
