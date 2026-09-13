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
// Acces : administrateur, ou responsable du Secretariat (c'est lui qui
// relance les commissions).

import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/server/verify-auth";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/** Numeros transmis par la Presidence (septembre 2026). */
const CONTACTS: Record<string, string> = {
  "education-culture": "+221 76 438 28 84",
  finances: "+221 77 670 54 86",
  "social-developpement": "+221 76 010 09 58",
  organisation: "+221 76 528 59 11",
  communication: "+221 77 335 14 14",
  "secretariat-administratif": "+221 77 838 07 68",
};

/** Libelles de commission acceptes pour le Secretariat, anciens compris. */
const SECRETARIAT = ["Secrétariat et Administratif", "Secrétariat", "Administratif"];

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
    return SECRETARIAT.includes(fields.commission?.stringValue ?? "");
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!(await estAutorise(req))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  return NextResponse.json(
    { contacts: CONTACTS },
    { headers: { "Cache-Control": "no-store" } }
  );
}
