// KIT VIDÉO — capture chaque fonctionnalité du site dans l'ordre de
// présentation (format téléphone 390×844 @3x), puis compose les mockups
// transparents. Sortie : public/kit-assets/video/{captures,mockups}/NN-slug.png
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CAP = join(ROOT, "public", "kit-assets", "video", "captures");
const MOCK = join(ROOT, "public", "kit-assets", "video", "mockups");
mkdirSync(CAP, { recursive: true });
mkdirSync(MOCK, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.KIT_BASE || "https://salaatualaanabii.com";

// ─── SCÈNES dans l'ordre de présentation de la vidéo ──────────────────
// scroll: texte (regex) vers lequel défiler ; absent = haut de page.
const SCENES = [
  { n: "01", slug: "accueil-hero",            path: "/",                title: "Accueil — calligraphie & titre" },
  { n: "02", slug: "accueil-journee",         path: "/",                title: "Accueil — bannière Journée + compte à rebours", scroll: "Journée Salaatu ʿAlaa Nabii" },
  { n: "03", slug: "accueil-compteur",        path: "/",                title: "Accueil — compteur communautaire", scroll: "Salaatu offerts par la communauté" },
  { n: "04", slug: "dahira-hero",             path: "/dahira",          title: "Le Dahira — présentation" },
  { n: "05", slug: "dahira-commissions",      path: "/dahira",          title: "Le Dahira — commissions officielles", scroll: "Commissions Officielles" },
  { n: "06", slug: "histoire-timeline",       path: "/notre-histoire",  title: "Notre Histoire — les jalons", scroll: "Les jalons de notre histoire" },
  { n: "07", slug: "challenge-hero",          path: "/challenge",       title: "Challenge 1 Milliard — présentation" },
  { n: "08", slug: "challenge-compteur",      path: "/challenge",       title: "Challenge — compteur live", scroll: "Total cumulé par la communauté" },
  { n: "09", slug: "challenge-progression",   path: "/challenge",       title: "Challenge — progression mensuelle", scroll: "Progression Mensuelle" },
  { n: "10", slug: "journee-countdown",       path: "/journee-salaatu", title: "Journée Salaatu — compte à rebours" },
  { n: "11", slug: "journee-programme",       path: "/journee-salaatu", title: "Journée — programme des 7 moments", scroll: "sept moments forts" },
  { n: "12", slug: "journee-live",            path: "/journee-salaatu", title: "Journée — direct officiel YouTube", scroll: "Direct Officiel" },
  { n: "13", slug: "spiritualite-jour",       path: "/spiritualite",    title: "Spiritualité — Salaatou du jour" },
  { n: "14", slug: "spiritualite-bibliotheque", path: "/spiritualite",  title: "Spiritualité — bibliothèque des Salaats", scroll: "Bibliothèque" },
  { n: "15", slug: "media-galerie",           path: "/media",           title: "Média — galerie photos", scroll: "Moments du Dahira" },
  { n: "16", slug: "media-reseaux",           path: "/media",           title: "Média — réseaux sociaux", scroll: "Suivez KSN Partout" },
  { n: "17", slug: "boutique",                path: "/boutique",        title: "Boutique officielle" },
  { n: "18", slug: "blog",                    path: "/blog",            title: "Blog & actualités" },
  { n: "19", slug: "education",               path: "/education",       title: "Éducation — académie KSN" },
  { n: "20", slug: "don",                     path: "/don",             title: "Faire un don" },
  { n: "21", slug: "inscription-formulaire",  path: "/inscription",     title: "Rejoindre — formulaire d'intégration", scroll: "Demande d'intégration" },
  { n: "22", slug: "accueil-arabe",           path: "/",                title: "Multilingue — accueil en arabe (RTL)", locale: "ar" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function preparePage(page) {
  // Fermer la bannière cookies si encore visible
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, a"));
    const accept = btns.find((b) => /tout accepter|accept all|accetta|aceptar|قبول/i.test(b.textContent || ""));
    if (accept) accept.click();
  });
  await sleep(400);

  // Forcer le lazy-load : défiler jusqu'en bas puis remonter
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 300));
    }
    window.scrollTo(0, 0);
  });
  await sleep(500);

  // Polices + décodage images
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})));
    window.scrollTo(0, 0);
  });

  // Masquer les éléments flottants (scroll-to-top, bulle WhatsApp, toasts)
  await page.addStyleTag({
    content: `
      [class*="fixed"][class*="bottom-"]:not(header *) { display: none !important; }
    `,
  });
  await sleep(400);
}

