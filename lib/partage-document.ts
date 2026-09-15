// Envoyer un document du Dahira sur WhatsApp, en piece jointe.
//
// CE QUE WHATSAPP PERMET, ET CE QU'IL NE PERMET PAS.
// Un lien « wa.me » ne transporte que du TEXTE. Aucun site, quel qu'il soit,
// ne peut joindre un fichier a une conversation WhatsApp par un simple lien :
// ni nous, ni personne. Il n'y a donc que deux chemins honnetes :
//
//   1. Le PARTAGE DU SYSTEME (navigator.share). Sur telephone, il ouvre la
//      feuille de partage d'Android ou d'iOS avec le PDF reellement attache :
//      on choisit WhatsApp, on choisit le destinataire, c'est parti. C'est le
//      chemin normal, et c'est la ou le President lit ses documents.
//
//   2. LE TELECHARGEMENT, puis la conversation ouverte a cote. Sur ordinateur,
//      aucun navigateur ne sait attacher un fichier a WhatsApp Web : on
//      enregistre le PDF et on ouvre WhatsApp, il reste un geste — glisser le
//      fichier dans la conversation.
//
// La fonction dit LEQUEL des deux a eu lieu, pour que l'ecran puisse
// l'annoncer au lieu de laisser croire que c'est parti tout seul.
//
// COMMENT LE PDF EST FABRIQUE.
// On reutilise exactement le HTML de lib/impression.ts — le meme document que
// celui qui sort de l'imprimante, avec la meme en-tete officielle. Il est
// rendu dans un cadre invisible, puis chaque feuille `.page` est photographiee
// et posee sur une page A4. Une seule source de verite : si l'en-tete change,
// elle change aux deux endroits a la fois.

import type jsPDF from "jspdf";

/** Ce qui s'est reellement passe. A annoncer a l'utilisateur tel quel. */
export type Issue =
  | "partage" // la feuille de partage s'est ouverte, le PDF y etait attache
  | "telecharge"; // le PDF a ete enregistre, WhatsApp ouvert a cote

const A4_L = 210;
const A4_H = 297;

/** Laisse le navigateur peindre le cadre avant qu'on le photographie. */
const unTour = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/** Rend le document dans un cadre invisible et renvoie ses feuilles.
 *  Le cadre est retire par la fonction de nettoyage, quoi qu'il arrive. */
async function rendre(html: string): Promise<{ pages: HTMLElement[]; nettoyer: () => void }> {
  const cadre = document.createElement("iframe");
  // Hors de l'ecran plutot que display:none : un element masque n'a pas de
  // dimensions, et html2canvas ne photographie alors qu'un rectangle vide.
  cadre.setAttribute("aria-hidden", "true");
  cadre.style.cssText =
    "position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;visibility:hidden";
  document.body.appendChild(cadre);
  const nettoyer = () => cadre.remove();

  const doc = cadre.contentDocument;
  if (!doc) {
    nettoyer();
    throw new Error("Le cadre de rendu n'a pas pu être créé.");
  }
  doc.open();
  doc.write(html);
  doc.close();

  // Le sceau du Dahira est une image : photographier avant qu'elle soit
  // chargee donne une en-tete sans logo — le defaut exact que l'impression
  // avait deja connu. On attend, avec une limite pour ne pas rester bloque.
  const images = [...doc.images].filter((i) => !i.complete);
  await Promise.all(
    images.map(
      (i) =>
        new Promise<void>((r) => {
          const fini = () => r();
          i.addEventListener("load", fini, { once: true });
          i.addEventListener("error", fini, { once: true });
          setTimeout(fini, 3000);
        })
    )
  );
  try {
    await (doc as Document & { fonts?: FontFaceSet }).fonts?.ready;
  } catch {
    /* le navigateur ne connait pas document.fonts : on continue */
  }
  await unTour();

  const pages = [...doc.querySelectorAll<HTMLElement>(".page")];
  if (!pages.length) {
    nettoyer();
    throw new Error("Le document est vide — aucune feuille à convertir.");
  }
  return { pages, nettoyer };
}

