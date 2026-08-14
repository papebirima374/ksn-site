// Générateur de visuels islamiques (citations) au format Instagram.
//
//   node scripts/visuels-citations.mjs                 -> tout, carré + story
//   node scripts/visuels-citations.mjs --only=01-xxx    -> une seule citation
//   node scripts/visuels-citations.mjs --formats=carre  -> carré uniquement
//
// Les citations sont lues dans content/citations-visuels.json.
// Les PNG sortent dans public/kit-assets/visuels/citations/.
//
// Le texte des citations (wolof) n'est jamais modifié par le script :
// il est injecté tel quel, seule la taille de police s'adapte.

import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "kit-assets", "visuels", "citations");
const FONT_CACHE = join(__dirname, ".fonts-cache");
mkdirSync(OUT, { recursive: true });
mkdirSync(FONT_CACHE, { recursive: true });

/* ------------------------------------------------------------------ */
/* Chromium                                                            */
/* ------------------------------------------------------------------ */

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const pwRoot = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (existsSync(pwRoot)) {
    for (const dir of readdirSync(pwRoot)) {
      for (const bin of ["chrome-linux/chrome", "chrome-linux/headless_shell"]) {
        const p = join(pwRoot, dir, bin);
        if (existsSync(p)) return p;
      }
    }
  }
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  throw new Error("Chrome/Chromium introuvable — définis CHROME_PATH.");
}

/* ------------------------------------------------------------------ */
/* Polices : CSS Google Fonts téléchargé une fois puis inliné en base64 */
/* ------------------------------------------------------------------ */

const FONT_FAMILIES = [
  "Playfair+Display:ital,wght@0,700;0,900;1,600;1,700",
  "Amiri:wght@400;700",
  "Inter:wght@400;500;600",
];

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function cached(name, loader) {
  const file = join(FONT_CACHE, name);
  if (existsSync(file)) return readFileSync(file);
  const buf = await loader();
  writeFileSync(file, buf);
  return buf;
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} sur ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function buildFontCss() {
  let css = "";
  for (const family of FONT_FAMILIES) {
    const key = family.replace(/[^a-z0-9]+/gi, "-") + ".css";
    css += (await cached(key, async () =>
      fetchBuffer(`https://fonts.googleapis.com/css2?family=${family}&display=swap`)
    )).toString();
  }
  const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/g) || [])];
  for (const url of urls) {
    const key = url.split("/").slice(-2).join("_");
    const buf = await cached(key, () => fetchBuffer(url));
    css = css.split(url).join(`data:font/woff2;base64,${buf.toString("base64")}`);
  }
  return css;
}

/* ------------------------------------------------------------------ */
/* Thèmes                                                              */
/* ------------------------------------------------------------------ */

const THEMES = {
  vert: { fond: "#0A3D24", fond2: "#082F22", texte: "#FBF6EA", or: "#D4AF37", or2: "#E8CE84" },
  nuit: { fond: "#12100C", fond2: "#0A0908", texte: "#F7F1E3", or: "#D4AF37", or2: "#EFD68F" },
  creme: { fond: "#FAF7F0", fond2: "#F2EADA", texte: "#0A3D24", or: "#B8860B", or2: "#D4AF37", sig: "#9A6E08" },
  emeraude: { fond: "#0F7C55", fond2: "#0A5B3E", texte: "#FDFBF5", or: "#F2D98B", or2: "#FFF0C2" },
};

const FORMATS = {
  carre: { w: 1080, h: 1080, label: "carre" },
  story: { w: 1080, h: 1920, label: "story" },
};

/* ------------------------------------------------------------------ */
/* Gabarit HTML                                                        */
/* ------------------------------------------------------------------ */

