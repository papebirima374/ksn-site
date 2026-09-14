// Visuels d'un article du blog : couverture, image de partage, cartes de vers.
//
// AUCUNE REPRESENTATION FIGURATIVE. Ni le Prophete ﷺ, ni Halima, ni aucun etre
// anime : la tradition islamique s'y oppose, et un blog du Dahira ne peut pas
// s'en affranchir. On s'en tient a ce que l'art musulman a toujours employe —
// la calligraphie, la geometrie et la lumiere.
//
// Les polices sont celles du site (Amiri pour l'arabe, Playfair et Inter pour
// le latin), prises dans le build Next et embarquees en base64 : le rendu est
// donc identique a celui du site, et ne depend d'aucun acces reseau.
//
//   npm install --no-save puppeteer-core
//   node scripts/visuels-article.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.join(RACINE, "public/blog/mourdi3a-sayyid-al-woujoud");
const CHROME = process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium";

/* ── Polices du site, identifiees par leur table de caracteres ────────── */
const POLICES = {
  amiri: "05d29f0ed5b0e698-s.p.0ipr5zwy0u.~f.woff2",
  amiriGras: "291696193ea1e96b-s.p.0mmds2ktxtq7_.woff2",
  playfair: "2a65768255d6b625-s.p.14by5b4al-y~f.woff2",
  inter: "83afe278b6a6bb3c-s.p.0q-301v4kxxnr.woff2",
  crimson: "a41eab1df8ed80c4-s.p.05m5kcrbsr6xs.woff2",
};

const b64 = (f) =>
  fs.readFileSync(path.join(RACINE, ".next/static/media", f)).toString("base64");

const FONTS = Object.entries(POLICES)
  .map(([nom, f]) => {
    const gras = nom === "amiriGras" ? 700 : 400;
    const style = nom === "crimson" ? "italic" : "normal";
    const famille = nom === "amiriGras" ? "Amiri" : nom[0].toUpperCase() + nom.slice(1);
    return `@font-face{font-family:"${famille}";font-weight:${gras};font-style:${style};
      src:url(data:font/woff2;base64,${b64(f)}) format("woff2");font-display:block}`;
  })
  .join("\n");

const SCEAU = fs.readFileSync(path.join(RACINE, "public/logo/ksn-logo.png")).toString("base64");

/* ── Entrelacs geometrique : deux carres croises, l'etoile a huit branches
      du repertoire classique. Motif, pas image. ────────────────────────── */
const etoiles = (couleur = "#D4AF37", opacite = 0.5, trait = 2) =>
  // Guillemets SIMPLES autour du data: — le motif est pose dans un
  // attribut style="…", et un guillemet double le refermerait au milieu.
  // C'est silencieux : le navigateur ne signale rien, le fond reste nu.
  `url('data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
      <g fill="none" stroke="${couleur}" stroke-width="${trait}" opacity="${opacite}">
        <rect x="35" y="35" width="70" height="70"/>
        <rect x="35" y="35" width="70" height="70" transform="rotate(45 70 70)"/>
        <circle cx="70" cy="70" r="7"/>
        <path d="M0 70h35M105 70h35M70 0v35M70 105v35"/>
        <rect x="-35" y="-35" width="70" height="70"/>
        <rect x="105" y="105" width="70" height="70"/>
        <rect x="105" y="-35" width="70" height="70"/>
        <rect x="-35" y="105" width="70" height="70"/>
      </g>
    </svg>`
  )}')`;

