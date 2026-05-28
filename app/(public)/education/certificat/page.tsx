"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaAward,
  FaCheck,
  FaPhone,
  FaWhatsapp,
  FaShare,
  FaDownload,
  FaClock,
  FaCircleXmark,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import {
  listEducationModules,
  listEducationLessons,
  createCertificationRequest,
  getCertification,
} from "@/lib/admin-data";
import type { EducationCertification } from "@/lib/admin-types";
import { loadCompletedLessonIds } from "@/lib/education/progress";
import { WHATSAPP_PHONE } from "@/lib/constants";
import IslamicPattern from "../_components/IslamicPattern";
import { generateTazawwudCertificate } from "@/lib/education/certificate-pdf";

const LOCAL_REQ_KEY = "ksn_education_cert_request_id";

export default function CertificatPage() {
  const [loading, setLoading] = useState(true);
  const [allDone, setAllDone] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [, setRequestId] = useState<string | null>(null);
  const [certification, setCertification] =
    useState<EducationCertification | null>(null);

  // formulaire
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Sénégal");
  const [availability, setAvailability] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([listEducationModules(), listEducationLessons()])
      .then(([mods, lsns]) => {
        void mods;
        const visibleLessons = lsns.filter(
          (l) => l.publishStatus !== "draft"
        );
        const completed = loadCompletedLessonIds();
        const completedInPublished = visibleLessons.filter((l) =>
          completed.includes(l.id)
        ).length;
        setCompletedCount(completedInPublished);
        setTotalCount(visibleLessons.length);
        setAllDone(
          visibleLessons.length > 0 &&
            completedInPublished === visibleLessons.length
        );

        const localId = localStorage.getItem(LOCAL_REQ_KEY);
        if (localId) {
          setRequestId(localId);
          return getCertification(localId).then((c) => {
            if (c) setCertification(c);
            else localStorage.removeItem(LOCAL_REQ_KEY);
          });
        }
      })
      .catch((err) => console.error("certif load", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Le nom complet et le téléphone sont obligatoires.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      const id = await createCertificationRequest({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        availability: availability.trim() || undefined,
        applicantLocalRef:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
      });
      localStorage.setItem(LOCAL_REQ_KEY, id);
      setRequestId(id);
      const fresh = await getCertification(id);
      setCertification(fresh);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Impossible d'envoyer la demande. Vérifiez votre connexion."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!certification) return;
    try {
      generateTazawwudCertificate(certification);
    } catch (err) {
      console.error(err);
      alert(
        (err as Error).message ||
          "Téléchargement impossible. Contactez la Commission."
      );
    }
  };

  const handleShare = async () => {
    if (!certification) return;
    const shareData = {
      title: "J'ai terminé le Tazawwud sur KSN",
      text: `Alhamdoulillah, j'ai obtenu mon certificat d'étude du Tazawwudu-ss-Sighar (Cheikh Ahmadou Bamba) auprès du Dahira KSN. N° ${certification.certificateNumber}.`,
      url: "https://salaatualaanabii.com/education",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        alert("Texte copié — collez-le sur vos réseaux.");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const whatsappMsg = useMemo(
    () =>
      encodeURIComponent(
        `Asalâmou aleykoum, j'ai déposé une demande de certificat Tazawwud sur le site KSN. Mon nom : ${fullName || "(à compléter)"}. Quand pouvez-vous me proposer un entretien oral ? Jaaza-Allahou Khayran.`
      ),
    [fullName]
  );

  if (loading) {
    return (
      <main className="edu-surface relative min-h-screen flex items-center justify-center">
        <IslamicPattern variant="hex" opacity={0.05} />
        <div className="relative text-center">
          <div className="w-10 h-10 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-4" />
          <p className="edu-prose">Chargement…</p>
        </div>
      </main>
    );
  }

  // ── 1. Pas encore 100 % de leçons → bloqué ──────────────────────────
  if (!allDone && !certification) {
    return (
      <main className="edu-surface relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
        <IslamicPattern variant="hex" opacity={0.05} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm text-[#6B2E2E] hover:text-[#064E3B] transition mb-8 font-semibold"
          >
            <FaArrowLeft /> Retour à l&apos;Académie
          </Link>
          <div className="edu-card rounded-[30px] p-8 sm:p-12 edu-book-open">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#C9A961]/15 text-[#C9A961] flex items-center justify-center text-3xl mb-4">
              <FaAward />
            </div>
            <h1 className="edu-title text-2xl sm:text-3xl font-black mb-3">
              Certificat — pas encore accessible
            </h1>
            <p className="edu-prose mb-6">
              Pour demander votre certificat, vous devez d&apos;abord valider
              les <strong>{totalCount} leçons</strong> du Tazawwudu-ss-Sighar.
            </p>
            <div className="bg-[#1A1611]/5 rounded-2xl p-4 mb-6">
              <p className="text-xs text-[#1A1611]/60 uppercase tracking-widest font-bold mb-1">
                Votre progression
              </p>
              <p className="text-2xl font-bold text-[#064E3B]">
                {completedCount} / {totalCount} leçons validées
              </p>
              <div className="h-2 bg-[#1A1611]/10 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A961] to-[#E0C97D] rounded-full transition-all duration-500"
                  style={{
                    width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Link
              href="/education"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#064E3B] to-[#2D5547] text-[#E0C97D] font-bold px-6 py-3 rounded-xl shadow-md hover:scale-[1.03] transition text-sm"
            >
              Continuer le Tazawwud
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── 2. Demande déjà déposée → afficher statut ────────────────────────
  if (certification) {
    const status = certification.status;
    return (
      <main className="edu-surface relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
        <IslamicPattern variant="hex" opacity={0.05} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm text-[#6B2E2E] hover:text-[#064E3B] transition mb-8 font-semibold"
          >
            <FaArrowLeft /> Retour à l&apos;Académie
          </Link>

          {/* CARTE BADGE "ÉTUDIANT DU TAZAWWUD" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#064E3B] via-[#2D5547] to-[#064E3B] text-[#FAF7F0] p-8 sm:p-10 mb-8 edu-book-open"
          >
            <IslamicPattern
              variant="star8"
              opacity={0.08}
              color="#E0C97D"
            />
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] flex items-center justify-center text-3xl shadow-xl mb-3">
                <FaAward />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#E0C97D] font-bold">
                Badge Officiel KSN
              </p>
              <h2 className="edu-title text-2xl sm:text-3xl font-black mt-2 !text-[#FAF7F0]">
                Étudiant(e) du Tazawwud
              </h2>
              <p className="font-arabic text-2xl text-[#E0C97D] mt-3" dir="rtl">
                طالب التزود
              </p>
              <p className="mt-4 text-sm sm:text-base text-[#FAF7F0]/90 max-w-md mx-auto">
                {certification.fullName}
              </p>
              {certification.certificateNumber && (
                <p className="mt-2 font-mono text-xs text-[#E0C97D]">
                  N° {certification.certificateNumber}
                </p>
              )}
            </div>
          </motion.div>

          {/* STATUT */}
          {status === "pending_review" && (
            <div className="edu-card rounded-[28px] p-6 sm:p-8 text-center">
              <FaClock className="text-3xl text-[#C9A961] mx-auto mb-3" />
              <h3 className="edu-title text-xl font-bold mb-2">
                Demande reçue — entretien à planifier
              </h3>
              <p className="edu-prose text-sm sm:text-base">
                Macha&apos;Allah ! Votre demande de certificat a bien été
                reçue. Un membre de la <strong>Commission Éducation</strong>{" "}
                vous contactera pour organiser un court <strong>entretien
                oral</strong> (téléphone ou présentiel). C&apos;est cette
                étape qui valide officiellement votre certificat.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <a
                  href={`tel:+${WHATSAPP_PHONE}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#064E3B] text-[#E0C97D] font-bold px-4 py-3 rounded-xl text-sm hover:scale-[1.02] transition"
                >
                  <FaPhone /> Appeler la Commission
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] font-bold px-4 py-3 rounded-xl text-sm hover:scale-[1.02] transition"
                >
                  <FaWhatsapp /> Écrire sur WhatsApp
                </a>
              </div>
              <p className="text-[11px] text-[#1A1611]/50 mt-4">
                Référence interne : {certification.id.slice(0, 8)}…
              </p>
            </div>
          )}

          {status === "scheduled" && (
            <div className="edu-card rounded-[28px] p-6 sm:p-8 text-center">
              <FaClock className="text-3xl text-[#C9A961] mx-auto mb-3" />
              <h3 className="edu-title text-xl font-bold mb-2">
                Entretien planifié
              </h3>
              <p className="edu-prose">
                Votre entretien est programmé pour le{" "}
                <strong>{certification.oralExamDate}</strong>. Préparez-vous
                à échanger sur les enseignements clés du Tazawwud.
              </p>
              {certification.examinerNotes && (
                <p className="mt-4 text-sm text-[#1A1611]/70 italic">
                  « {certification.examinerNotes} »
                </p>
              )}
            </div>
          )}

          {status === "oral_passed" && (
            <div className="edu-card rounded-[28px] p-6 sm:p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#064E3B] text-[#E0C97D] flex items-center justify-center text-2xl mb-3">
                <FaCheck />
              </div>
              <h3 className="edu-title text-xl sm:text-2xl font-black mb-2">
                Alhamdoulillah — Certificat validé !
              </h3>
              <p className="edu-prose">
                Validation orale réussie le{" "}
                <strong>{certification.oralExamDate}</strong> auprès de{" "}
                <strong>{certification.examinerName}</strong>. Vous pouvez
                télécharger votre certificat officiel en PDF.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] font-bold px-4 py-3 rounded-xl text-sm hover:scale-[1.03] shadow-lg transition"
                >
                  <FaDownload /> Télécharger mon certificat (PDF)
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 bg-[#064E3B] text-[#E0C97D] font-bold px-4 py-3 rounded-xl text-sm hover:scale-[1.02] transition"
                >
                  <FaShare /> Partager
                </button>
              </div>
            </div>
          )}

          {status === "rejected" && (
            <div className="edu-card rounded-[28px] p-6 sm:p-8 text-center border-2 border-[#6B2E2E]/30">
              <FaCircleXmark className="text-3xl text-[#6B2E2E] mx-auto mb-3" />
              <h3 className="edu-title text-xl font-bold mb-2 !text-[#6B2E2E]">
                Entretien à reprendre
              </h3>
              <p className="edu-prose">
                Quelques points du Tazawwud nécessitent une révision avant
                délivrance du certificat. La Commission vous a laissé ces
                notes :
              </p>
              {certification.examinerNotes && (
                <div className="bg-[#6B2E2E]/5 border-l-4 border-[#6B2E2E] rounded-r-2xl p-4 mt-4 text-left text-sm italic text-[#6B2E2E]">
                  « {certification.examinerNotes} »
                </div>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 bg-[#064E3B] text-[#E0C97D] font-bold px-4 py-3 rounded-xl text-sm hover:scale-[1.02] transition"
              >
                <FaWhatsapp /> Reprendre contact avec la Commission
              </a>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ── 3. Toutes les leçons validées + pas encore de demande → formulaire
  return (
    <main className="edu-surface relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
      <IslamicPattern variant="hex" opacity={0.05} />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <Link
          href="/education"
          className="inline-flex items-center gap-2 text-sm text-[#6B2E2E] hover:text-[#064E3B] transition mb-6 font-semibold"
        >
          <FaArrowLeft /> Retour à l&apos;Académie
        </Link>

        <div className="edu-card rounded-[30px] p-8 sm:p-10 edu-book-open">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] flex items-center justify-center text-3xl shadow-md mb-3">
              <FaAward />
            </div>
            <h1 className="edu-title text-2xl sm:text-3xl font-black">
              Demander mon certificat
            </h1>
            <p className="edu-prose mt-3 max-w-md mx-auto">
              Vous avez validé l&apos;intégralité du Tazawwud, Macha&apos;Allah !
              Il reste une dernière étape : un <strong>entretien oral</strong>{" "}
              avec un membre de la <strong>Commission Éducation</strong>{" "}
              (téléphone ou présentiel). C&apos;est cette validation humaine
              qui rend votre certificat officiel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex : Mouhamadou Lamine Diop"
                className="w-full rounded-xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3 text-[#1A1611] placeholder-[#1A1611]/30 text-sm outline-none transition"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  Téléphone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 …"
                  className="w-full rounded-xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3 text-[#1A1611] placeholder-[#1A1611]/30 text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  E-mail (optionnel)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full rounded-xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3 text-[#1A1611] placeholder-[#1A1611]/30 text-sm outline-none transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  Ville
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex : Touba"
                  className="w-full rounded-xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3 text-[#1A1611] placeholder-[#1A1611]/30 text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  Pays
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3 text-[#1A1611] placeholder-[#1A1611]/30 text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1.5">
                Disponibilités pour l&apos;entretien
              </label>
              <textarea
                rows={3}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Ex : du lundi au vendredi après 18h, week-ends toute la journée…"
                className="w-full rounded-xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3 text-[#1A1611] placeholder-[#1A1611]/30 text-sm outline-none transition resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-[#6B2E2E] bg-[#6B2E2E]/5 border border-[#6B2E2E]/20 rounded-xl p-3">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#064E3B] to-[#2D5547] text-[#E0C97D] hover:from-[#C9A961] hover:to-[#E0C97D] hover:text-[#064E3B] font-bold px-6 py-4 rounded-2xl shadow-lg transition disabled:opacity-50 text-sm sm:text-base mt-2"
            >
              {submitting
                ? "Envoi en cours…"
                : "Bismillah — Déposer ma demande"}
            </button>
          </form>

          <p className="text-[11px] text-[#1A1611]/50 mt-6 text-center leading-5">
            Vos informations sont transmises uniquement à la Commission
            Éducation du Dahira KSN dans le but d&apos;organiser
            l&apos;entretien oral.
            <br />
            Une copie de référence sera conservée pour valider votre
            certificat.
          </p>
        </div>
      </div>
    </main>
  );
}