function page({ citation, theme, format, fontCss }) {
  const t = THEMES[theme] || THEMES.vert;
  const { w, h } = format;
  const story = h > w;
  const marge = story ? 72 : 60;

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="wo"><head><meta charset="utf-8">
<style>
${fontCss}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:${w}px; height:${h}px; }
body {
  font-family:"Playfair Display", Georgia, serif;
  background:${t.fond};
  -webkit-font-smoothing:antialiased;
  text-rendering:geometricPrecision;
}
.scene { position:relative; width:${w}px; height:${h}px; overflow:hidden;
  background:
    radial-gradient(120% 90% at 50% 0%, ${t.fond2}00 0%, ${t.fond2} 100%),
    ${t.fond};
}
/* trame géométrique */
.motif { position:absolute; inset:0; opacity:${theme === "creme" ? 0.1 : 0.13}; }
/* halo doux derrière le texte */
.halo { position:absolute; left:50%; top:50%; width:${w * 1.15}px; height:${w * 1.15}px;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle, ${t.or}22 0%, ${t.or}00 62%); }
/* cadre doré */
.cadre { position:absolute; inset:${marge}px; border:2px solid ${t.or}; opacity:.85; }
.cadre::after { content:""; position:absolute; inset:10px; border:1px solid ${t.or}; opacity:.55; }
.coin { position:absolute; width:22px; height:22px; background:${t.or};
  transform:rotate(45deg); opacity:.9; }
.coin.tl { left:${marge - 11}px; top:${marge - 11}px; }
.coin.tr { right:${marge - 11}px; top:${marge - 11}px; }
.coin.bl { left:${marge - 11}px; bottom:${marge - 11}px; }
.coin.br { right:${marge - 11}px; bottom:${marge - 11}px; }

.contenu { position:absolute; inset:${marge + 46}px; display:flex; flex-direction:column;
  align-items:center; justify-content:space-between; text-align:center; }

.entete { display:flex; flex-direction:column; align-items:center; gap:${story ? 20 : 14}px;
  padding-top:${story ? 34 : 6}px; }
.rosace { display:block; color:${t.or}; opacity:.95; }
.bismillah { font-family:"Amiri", serif; color:${t.or2}; opacity:.92;
  font-size:${story ? 46 : 39}px; line-height:1.7; direction:rtl; }

.corps { flex:1; display:flex; align-items:center; justify-content:center;
  width:100%; padding:${story ? "26px 4px" : "10px 4px"}; }
.citation { position:relative; color:${t.texte}; font-weight:700; line-height:1.26;
  letter-spacing:.004em; max-width:${story ? 800 : 790}px; text-wrap:balance;
  text-shadow:0 2px 26px rgba(0,0,0,${theme === "creme" ? 0.06 : 0.4}); }
.citation::before, .citation::after {
  font-family:"Playfair Display", serif; color:${t.or}; opacity:.42; font-weight:900;
  position:absolute; line-height:1; font-size:104px; }
.citation::before { content:"\\201C"; left:-56px; top:-42px; }
.citation::after  { content:"\\201D"; right:-56px; bottom:-46px; }

.pied { display:flex; flex-direction:column; align-items:center; gap:${story ? 24 : 18}px;
  padding-bottom:${story ? 44 : 10}px; width:100%; }
.trait { display:flex; align-items:center; justify-content:center; gap:14px; width:100%; }
.trait i { display:block; height:1px; width:${story ? 200 : 168}px;
  background:linear-gradient(90deg, ${t.or}00, ${t.or}); }
.trait i + i { background:linear-gradient(90deg, ${t.or}, ${t.or}00); }
.trait b { color:${t.or}; font-size:15px; transform:rotate(45deg);
  width:11px; height:11px; background:${t.or}; }
.signature { font-family:"Playfair Display", serif; font-style:italic; font-weight:600;
  color:${t.sig || t.or2}; font-size:${story ? 48 : 42}px; letter-spacing:.02em; }
.mention { font-family:"Inter", sans-serif; font-weight:500; font-size:${story ? 22 : 19}px;
  letter-spacing:.30em; text-transform:uppercase; color:${t.texte}; opacity:.55; }
