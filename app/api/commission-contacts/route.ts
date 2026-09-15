// Numeros WhatsApp des responsables de commission.
//
// POURQUOI UNE ROUTE D'API ET PAS UNE CONSTANTE ?
// Tout ce qui est importe par un composant client part dans le JavaScript
// telechargeable par n'importe quel visiteur — y compris depuis une page
// d'administration, dont le bundle est servi avant toute connexion. Des
// numeros personnels n'ont donc rien a faire dans lib/. Ce fichier ne
// s'execute que sur le serveur : les numeros ne sortent qu'apres verification
// du jeton de l'appelant.
//
// Acces : administrateur, responsable du Secretariat (c'est lui qui relance
// les commissions), ou responsable des Finances (c'est elle qui verse aux
// autres commissions et doit pouvoir les prevenir). Pas les autres : un
// carnet d'adresses ne s'ouvre qu'a qui en a l'usage.

import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/server/verify-auth";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/** Numeros transmis par la Presidence, septembre 2026.
 *
 *  ATTENTION : un numero ne vaut que pour la personne a qui il appartient.
 *  Le renouvellement du bureau a change trois responsables — Organisation,
 *  Communication et Secretariat. Leurs anciens numeros avaient ete RETIRES
 *  plutot que conserves : garder un numero perime, c'est envoyer la relance
 *  du Dahira a quelqu'un qui n'est plus en charge, et croire l'avoir prevenu.
 *  La Presidence a transmis les trois nouveaux, ils sont ici.
 *
 *  Les six sont donc a jour. A la prochaine passation, on remplace la ligne
 *  concernee — ici, et nulle part ailleurs. */
const CONTACTS: Record<string, string> = {
  "education-culture": "+221 76 438 28 84", // Mame Cheikh Anta Sall
  finances: "+221 77 670 54 86", // Serigne Massamba Mbaye
  "social-developpement": "+221 76 010 09 58", // Serigne Cheikhouna Sock
  organisation: "+221 76 528 59 11", // Serigne Saliou Lô
  communication: "+221 77 335 14 14", // Modou Thiaré
  "secretariat-administratif": "+221 77 838 07 68", // El Hadji Malick Mbaye
};

/** Quand cette liste a ete arretee par la Presidence.
 *
 *  Elle est servie avec les numeros parce qu'elle tranche un conflit reel.
 *  L'ecran des rapports connait DEUX numeros pour une commission : celui-ci,
 *  et celui que le responsable a inscrit dans son dernier rapport. Sans date,
 *  impossible de savoir lequel est le plus recent — et prendre le rapport a
 *  l'aveugle, apres un renouvellement du bureau, c'est relancer le
 *  responsable SORTANT en croyant avoir prevenu le nouveau.
 *
 *  A mettre a jour en meme temps que les numeros, jamais separement. */
const MIS_A_JOUR = Date.parse("2026-09-15T00:00:00Z");

/** Libelles de commission acceptes, anciens compris (cf. lib/commissions.ts). */
const AUTORISEES = [
  "Secrétariat et Administratif",
  "Secrétariat",
  "Administratif",
  "Finances",
];

/** Lit users/<uid> via Firestore REST en passant le jeton de l'appelant : les
 *  regles Firestore s'appliquent, aucune cle de service n'est necessaire. */
async function estAutorise(req: Request): Promise<boolean> {
  const user = await verifyRequest(req);
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!user || !token || !PROJECT_ID) return false;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${user.uid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return false;
    const fields = (await res.json())?.fields ?? {};
    if (fields.role?.stringValue === "admin") return true;
    return AUTORISEES.includes(fields.commission?.stringValue ?? "");
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!(await estAutorise(req))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  return NextResponse.json(
    { contacts: CONTACTS, misAJour: MIS_A_JOUR },
    { headers: { "Cache-Control": "no-store" } }
  );
}