const BASE = `
${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#06291D;-webkit-font-smoothing:antialiased}
.carte{position:relative;overflow:hidden;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center}

/* Fond vert profond, lumiere venue du haut — la lumiere, jamais la figure. */
.sombre{background:
  radial-gradient(120% 80% at 50% -10%, rgba(212,175,55,.30), transparent 62%),
  linear-gradient(160deg,#06291D 0%,#082F22 45%,#0C5B3E 100%)}
.clair{background:
  radial-gradient(110% 70% at 50% -8%, rgba(15,124,85,.10), transparent 60%),
  linear-gradient(170deg,#FBFAF6 0%,#F8F5EF 55%,#F2EDE2 100%)}
.treillis{position:absolute;inset:0}
/* Voile central : le motif s'efface la ou le texte se pose. */
.voile{position:absolute;inset:0;z-index:1}
.voile.s{background:radial-gradient(68% 62% at 50% 52%,
  rgba(6,41,29,.92) 0%, rgba(6,41,29,.72) 42%, transparent 76%)}
.voile.c{background:radial-gradient(62% 54% at 50% 48%,
  rgba(251,250,246,.96) 0%, rgba(248,245,239,.82) 46%, transparent 80%)}

.sceau{position:relative;z-index:2;display:block}
.ar{font-family:"Amiri",serif;direction:rtl;line-height:1.85}
.fr{font-family:"Playfair",Georgia,serif}
.ui{font-family:"Inter",system-ui,sans-serif}
.it{font-family:"Crimson",Georgia,serif;font-style:italic}

/* Le sigle ﷺ (U+FDFA) n'existe que dans Amiri. Dans une ligne latine,
   Playfair le remplace par un carre vide : on le lui retire. */
.salla{font-family:"Amiri",serif;font-style:normal;font-weight:400}

.or{background:linear-gradient(100deg,#B8860B,#F0D97A 42%,#D4AF37);
  -webkit-background-clip:text;background-clip:text;color:transparent}

/* Filet d'or au losange : separateur discret entre deux blocs. */
.filet{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:14px}
.filet i{display:block;height:1.5px;width:120px;
  background:linear-gradient(90deg,transparent,#D4AF37)}
.filet i.d{background:linear-gradient(90deg,#D4AF37,transparent)}
.filet b{width:11px;height:11px;background:#D4AF37;transform:rotate(45deg);flex:none}

.arc{position:absolute;left:-12%;right:-12%;bottom:-14%;height:26%;
  border-radius:50% 50% 0 0;border-top:3px solid rgba(212,175,55,.85);
  background:linear-gradient(to top, rgba(212,175,55,.16), transparent 70%)}
.pied{position:absolute;z-index:4;left:0;right:0;bottom:0;display:flex;
  align-items:center;justify-content:space-between}
`;

/* ── Les pieces ──────────────────────────────────────────────────────── */

const sceau = (t) =>
  `<img class="sceau" src="data:image/png;base64,${SCEAU}" width="${t}" height="${t}" alt="">`;

const VERS = [
  {
    fichier: "vers-halima",
    source: "نظم سلسلة الكرام · Nazm Silsilat al-Kirâm",
    hemistiches: ["صَلِّ عَلَى مَنْ ظِئْرُهُ حَلِيمَةْ", "مُحَمَّدٍ مَنْ جَدُّهُ خُزَيْمَةْ"],
    fr: ["Prie sur celui dont la nourrice fut Halima,", "Muhammad, dont l’aïeul est Khuzayma."],
  },
  {
    fichier: "vers-rabi-al-akhir",
    source: "قصيدة مقيدة بـ ربيع الآخر لي",
    hemistiches: ["رَحَّبْتُ حُبًّا بِرَبِيعِ الْآخِرِ", "الْمُرْضِعِ الْمَحْبُوبِ ذِي الْمَفَاخِرِ"],
    fr: ["J’ai accueilli avec amour Rabî‘ al-Âkhir,", "le mois où fut allaité le Bien-Aimé aux nobles mérites."],
  },
  {
    fichier: "vers-radaa",
    source: "قصيدة مطرزة بـ لي ربيع الآخر",
    hemistiches: ["رَضَاعَةُ الْمُخْتَارِ ذِي الْمَفَاخِرِ", "بِهَا تَزَيَّنَ رَبِيعُ الْآخِرِ"],
    fr: ["L’allaitement de l’Élu aux nobles vertus", "a paré le mois de Rabî‘ al-Âkhir."],
  },
  {
    fichier: "vers-choukr",
    source: "قصيدة مطرزة بـ لي ربيع الآخر",
    hemistiches: ["يَا مُرْضِعَ الْمَحْبُوبِ ذِي الْمَفَاخِرِ", "شُكْرِي ارْفَعَنْ إِلَى الْقَدِيمِ الْآخِرِ"],
    fr: ["Ô nourrice du Bien-Aimé aux nobles mérites,", "élève ma gratitude vers l’Éternel, le Dernier."],
  },
];