</style></head><body>
<div class="scene">
  <svg class="motif" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
    <defs>
      <pattern id="p" width="150" height="150" patternUnits="userSpaceOnUse">
        <g stroke="${t.or}" stroke-width="1.4" fill="none">
          <path d="M75 5 95 55 145 75 95 95 75 145 55 95 5 75 55 55Z"/>
          <path d="M75 22 128 75 75 128 22 75Z"/>
          <circle cx="75" cy="75" r="12"/>
          <path d="M0 0 150 150M150 0 0 150" opacity=".35"/>
        </g>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#p)"/>
  </svg>
  <div class="halo"></div>
  <div class="cadre"></div>
  <div class="coin tl"></div><div class="coin tr"></div>
  <div class="coin bl"></div><div class="coin br"></div>

  <div class="contenu">
    <div class="entete">
      <svg class="rosace" width="${story ? 210 : 180}" height="${story ? 42 : 36}" viewBox="0 0 210 42" fill="none">
        <g stroke="${t.or}" stroke-width="1.6" fill="none">
          <path d="M6 21h58M146 21h58"/>
          <path d="M105 4 118 21 105 38 92 21Z"/>
          <path d="M105 11 112 21 105 31 98 21Z" fill="${t.or}" stroke="none"/>
          <circle cx="78" cy="21" r="4"/><circle cx="132" cy="21" r="4"/>
        </g>
      </svg>
      <div class="bismillah">&#1589;&#1614;&#1604;&#1617;&#1614;&#1609; &#1575;&#1604;&#1604;&#1617;&#1614;&#1607;&#1615; &#1593;&#1614;&#1604;&#1614;&#1609; &#1575;&#1604;&#1606;&#1617;&#1614;&#1576;&#1616;&#1610;&#1617;</div>
    </div>

    <div class="corps"><div class="citation" id="citation">${esc(citation.texte)}</div></div>

    <div class="pied">
      <div class="trait"><i></i><b></b><i></i></div>
      <div class="signature">${esc(citation.signature)}</div>
      ${citation.mention ? `<div class="mention">${esc(citation.mention)}</div>` : ""}
    </div>
  </div>
</div>
<script>
// Ajuste la taille de police pour remplir la zone sans jamais déborder.
(function () {
  var el = document.getElementById("citation");
  var zone = el.parentElement;
  var max = ${story ? 100 : 84}, min = 30, best = min;
  for (var lo = min, hi = max; lo <= hi; ) {
    var mid = Math.floor((lo + hi) / 2);
    el.style.fontSize = mid + "px";
    if (el.scrollHeight <= zone.clientHeight) {
      best = mid; lo = mid + 1;
    } else hi = mid - 1;
  }
  el.style.fontSize = best + "px";
  var g = Math.max(0.34, Math.min(0.62, best / 130));
  el.style.setProperty("--g", g);
})();
</script>
</body></html>`;
}

/* ------------------------------------------------------------------ */
/* Rendu                                                               */
/* ------------------------------------------------------------------ */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const data = JSON.parse(
  readFileSync(join(ROOT, "content", "citations-visuels.json"), "utf8")
);

const formats = String(args.formats || "carre,story")
  .split(",")
  .map((f) => FORMATS[f.trim()])
  .filter(Boolean);

const citations = data.citations.filter((c) => !args.only || c.id === args.only);
if (!citations.length) {
  console.error("Aucune citation à générer (vérifie --only=…).");
  process.exit(1);
}

const fontCss = await buildFontCss();
const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ["--no-sandbox", "--font-render-hinting=none", "--force-color-profile=srgb"],
});

for (const brute of citations) {
  const citation = {
    ...brute,
    signature: brute.signature || data.signatureParDefaut,
  };
  const theme = args.theme || citation.theme || "vert";
  const suffixe = args.theme ? `-${args.theme}` : "";
  for (const format of formats) {
    const p = await browser.newPage();
    await p.setViewport({ width: format.w, height: format.h, deviceScaleFactor: 1 });
    await p.setContent(page({ citation, theme, format, fontCss }), { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    const file = join(OUT, `${citation.id}${suffixe}-${format.label}.png`);
    await p.screenshot({ path: file, type: "png" });
    await p.close();
    console.log("✓", file.replace(ROOT + "/", ""));
  }
}

await browser.close();
