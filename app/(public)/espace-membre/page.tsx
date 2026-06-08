import { redirect } from "next/navigation";

// L'accès aux comptes (connexion + inscription) est désormais fermé sur le
// site. Toute demande d'adhésion passe par WhatsApp via la page /inscription.
export default function EspaceMembrePage() {
  redirect("/inscription");
}