/** Carte d'un distique : l'arabe d'abord, la traduction dessous. */
const carteVers = (v) => `
<div class="carte clair" style="width:1200px;height:1200px;padding:96px 84px">
  <div class="treillis" style="background-image:${etoiles("#0F7C55", 0.22, 2)};background-size:132px"></div>
  <div class="voile c"></div>
  <div style="position:absolute;inset:44px;border:2px solid rgba(15,124,85,.22);border-radius:26px"></div>
  <div style="position:absolute;inset:56px;border:1px solid rgba(212,175,55,.55);border-radius:20px"></div>

  ${sceau(96)}
  <p class="ui" style="position:relative;z-index:2;margin-top:22px;font-size:15px;font-weight:800;
     letter-spacing:.34em;text-transform:uppercase;color:#0F7C55">Cheikh Ahmadou Bamba El Khadim</p>

  <div class="filet" style="margin:40px 0 46px"><i></i><b></b><i class="d"></i></div>

  <p class="ar" style="position:relative;z-index:2;font-size:60px;font-weight:700;color:#06291D">
    ${v.hemistiches[0]}
  </p>
  <p class="ar" style="position:relative;z-index:2;font-size:60px;font-weight:700;color:#06291D;margin-top:6px">
    ${v.hemistiches[1]}
  </p>

  <div class="filet" style="margin:46px 0 38px"><i></i><b></b><i class="d"></i></div>

  <p class="it" style="position:relative;z-index:2;font-size:33px;line-height:1.62;color:#1B4B3A;max-width:900px">
    ${v.fr[0]}<br>${v.fr[1]}
  </p>

  <p class="ar" style="position:absolute;z-index:3;left:0;right:0;bottom:96px;
     font-size:23px;color:#6C8579">${v.source}</p>
</div>`;

/* La chaine des aieux : ce que le poeme « Nazm Silsilat al-Kirâm » ordonne. */
const AIEUX = [
  "عَدْنَان", "مَعَدّ", "نِزَار", "مُضَر", "إِلْيَاس", "مُدْرِكَة", "خُزَيْمَة",
  "كِنَانَة", "النَّضْر", "مَالِك", "فِهْر", "غَالِب", "لُؤَيّ", "كَعْب", "مُرَّة",
  "كِلَاب", "قُصَيّ", "عَبْد مَنَاف", "هَاشِم", "عَبْد الْمُطَّلِب", "عَبْد اللَّه",
];

