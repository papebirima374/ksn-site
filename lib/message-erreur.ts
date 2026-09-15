// Traduire un echec en quelque chose qu'on peut lire — et sur quoi on peut agir.
//
// POURQUOI. Les ecrans de commission annonçaient TOUTE ecriture ratee de la
// meme facon : « … impossible. Verifiez votre connexion. » Quelle qu'en soit
// la cause. Un refus de permission, une regle Firestore qui rejette la forme
// du document, un quota depasse : tout devenait un probleme de reseau.
//
// Le responsable verifiait donc sa connexion, la trouvait bonne, et repartait
// en pensant que ca finirait par passer. C'est ainsi qu'une annulation de
// caisse a pu ne jamais avoir lieu sans que personne ne comprenne pourquoi.
//
// Les lectures, elles, distinguaient deja le refus de permission. Les
// ecritures ne le faisaient pas. Elles le font maintenant, au meme endroit.

/** Code d'erreur Firebase, quand il y en a un. */
function code(e: unknown): string {
  if (typeof e === "object" && e !== null && "code" in e) {
    return String((e as { code: unknown }).code);
  }
  return "";
}

/** Message affichable pour un echec d'ECRITURE.
 *
 *  @param action ce qu'on tentait, a la forme nominale : « l'annulation »,
 *                « l'enregistrement », « l'ajout du membre ».
 */
export function messageEcriture(e: unknown, action: string): string {
  const c = code(e).replace(/^[a-z]+\//, ""); // « firestore/permission-denied » → « permission-denied »

  switch (c) {
    case "permission-denied":
      return `${action} a été REFUSÉE par la base. Ce compte n'a pas le droit d'écrire ici, ou les règles Firestore publiées ne sont pas à jour. Rien n'a été enregistré.`;
    case "unauthenticated":
      return `Votre session a expiré. Reconnectez-vous, puis recommencez : ${action} n'a pas eu lieu.`;
    case "unavailable":
    case "deadline-exceeded":
      return `La base n'a pas répondu. Vérifiez votre connexion, puis recommencez : ${action} n'a pas eu lieu.`;
    case "resource-exhausted":
      return `Le quota de la base est atteint. ${action[0].toUpperCase()}${action.slice(1)} n'a pas eu lieu ; réessayez plus tard.`;
    case "invalid-argument":
    case "failed-precondition":
      return `La base a refusé la forme de cette écriture. ${action[0].toUpperCase()}${action.slice(1)} n'a pas eu lieu — signalez-le, c'est un défaut du site.`;
    case "not-found":
      return `L'élément visé n'existe plus. Rechargez la page : ${action} n'a pas eu lieu.`;
    default:
      // On n'invente pas une cause : on dit ce qui est sûr, et on donne le
      // detail technique a recopier.
      return `${action[0].toUpperCase()}${action.slice(1)} n'a PAS eu lieu${
        c ? ` (${c})` : ""
      }. Réessayez ; si cela se reproduit, signalez ce message.`;
  }
}

/** Message affichable pour un echec de LECTURE. */
export function messageLecture(e: unknown, quoi: string): string {
  const c = code(e).replace(/^[a-z]+\//, "");
  if (c === "permission-denied") {
    return `Accès refusé à ${quoi}. Ce compte n'a pas le droit de les lire, ou les règles Firestore publiées ne sont pas à jour.`;
  }
  if (c === "unauthenticated") {
    return `Votre session a expiré. Reconnectez-vous pour voir ${quoi}.`;
  }
  return `${quoi[0].toUpperCase()}${quoi.slice(1)} : lecture impossible pour le moment${c ? ` (${c})` : ""}.`;
}