async function scrollToText(page, pattern) {
  const found = await page.evaluate((pat) => {
    const re = new RegExp(pat, "i");
    const leaves = Array.from(document.querySelectorAll("h1,h2,h3,p,span"))
      .filter((e) => re.test((e.textContent || "").trim()));
    if (leaves.length === 0) return false;
    // Prend l'élément le plus profond qui matche
    const el = leaves[leaves.length - 1];
    const target = el.closest("section") || el;
    const y = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo(0, Math.max(0, y));
    return true;
  }, pattern);
  await sleep(1100);
  return found;
}

// ─── 1) CAPTURES ───────────────────────────────────────────────────────
async function capture(browser) {
  for (const s of SCENES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.evaluateOnNewDocument((locale) => {
      try {
        localStorage.setItem("ksn-cookie-consent", "all");
        localStorage.setItem("ksn-pwa-dismissed", "1");
        if (locale) localStorage.setItem("ksn-locale", locale);
      } catch (e) {}
    }, s.locale || "");
    const url = BASE + s.path;
    console.log(`→ ${s.n} ${s.title}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await sleep(3500);
    await preparePage(page);
    if (s.scroll) {
      const ok = await scrollToText(page, s.scroll);
      if (!ok) console.warn(`  ⚠ texte introuvable: "${s.scroll}" — capture du haut de page`);
    }
    const out = join(CAP, `${s.n}-${s.slug}.png`);
    await page.screenshot({ path: out, type: "png" });
    console.log("  ✓", out);
    await page.close();
  }
}

// ─── 2) MOCKUPS TRANSPARENTS ───────────────────────────────────────────
const PHONE_CSS = `
.phone{width:400px;height:835px;background:#0b0b0b;border-radius:50px;padding:13px;
  box-shadow:0 40px 80px rgba(0,0,0,.45);position:relative}
.phone:before{content:"";position:absolute;top:13px;left:50%;transform:translateX(-50%);
  width:130px;height:28px;background:#0b0b0b;border-radius:0 0 18px 18px;z-index:2}
.screen{width:100%;height:100%;border-radius:40px;overflow:hidden;background:#082F22}
.screen img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}`;

const dataUri = (p) => "data:image/png;base64," + readFileSync(p).toString("base64");

async function mockups(browser) {
  console.log("Mockups transparents…");
  for (const s of SCENES) {
    const src = dataUri(join(CAP, `${s.n}-${s.slug}.png`));
    const html = `<!doctype html><html><head><meta charset="utf-8">
<style>*{margin:0;box-sizing:border-box}html,body{background:transparent}
.pad{display:inline-block;padding:100px}${PHONE_CSS}</style></head>
<body><div class="pad"><div class="phone"><div class="screen"><img src="${src}"></div></div></div></body></html>`;
    const page = await browser.newPage();
    await page.setViewport({ width: 700, height: 1100, deviceScaleFactor: 3 });
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
    await sleep(300);
    const el = await page.$(".pad");
    const out = join(MOCK, `${s.n}-${s.slug}.png`);
    await el.screenshot({ path: out, omitBackground: true });
    console.log("  ✓", out);
    await page.close();
  }
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-color-profile=srgb"],
  });
  try {
    await capture(browser);
    await mockups(browser);
  } finally {
    await browser.close();
  }
  console.log("\nKit vidéo terminé —", SCENES.length, "scènes.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