const carteLignee = () => `
<div class="carte sombre" style="width:1200px;height:1200px;padding:78px 78px 70px">
  <div class="treillis" style="background-image:${etoiles("#D4AF37", 0.18, 2)};background-size:132px"></div>
  <div class="voile s"></div>

  <p class="ui" style="position:relative;z-index:2;font-size:14px;font-weight:800;
     letter-spacing:.32em;text-transform:uppercase;color:#E8CE72">Silsilat al-Kirâm</p>
  <p class="ar or" style="position:relative;z-index:2;font-size:52px;font-weight:700;margin-top:6px">
    سِلْسِلَةُ الْكِرَامِ
  </p>
  <p class="it" style="position:relative;z-index:2;font-size:23px;color:#CFE4D9;margin-top:2px">
    La chaîne des aïeux, de ‘Adnân au Sceau de l’Existence <span class="salla">ﷺ</span>
  </p>

  <div class="filet" style="margin:30px 0 34px"><i></i><b></b><i class="d"></i></div>

  <!-- Une chaine, non une pile : les noms s'enchainent et le maillon nomme
       par le Cheikh s'y detache. Vingt-et-un noms empiles ne tenaient pas sur
       la feuille — le dernier, celui du Prophete ﷺ, en tombait. -->
  <p class="ar" style="position:relative;z-index:2;font-size:33px;line-height:2.25;
     color:#DCEAE3;max-width:980px;word-spacing:6px">
    ${AIEUX.map((nom) =>
      nom === "خُزَيْمَة"
        ? `<span style="color:#06291D;font-weight:700;background:linear-gradient(100deg,#D4AF37,#F0D97A);
             padding:3px 22px;border-radius:999px;white-space:nowrap">${nom}</span>`
        : `<span style="white-space:nowrap">${nom}</span>`
    ).join(' <span style="color:#D4AF37;opacity:.7">◆</span> ')}
  </p>

  <div class="filet" style="margin:34px 0 22px"><i></i><b></b><i class="d"></i></div>

  <p class="ar or" style="position:relative;z-index:2;font-size:66px;font-weight:700;line-height:1.45">
    مُحَمَّدٌ ﷺ
  </p>

  <p class="ui" style="position:absolute;z-index:3;left:0;right:0;bottom:56px;
     font-size:18px;color:#9FBFB1">
    <b style="color:#E8CE72">خُزَيْمَة</b> — l’aïeul que le Cheikh nomme dans ses vers
  </p>
</div>`;

/* Le mot « ظِئْر » : la trouvaille linguistique de l'article. */
const carteZir = () => `
<div class="carte clair" style="width:1200px;height:1200px;padding:96px 84px">
  <div class="treillis" style="background-image:${etoiles("#0F7C55", 0.20, 2)};background-size:132px"></div>
  <div class="voile c"></div>
  <div style="position:absolute;inset:44px;border:2px solid rgba(15,124,85,.22);border-radius:26px"></div>
  <div style="position:absolute;inset:56px;border:1px solid rgba(212,175,55,.55);border-radius:20px"></div>

  <!-- Latin et arabe sur DEUX lignes : melanges dans un meme paragraphe, le
       sens de lecture s'inverse au milieu et les mots se chevauchent. -->
  <p class="ui" style="position:relative;z-index:2;font-size:15px;font-weight:800;
     letter-spacing:.32em;text-transform:uppercase;color:#0F7C55">Le mot juste</p>
  <p class="ar" style="position:relative;z-index:2;font-size:26px;color:#6C8579;margin-top:4px">
    دِقَّةُ اللَّفْظِ
  </p>

  <p class="ar" style="position:relative;z-index:2;font-size:178px;font-weight:700;color:#0F7C55;
     line-height:1.5;margin:6px 0 0">ظِئْر</p>

  <div class="filet" style="margin:16px 0 40px"><i></i><b></b><i class="d"></i></div>

  <p class="ar" style="position:relative;z-index:2;font-size:38px;color:#06291D;max-width:900px">
    الْمَرْأَةُ الَّتِي تُرْضِعُ وَلَدًا لَيْسَ مِنْ صُلْبِهَا
  </p>

  <p class="it" style="position:relative;z-index:2;margin-top:36px;font-size:31px;line-height:1.62;
     color:#1B4B3A;max-width:860px">
    La femme qui allaite l’enfant d’autrui — plus précis que le simple mot
    «&nbsp;nourrice&nbsp;». Le Cheikh choisit le terme le plus exact de la langue.
  </p>

  <p class="ui" style="position:absolute;z-index:3;left:0;right:0;bottom:96px;
     font-size:20px;color:#6C8579">Bachir Touré · Serviteur de la poésie khadimienne</p>
