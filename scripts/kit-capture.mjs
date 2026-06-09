// Capture headless du site en format téléphone (390×844 @ DSF 3) via le
// Chrome système (puppeteer-core, pas de Chromium téléchargé).
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "kit-assets", "captures");
mkdirSync(OUT, { recursive: true });

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const BASE = process.env.KIT_BASE || "https://salaatualaanabii.com";

const PAGES = [
  { slug: "accueil", path: "/" },
  { slug: "dahira", path: "/dahira" },
  { slug: "challenge", path: "/challenge" },
  { slug: "spiritualite", path: "/spiritualite" },
  { slug: "journee", path: "/journee-salaatu" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function prepare(page) {
  // 1) Fermer la bannière cookies si présente (clic "Tout accepter")
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, a"));
    const accept = btns.find((b) =>
      /tout accepter|accepter|j'accepte/i.test(b.textContent || "")
    );
    if (accept) accept.click();
  });
  await sleep(400);

  // 2) Forcer le lazy-load : défiler par paliers jusqu'en bas
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 350));
    }
    window.scrollTo(0, 0);
  });
  await sleep(600);

  // 3) Décoder toutes les images + attendre les polices
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((img) =>
        img
          .decode()
          .catch(() => {})
      )
    );
    window.scrollTo(0, 0);
  });
  await sleep(500);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });
  try {
    for (const p of PAGES) {
      const page = await browser.newPage();
      await page.setViewport({
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      });
      // Pré-désactive les bandeaux (cookies + invite d'installation PWA)
      await page.evaluateOnNewDocument(() => {
        try {
          localStorage.setItem("ksn-cookie-consent", "all");
          localStorage.setItem("ksn-pwa-dismissed", "1");
        } catch (e) {}
      });
      const url = BASE + p.path;
      console.log("→ Capture", url);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await sleep(1200);
      await prepare(page);
      const out = join(OUT, `${p.slug}.png`);
      await page.screenshot({ path: out, type: "png" }); // viewport 390×844 @3x
      console.log("  ✓", out);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log("Terminé.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
