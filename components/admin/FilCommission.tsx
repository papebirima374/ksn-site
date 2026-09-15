"use client";

import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaTrash, FaComments } from "react-icons/fa6";
import {
  type Message,
  MAX_MESSAGE,
  subscribeFil,
  envoyerMessage,
  supprimerMessage,
} from "@/lib/commission-fil";
// « Message » est deja pris ici : c'est le type d'un message du fil de
// la commission. Le bandeau prend donc un autre nom.
import { Message as Bandeau } from "./Etats";
import { messageEcriture } from "@/lib/message-erreur";

const ETIQUETTE: Record<string, { nom: string; classe: string }> = {
  presidence: { nom: "Présidence", classe: "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#7A5E0B]" },
  secretariat: { nom: "Secrétariat", classe: "bg-[#0F7C55]/10 border-[#0F7C55]/30 text-[#0F7C55]" },
  commission: { nom: "Commission", classe: "bg-[#F8F5EF] border-[#0F7C55]/12 text-[#5C7268]" },
};

function quand(ts: number): string {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Fil d'echanges d'une commission avec le Secretariat et la Presidence.
 *  L'assemblee passee, c'est ce fil qui fait la continuite : le dossier reste
 *  la, et la conversation autour continue. */
export default function FilCommission({
  slug,
  auteur,
  role,
  peutSupprimer = false,
  pret,
}: {
  slug: string;
  auteur: string;
  role: string;
  peutSupprimer?: boolean;
  /** Session restauree : tant que c'est faux, on n'interroge pas Firestore. */
  pret: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [texte, setTexte] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const bas = useRef<HTMLDivElement>(null);

  // `pret` vaut faux tant que la session n'est pas restauree : sans jeton, la
  // requete part refusee et l'ecouteur ne repart jamais.
  useEffect(() => {
    if (!pret) return;
    return subscribeFil(slug, setMessages, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès au fil refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Fil indisponible pour le moment."
      )
    );
  }, [slug, pret]);

  useEffect(() => {
    bas.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!texte.trim()) return;
    setEnvoi(true);
    try {
      await envoyerMessage(slug, auteur, role, texte);
      setTexte("");
      setErreur("");
    } catch {
      setErreur(messageEcriture(e, "l'envoi du message"));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <FaComments className="text-[#0F7C55]" />
        <h2 className="font-bold text-[#082F22]">Échanges avec le Secrétariat</h2>
        <span className="flex-1 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
      </div>

      <p className="-mt-2 mb-5 text-sm text-[#5C7268] leading-6">
        Cet espace reste ouvert après l&apos;assemblée : posez vos questions, signalez
        l&apos;avancement, répondez au Secrétariat. Seuls votre commission, le Secrétariat
        et la Présidence voient ce fil.
      </p>

      {erreur && (
        <Bandeau ton="erreur" className="mb-4">{erreur}</Bandeau>
      )}

      <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-[#9BB0A6] italic py-4">
            Aucun message pour l&apos;instant.
          </p>
        ) : (
          messages.map((m) => {
            const et = ETIQUETTE[m.role] ?? ETIQUETTE.commission;
            return (
              <article key={m.id} className={`rounded-xl border px-4 py-3 ${et.classe}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs font-bold">
                    {m.auteur || "—"}
                    <span className="font-semibold opacity-70"> · {et.nom}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] opacity-60">{quand(m.createdAt)}</span>
                    {peutSupprimer && (
                      <button
                        onClick={async () => {
                          if (!confirm("Supprimer ce message ?")) return;
                          await supprimerMessage(m.id);
                        }}
                        aria-label="Supprimer ce message"
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-[#12231C] leading-6 whitespace-pre-wrap">
                  {m.texte}
                </p>
              </article>
            );
          })
        )}
        <div ref={bas} />
      </div>

      <form onSubmit={envoyer} className="mt-4 flex items-end gap-2">
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          maxLength={MAX_MESSAGE}
          rows={2}
          placeholder="Écrire un message…"
          className="flex-1 rounded-xl border border-[#0F7C55]/25 px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition resize-y"
        />
        <button
          type="submit"
          disabled={envoi || !texte.trim()}
          aria-label="Envoyer"
          className="flex-none h-11 px-5 rounded-xl bg-[#0F7C55] text-white font-bold hover:bg-[#0c6444] transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          <FaPaperPlane /> Envoyer
        </button>
      </form>
    </section>
  );
}