/** Les hauteurs, en pixels CSS, ou l'on peut couper sans traverser un bloc.
 *
 *  Une feuille `.page` du document n'a PAS de hauteur fixe : elle s'allonge
 *  avec son contenu, et c'est le navigateur qui la repartit sur plusieurs
 *  feuilles au moment d'imprimer. En la photographiant, on obtient une seule
 *  image tres haute qu'il faut redecouper nous-memes.
 *
 *  Couper a l'aveugle tous les 297 mm trancherait au milieu d'une ligne de
 *  texte ou d'une ligne de tableau. On releve donc le bas de chaque bloc :
 *  ce sont les seuls endroits ou une coupure ne coupe rien. */
function pointsDeCoupe(page: HTMLElement): number[] {
  const haut = page.getBoundingClientRect().top;
  const vue = page.ownerDocument.defaultView;
  const points = new Set<number>();
  // Zones ou une coupure est interdite : le CSS d'impression declare
  // « break-inside: avoid » sur les blocs qui ne se coupent pas — une section,
  // une ligne de tableau, un bloc de signatures. On lit cette declaration au
  // lieu de la deviner : c'est deja la reponse, ecrite a cote du style.
  const interdites: [number, number][] = [];

  for (const el of page.querySelectorAll<HTMLElement>("*")) {
    const r = el.getBoundingClientRect();
    if (r.height <= 0) continue;
    points.add(r.bottom - haut);
    const style = vue?.getComputedStyle(el);
    const insecable =
      style?.breakInside === "avoid" ||
      (style as CSSStyleDeclaration & { pageBreakInside?: string })?.pageBreakInside === "avoid";
    if (insecable) interdites.push([r.top - haut, r.bottom - haut]);
  }

  // Le demi-pixel de tolerance laisse couper JUSTE au bord d'un bloc
  // insecable — ce qui est permis — sans couper dedans.
  return [...points]
    .filter((p) => !interdites.some(([a, b]) => p > a + 0.5 && p < b - 0.5))
    .sort((a, b) => a - b);
}

/** Decoupe la photo d'une feuille en bandes hautes d'au plus une A4.
 *  Renvoie des intervalles en pixels de l'image. */
function bandes(
  toile: { width: number; height: number },
  coupes: number[],
  parPixelCss: number,
  hauteurMax: number
): { debut: number; fin: number }[] {
  // Une tolerance d'un demi-millimetre : sans elle, une feuille qui depasse
  // d'un cheveu produirait une seconde page presque vide.
  const marge = hauteurMax * 0.002;
  if (toile.height <= hauteurMax + marge) return [{ debut: 0, fin: toile.height }];

  const enImage = coupes.map((c) => c * parPixelCss);
  const morceaux: { debut: number; fin: number }[] = [];
  let debut = 0;
  while (debut < toile.height) {
    const limite = debut + hauteurMax;
    if (limite >= toile.height - marge) {
      morceaux.push({ debut, fin: toile.height });
      break;
    }
    // Le dernier bloc qui finit avant la limite. On refuse les coupures trop
    // hautes : mieux vaut trancher une fois dans un bloc que produire dix
    // pages d'un centimetre.
    const minimum = debut + hauteurMax * 0.35;
    let fin = 0;
    for (const c of enImage) {
      if (c > limite) break;
      if (c > minimum) fin = c;
    }
    if (!fin) fin = limite; // aucun endroit propre : coupure franche
    morceaux.push({ debut, fin });
    debut = fin;
  }
  return morceaux;
}

/** Convertit le HTML d'impression en PDF A4. Une feuille `.page` donne une
 *  page, ou plusieurs si son contenu deborde — jamais une page ecrasee. */
