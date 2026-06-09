// Compose les visuels du kit (mockups transparents + affiches de marque)
// en rendant du HTML/CSS via le Chrome système (rendu fidèle des polices).
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CAP = join(ROOT, "public", "kit-assets", "captures");
const MOCK = join(ROOT, "public", "kit-assets", "mockups");
const VIS = join(ROOT, "public", "kit-assets", "visuels");
mkdirSync(MOCK, { recursive: true });
mkdirSync(VIS, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const dataUri = (p) =>
  "data:image/png;base64," + readFileSync(p).toString("base64");

const LOGO = dataUri(join(ROOT, "public", "logo", "ksn-logo.png"));
const CAPS = {
  accueil: dataUri(join(CAP, "accueil.png")),
  dahira: dataUri(join(CAP, "dahira.png")),
  challenge: dataUri(join(CAP, "challenge.png")),
  spiritualite: dataUri(join(CAP, "spiritualite.png")),
  journee: dataUri(join(CAP, "journee.png")),
};

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Inter:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap" rel="stylesheet">`;

// Cadre téléphone réutilisable (capture passée en src)
function phoneFrame(src) {
  return `<div class="phone"><div class="screen"><img src="${src}"></div></div>`;
}

const PHONE_CSS = `
.phone{width:400px;height:835px;background:#0b0b0b;border-radius:50px;padding:13px;
  box-shadow:0 40px 80px rgba(0,0,0,.45);position:relative}
.phone:before{content:"";position:absolute;top:13px;left:50%;transform:translateX(-50%);
  width:130px;height:28px;background:#0b0b0b;border-radius:0 0 18px 18px;z-index:2}
.screen{width:100%;height:100%;border-radius:40px;overflow:hidden;background:#082F22}
.screen img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}`;

async function renderToPng(browser, html, opts) {
  const { width, height, dsf = 2, selector, omitBackground = false, out } = opts;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dsf });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 350));
  if (selector) {
    const el = await page.$(selector);
    await el.screenshot({ path: out, omitBackground });
  } else {
    await page.screenshot({ path: out, omitBackground });
  }
  await page.close();
  console.log("  ✓", out);
}

// ---------- 1) MOCKUPS TRANSPARENTS ----------
async function buildMockups(browser) {
  console.log("Mockups transparents…");
  for (const [slug, src] of Object.entries(CAPS)) {
    const html = `<!doctype html><html><head><meta charset="utf-8">
<style>*{margin:0;box-sizing:border-box}html,body{background:transparent}
.pad{display:inline-block;padding:100px}${PHONE_CSS}</style></head>
<body><div class="pad">${phoneFrame(src)}</div></body></html>`;
    await renderToPng(browser, html, {
      width: 700,
      height: 1100,
      dsf: 3,
      selector: ".pad",
      omitBackground: true,
      out: join(MOCK, `${slug}.png`),
    });
  }
}

// ---------- 2) AFFICHES DE MARQUE ----------
const BRAND_BASE = `*{margin:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
.bn{position:relative;overflow:hidden;color:#fff;
  background:radial-gradient(130% 100% at 50% -10%,#0F7C55 0%,#0A3D24 48%,#06251a 100%)}
.glow{position:absolute;border-radius:50%;filter:blur(70px);background:rgba(212,175,55,.20)}
.kicker{color:#D4AF37;font-weight:800;letter-spacing:.34em;text-transform:uppercase}
.ttl{font-family:'Playfair Display';font-weight:900;line-height:1.03}
.slogan{color:#d7e7df}
.url{display:inline-flex;align-items:center;font-weight:700;color:#fff;
  background:rgba(255,255,255,.10);border:1px solid rgba(212,175,55,.45);border-radius:999px}
.logo{border-radius:50%;background:#fff;box-shadow:0 12px 40px rgba(0,0,0,.45)}
.arab{font-family:'Amiri';color:#D4AF37}
.ph{position:absolute;filter:drop-shadow(0 30px 50px rgba(0,0,0,.5))}`;

