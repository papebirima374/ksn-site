"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCircleCheck, FaCircleXmark, FaUser, FaClock, FaArrowLeft } from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import { getMemberByMatricule } from "@/lib/admin-data";
import { Member } from "@/lib/admin-types";

export default function VerifierCartePage() {
  const params = useParams<{ matricule: string }>();
  const matricule = params?.matricule ? decodeURIComponent(params.matricule) : "";
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      if (!matricule) {
        setLoading(false);
        setError("Matricule manquant dans la requête.");
        return;
      }

      getMemberByMatricule(matricule)
        .then((m) => {
          if (!m) {
            setError("Cette carte ne correspond à aucun membre officiel enregistré.");
          } else {
            setMember(m);
          }
        })
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Erreur de connexion avec la base de données.");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [matricule]);

  return (
    <>
      <PageHero
        overline="Sécurité & Authenticité"
        title="Vérification de Carte"
        arabic="التحقق من العضوية"
        description="Scannez ou vérifiez le statut d'authenticité de la carte de membre officielle du Dahira KSN en temps réel."
      />

      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 -mt-16 sm:-mt-24">
        <div className="bg-white rounded-[32px] shadow-2xl p-6 sm:p-10 border border-gray-100 space-y-8 text-center">
          
          {loading ? (
            <div className="py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-[#0F7C55] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 text-sm font-semibold">Vérification de la signature numérique...</p>
            </div>
          ) : error ? (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-600 text-4xl shadow-sm">
                <FaCircleXmark />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-[#0F5132]">
                  Carte Non Validée
                </h2>
                <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
                  {error}
                </p>
              </div>
              
              <div className="bg-red-50/50 rounded-2xl p-5 border border-red-100 text-left space-y-3">
                <h4 className="font-display font-bold text-red-800 text-sm">
                  Que faire ?
                </h4>
                <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Assurez-vous que l&apos;URL scannée est correcte et n&apos;a pas été altérée.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Pour les membres en attente, le paiement de la cotisation de 1000 FCFA doit être fait pour activer le profil.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : member ? (
            <div className="space-y-8">
              {/* STATUS BADGE BOX */}
              {member.status === "actif" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-md shadow-emerald-600/10">
                    <FaCircleCheck />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-emerald-800">
                      Carte Membre Actif
                    </h3>
                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-1">
                      Statut: Authentique & Validée ✓
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-center flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md shadow-amber-500/10">
                    <FaClock className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-amber-800">
                      Adhésion En Attente
                    </h3>
                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mt-1">
                      Statut: Validation Admin Requise
                    </p>
                  </div>
                </div>
              )}

              {/* CARD DETAILS */}
              <div className="border border-gray-100 rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#F8F5EF]/40 to-white text-left grid sm:grid-cols-[100px_1fr] gap-5 items-start">
                {/* Photo */}
                <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-gray-100 shadow-sm mx-auto sm:mx-0 border border-[#0F7C55]/15 flex-shrink-0">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.prenom} ${member.nom}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                      unoptimized={member.photo.startsWith("http")}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-2xl">
                      <FaUser />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#0F7C55]/60 leading-none">
                      Identité de l&apos;adhérent
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55] mt-1 leading-tight">
                      {member.prenom} {member.nom}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 leading-none">
                        Matricule
                      </span>
                      <span className="block font-mono font-black text-sm text-[#0F7C55] mt-1">
                        {member.matricule}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 leading-none">
                        Domicile
                      </span>
                      <span className="block font-semibold text-[#0F7C55] mt-1 truncate">
                        {[member.ville, member.region].filter(Boolean).join(", ") || "—"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 leading-none">
                        Téléphone
                      </span>
                      <span className="block font-semibold text-[#0F7C55] mt-1">
                        {member.telephone || "—"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 leading-none">
                        Date d&apos;adhésion
                      </span>
                      <span className="block font-semibold text-[#0F7C55] mt-1">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* BACK TO HOME LINK */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#0F7C55] hover:text-[#B8860B] text-sm font-bold transition"
            >
              <FaArrowLeft /> Retour à l&apos;accueil KSN
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