</div>`;

/** Couverture et image de partage : meme composition, deux formats. */
const couverture = (l, h, ech = 1) => `
<div class="carte sombre" style="width:${l}px;height:${h}px;padding:${64 * ech}px ${70 * ech}px">
  <div class="treillis" style="background-image:${etoiles("#D4AF37", 0.20, 2.2)};background-size:${132 * ech}px"></div>
  <div class="voile s"></div>
  <div class="arc"></div>

  ${sceau(Math.round(112 * ech))}
  <p class="ui" style="position:relative;z-index:2;margin-top:${16 * ech}px;font-size:${15 * ech}px;
     font-weight:800;letter-spacing:.34em;text-transform:uppercase;color:#E8CE72">
    Dahira Kippangog Salaatu ’Alaa Nabii
  </p>

  <p class="ar or" style="position:relative;z-index:2;margin-top:${20 * ech}px;
     font-size:${92 * ech}px;font-weight:700;line-height:1.55">
    مُرْضِعَةُ سَيِّدِ الْوُجُودِ ﷺ
  </p>

  <div class="filet" style="margin:${10 * ech}px 0 ${26 * ech}px">
    <i style="width:${150 * ech}px"></i><b></b><i class="d" style="width:${150 * ech}px"></i>
  </div>

  <p class="fr" style="position:relative;z-index:2;font-size:${46 * ech}px;font-weight:700;
     color:#FBFAF6;line-height:1.3;max-width:${1180 * ech}px">
    La nourrice du Sceau de l’Existence <span class="salla">ﷺ</span>
  </p>
  <p class="it" style="position:relative;z-index:2;margin-top:${14 * ech}px;font-size:${27 * ech}px;
     color:#CFE4D9;max-width:${1000 * ech}px;line-height:1.5">
    dans la poésie de Cheikh Ahmadou Bamba El Khadim
  </p>

  <p class="ui" style="position:relative;z-index:2;margin-top:${26 * ech}px;font-size:${17 * ech}px;
     font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#9FBFB1">
    Étude · Sîra · Poésie khadimienne
  </p>

  <div class="pied ui" style="padding:0 ${64 * ech}px ${34 * ech}px;font-size:${18 * ech}px;color:#BFD6CB">
    <span>Bachir Touré</span>
    <span style="color:#D4AF37;font-weight:700">salaatualaanabii.com</span>
  </div>
</div>`;

const PIECES = [
  ["couverture", couverture(1600, 900, 1), 1600, 900],
  ["partage-og", couverture(1200, 630, 0.78), 1200, 630],
  ["lignee-khuzayma", carteLignee(), 1200, 1200],
  ["le-mot-zir", carteZir(), 1200, 1200],
  ...VERS.map((v) => [v.fichier, carteVers(v), 1200, 1200]),
];

/* ── Rendu ───────────────────────────────────────────────────────────── */
fs.mkdirSync(SORTIE, { recursive: true });
const nav = await puppeteer.launch({ executablePath: CHROME, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

for (const [nom, contenu, l, h] of PIECES) {
  const page = await nav.newPage();
  await page.setViewport({ width: l, height: h, deviceScaleFactor: 2 });
  await page.setContent(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE}</style></head><body>${contenu}</body></html>`,
    { waitUntil: "load" }
  );
  await page.evaluate(() => document.fonts.ready);
  // JPEG plutot que PNG : ces visuels sont des aplats et des degrades, pas des
  // captures a pixels nets. En PNG ils pesaient pres de 3 Mo piece — trop lourd
  // pour une page d'article, et trop lourd pour un envoi WhatsApp, qui est le
  // canal reel du Dahira. A 92, la difference ne se voit pas a l'oeil.
  const fichier = path.join(SORTIE, `${nom}.jpg`);
  await page.screenshot({ path: fichier, type: "jpeg", quality: 92 });
  console.log(`  ${(fs.statSync(fichier).size / 1024).toFixed(0).padStart(5)} Ko  ${l}×${h}  ${nom}.jpg`);
  await page.close();
}

await nav.close();
console.log(`\nVisuels dans ${SORTIE}`);
