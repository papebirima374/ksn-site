// Les trois etats que tout ecran d'administration doit savoir montrer :
// il travaille, quelque chose a rate, il n'y a rien a voir.
//
// POURQUOI LES METTRE EN COMMUN. Les vingt-quatre ecrans de l'espace ont ete
// ecrits a des moments differents, et chacun a refait ces trois choses a sa
// facon. Un releve du code a trouve QUATRE mises en forme distinctes pour le
// meme bandeau d'erreur, quatre pour le meme bandeau de succes, et
// « Chargement… » ecrit vingt-et-une fois a la main. Rien de casse — mais un
// espace qui ne se ressemble pas d'un ecran a l'autre donne l'impression de
// plusieurs outils bricoles ensemble, et c'est exactement ce qu'on reproche.
//
// Ces composants ne changent PAS le comportement : ils disent la meme chose,
// de la meme maniere, partout.

import type { ReactNode } from "react";
import {
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleInfo,
  FaInbox,
} from "react-icons/fa6";

type Ton = "erreur" | "succes" | "info";

const HABILLAGE: Record<Ton, { boite: string; icone: ReactNode }> = {
  erreur: {
    boite: "border-red-200 bg-red-50 text-red-800",
    icone: <FaTriangleExclamation />,
  },
  succes: {
    boite: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icone: <FaCircleCheck />,
  },
  info: {
    boite: "border-[#D4AF37]/40 bg-[#F8F5EF] text-[#082F22]",
    icone: <FaCircleInfo />,
  },
};

/** Un bandeau de message. Ne rend rien quand il n'y a rien a dire, pour
 *  s'ecrire `<Message ton="erreur">{erreur}</Message>` sans condition autour. */
export function Message({
  ton,
  children,
  className = "",
}: {
  ton: Ton;
  children?: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  const { boite, icone } = HABILLAGE[ton];
  return (
    <div
      role={ton === "erreur" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${boite} ${className}`}
    >
      <span className="mt-0.5 shrink-0">{icone}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

/** L'ecran travaille. Le texte par defaut convient presque toujours ; le
 *  preciser aide quand l'attente est longue (« Chargement des membres… »). */
export function Chargement({
  texte = "Chargement…",
  className = "",
}: {
  texte?: string;
  className?: string;
}) {
  return (
    <p role="status" className={`py-10 text-center text-sm text-gray-500 ${className}`}>
      <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-[#0F7C55] align-[-2px]" />
      {texte}
    </p>
  );
}

/** Il n'y a rien a voir — et on dit POURQUOI, sinon le vide se confond avec
 *  une panne. C'est la difference entre « aucun membre » et « la liste n'a pas
 *  pu etre lue », que plusieurs ecrans ne faisaient pas. */
export function Vide({
  titre,
  texte,
  icone,
  action,
}: {
  titre: string;
  texte?: string;
  icone?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <span className="mx-auto mb-3 block text-3xl text-[#D4AF37]">
        {icone ?? <FaInbox className="mx-auto" />}
      </span>
      <p className="font-semibold text-[#082F22]">{titre}</p>
      {texte && <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{texte}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