function brandHtml(format, mocks) {
  const A = mocks.accueil, C = mocks.challenge;
  let inner = "", size = "";
  if (format === "affiche") {
    size = "width:1080px;height:1350px";
    inner = `
      <div class="glow" style="width:680px;height:680px;top:-220px;right:-160px"></div>
      <div class="glow" style="width:520px;height:520px;bottom:-200px;left:-180px"></div>
      <div style="position:relative;padding:90px 80px 0;text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:18px">
          <img class="logo" src="${LOGO}" style="width:96px;height:96px">
          <div class="kicker" style="font-size:23px">Lancement<br>Officiel</div>
        </div>
        <div class="ttl" style="font-size:92px;margin-top:34px">Le site KSN<br>est en ligne</div>
        <div class="slogan" style="font-size:27px;margin-top:26px;max-width:760px;margin-left:auto;margin-right:auto">
          Au service de la Prière sur le Prophète <span class="arab" style="color:#fff">ﷺ</span></div>
      </div>
      <img class="ph" src="${A}" style="width:430px;left:40px;bottom:-120px;transform:rotate(-9deg)">
      <img class="ph" src="${C}" style="width:430px;right:40px;bottom:-160px;transform:rotate(9deg)">
      <div style="position:absolute;left:50%;transform:translateX(-50%);bottom:70px;text-align:center;z-index:5">
        <div class="url" style="font-size:30px;padding:16px 34px">salaatualaanabii.com</div>
      </div>`;
  } else if (format === "banniere") {
    size = "width:1600px;height:900px";
    inner = `
      <div class="glow" style="width:620px;height:620px;top:-200px;left:-140px"></div>
      <div class="glow" style="width:520px;height:520px;bottom:-220px;right:-120px"></div>
      <div style="position:relative;padding:120px 0 0 110px;max-width:830px">
        <div style="display:flex;align-items:center;gap:16px">
          <img class="logo" src="${LOGO}" style="width:84px;height:84px">
          <div class="kicker" style="font-size:21px">Lancement Officiel</div>
        </div>
        <div class="ttl" style="font-size:104px;margin-top:26px">Le site KSN<br>est en ligne</div>
        <div class="slogan" style="font-size:28px;margin-top:26px;max-width:680px">
          Kippangog Salaatu ʿAlaa Nabii — au service de la Prière sur le Prophète <span class="arab" style="color:#fff">ﷺ</span></div>
        <div class="url" style="font-size:30px;padding:16px 34px;margin-top:40px">salaatualaanabii.com</div>
      </div>
      <img class="ph" src="${A}" style="width:400px;right:330px;top:90px;transform:rotate(-8deg)">
      <img class="ph" src="${C}" style="width:400px;right:60px;top:150px;transform:rotate(8deg)">`;
  } else if (format === "carre") {
    size = "width:1080px;height:1080px";
    inner = `
      <div class="glow" style="width:560px;height:560px;top:-180px;right:-150px"></div>
      <div class="glow" style="width:480px;height:480px;bottom:-180px;left:-150px"></div>
      <div style="position:relative;padding:80px 70px 0;text-align:center">
        <div class="kicker" style="font-size:21px">Lancement Officiel</div>
        <div class="ttl" style="font-size:78px;margin-top:18px">Le site KSN<br>est en ligne</div>
        <div class="slogan" style="font-size:24px;margin-top:20px">Au service de la Prière sur le Prophète <span class="arab" style="color:#fff">ﷺ</span></div>
      </div>
      <img class="logo" src="${LOGO}" style="position:absolute;width:92px;height:92px;top:74px;left:74px">
      <img class="ph" src="${A}" style="width:360px;left:70px;bottom:-150px;transform:rotate(-9deg)">
      <img class="ph" src="${C}" style="width:360px;right:70px;bottom:-180px;transform:rotate(9deg)">
      <div style="position:absolute;left:50%;transform:translateX(-50%);bottom:60px;z-index:5">
        <div class="url" style="font-size:27px;padding:14px 30px">salaatualaanabii.com</div>
      </div>`;
  } else {
    // story 9:16
    size = "width:1080px;height:1920px";
    inner = `
      <div class="glow" style="width:620px;height:620px;top:-180px;left:-160px"></div>
      <div class="glow" style="width:620px;height:620px;bottom:-180px;right:-160px"></div>
      <div style="position:relative;padding:150px 80px 0;text-align:center">
        <img class="logo" src="${LOGO}" style="width:150px;height:150px;margin:0 auto 28px">
        <div class="kicker" style="font-size:28px">Lancement Officiel</div>
        <div class="ttl" style="font-size:104px;margin-top:24px">Le site<br>est en ligne</div>
        <div class="slogan" style="font-size:32px;margin-top:30px;max-width:820px;margin-left:auto;margin-right:auto">
          Au service de la Prière sur le Prophète <span class="arab" style="color:#fff">ﷺ</span></div>
      </div>
      <img class="ph" src="${A}" style="width:470px;left:60px;bottom:240px;transform:rotate(-9deg)">
      <img class="ph" src="${C}" style="width:470px;right:60px;bottom:120px;transform:rotate(9deg)">
      <div style="position:absolute;left:50%;transform:translateX(-50%);bottom:90px;z-index:5">
        <div class="url" style="font-size:38px;padding:18px 40px">salaatualaanabii.com</div>
      </div>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}
<style>${BRAND_BASE}</style></head>
<body><div class="bn" style="${size}">${inner}</div></body></html>`;
}

async function buildBrand(browser) {
  console.log("Affiches de marque…");
  const mocks = {
    accueil: dataUri(join(MOCK, "accueil.png")),
    challenge: dataUri(join(MOCK, "challenge.png")),
  };
  const formats = [
    { id: "affiche", w: 1080, h: 1350 },
    { id: "banniere", w: 1600, h: 900 },
    { id: "carre", w: 1080, h: 1080 },
    { id: "story", w: 1080, h: 1920 },
  ];
  for (const f of formats) {
    await renderToPng(browser, brandHtml(f.id, mocks), {
      width: f.w,
      height: f.h,
      dsf: 2,
      selector: ".bn",
      omitBackground: false,
      out: join(VIS, `${f.id}.png`),
    });
  }
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-color-profile=srgb"],
  });
  try {
    await buildMockups(browser);
    await buildBrand(browser);
  } finally {
    await browser.close();
  }
  console.log("Composition terminée.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