export async function pdfDepuisHtml(html: string): Promise<Blob> {
  // Chargement a la demande : ces deux librairies pesent lourd, et la plupart
  // des ecrans d'administration n'en ont jamais besoin.
  const [{ jsPDF: JsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);

  const { pages, nettoyer } = await rendre(html);
  try {
    let pdf: jsPDF | null = null;
    for (const page of pages) {
      const toile = await html2canvas(page, {
        scale: 2, // ~300 points par pouce sur une A4 : lisible a l'ecran et net a l'impression
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      // Combien de pixels d'image pour un pixel CSS, et pour un millimetre.
      const parPixelCss = toile.height / page.getBoundingClientRect().height;
      const parMm = toile.width / A4_L;
      const decoupe = bandes(toile, pointsDeCoupe(page), parPixelCss, A4_H * parMm);

      for (const { debut, fin } of decoupe) {
        const hauteur = Math.round(fin - debut);
        if (hauteur <= 0) continue;
        const morceau = document.createElement("canvas");
        morceau.width = toile.width;
        morceau.height = hauteur;
        const pinceau = morceau.getContext("2d");
        if (!pinceau) throw new Error("Le navigateur a refusé de dessiner la page.");
        // Fond blanc : une bande plus courte que la page laisserait sinon du
        // transparent, qui vire au noir dans un JPEG.
        pinceau.fillStyle = "#ffffff";
        pinceau.fillRect(0, 0, morceau.width, morceau.height);
        pinceau.drawImage(toile, 0, -debut);

        if (!pdf) pdf = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
        else pdf.addPage();
        // Hauteur REELLE de la bande, pas 297 mm : poser une bande courte sur
        // une page entiere l'etirerait, et le document serait deforme.
        pdf.addImage(
          morceau.toDataURL("image/jpeg", 0.92),
          "JPEG",
          0,
          0,
          A4_L,
          Math.min(A4_H, hauteur / parMm)
        );
      }
    }
    if (!pdf) throw new Error("Aucune page n'a pu être convertie.");
    return pdf.output("blob");
  } finally {
    nettoyer();
  }
}

/** Nom de fichier sans accent ni espace : certains telephones renomment ou
 *  refusent les pieces jointes dont le nom sort de l'ASCII. */
export function nomDeFichier(base: string): string {
  const propre = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${propre || "document"}-${new Date().toISOString().slice(0, 10)}.pdf`;
}

/** Envoie le document sur WhatsApp.
 *
 *  @param html     le document, tel que le produit lib/impression.ts
 *  @param titre    ce qu'on envoie, en clair — sert au nom du fichier
 *  @param message  le texte qui accompagne la piece jointe
 *  @param telephone  destinataire, chiffres seulement. Vide = WhatsApp
 *                    demande a qui envoyer.
 *  @returns lequel des deux chemins a ete pris (cf. en-tete du fichier) */
export async function envoyerSurWhatsApp(
  html: string,
  titre: string,
  message: string,
  telephone = ""
): Promise<Issue> {
  const blob = await pdfDepuisHtml(html);
  const nom = nomDeFichier(titre);
  const fichier = new File([blob], nom, { type: "application/pdf" });

  // canShare({files}) avant share() : sans cette verification, un navigateur
  // qui connait share() mais refuse les fichiers leve une exception APRES
  // le geste de l'utilisateur, et le partage echoue sans explication.
  const partageur = navigator as Navigator & {
    canShare?: (d: ShareData) => boolean;
    share?: (d: ShareData) => Promise<void>;
  };
  if (partageur.share && partageur.canShare?.({ files: [fichier] })) {
    try {
      await partageur.share({ files: [fichier], title: titre, text: message });
      return "partage";
    } catch (e) {
      // AbortError = l'utilisateur a ferme la feuille de partage. Ce n'est pas
      // une panne : on ne doit surtout pas enchainer sur le telechargement,
      // il vient de dire non.
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      // Toute autre erreur : on retombe sur le telechargement.
    }
  }

  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nom;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  const chiffres = telephone.replace(/\D+/g, "");
  const texte = encodeURIComponent(`${message}\n\n(document « ${nom} » en pièce jointe)`);
  window.open(
    chiffres ? `https://wa.me/${chiffres}?text=${texte}` : `https://wa.me/?text=${texte}`,
    "_blank",
    "noopener"
  );
  return "telecharge";
}
