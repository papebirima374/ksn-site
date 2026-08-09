import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VIS = join(ROOT, "public", "kit-assets", "visuels");
mkdirSync(VIS, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const dataUri = (p) =>
  "data:image/png;base64," + readFileSync(p).toString("base64");

const LOGO = dataUri(join(ROOT, "public", "logo", "ksn-logo.png"));

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700;800&family=Amiri:wght@400;700&display=swap" rel="stylesheet">`;

const CSS_BASE = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #06251a;
}
.container {
  position: relative;
  overflow: hidden;
  color: #fff;
  background: radial-gradient(135% 100% at 50% -12%, #0F7C55 0%, #0A3D24 50%, #051F15 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}
.glow-top {
  position: absolute;
  width: 700px;
  height: 700px;
  top: -250px;
  border-radius: 50%;
  filter: blur(90px);
  background: rgba(212, 175, 55, 0.16);
  z-index: 1;
}
.glow-bottom {
  position: absolute;
  width: 500px;
  height: 500px;
  bottom: -150px;
  border-radius: 50%;
  filter: blur(80px);
  background: rgba(15, 124, 85, 0.25);
  z-index: 1;
}
.pattern {
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 40 40'%3E%3Cpath d='M20 0l6 6-6 6-6-6zM0 20l6 6-6 6zM40 20l-6 6 6 6zM20 40l6-6-6-6-6 6z' fill='%23D4AF37'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  z-index: 1;
}
.logo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 2;
}
.logo {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 12px 35px rgba(0,0,0,0.4);
  border: 2px solid #D4AF37;
}
.kicker {
  color: #D4AF37;
  font-weight: 800;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 14px;
}
.middle-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  z-index: 2;
  max-width: 90%;
}
.badge {
  background: #D4AF37;
  color: #06251a;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.18em;
  padding: 8px 20px;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(212,175,55,0.25);
  margin-bottom: 5px;
}
.title-top {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 58px;
  line-height: 1.1;
  color: #fff;
  letter-spacing: -0.01em;
}
.arrow {
  font-size: 48px;
  color: #D4AF37;
  line-height: 1;
  margin: 4px 0;
}
.title-bottom {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 80px;
  line-height: 1.05;
  color: #D4AF37;
  text-shadow: 0 4px 24px rgba(212,175,55,0.3);
  letter-spacing: 0.02em;
}
.desc {
  font-size: 21px;
  line-height: 1.6;
  color: #d7e7df;
  max-width: 680px;
  margin-top: 10px;
}
.footer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2;
}
.url {
  font-weight: 800;
  color: #fff;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(212,175,55,0.45);
  border-radius: 999px;
  font-size: 23px;
  padding: 14px 36px;
  letter-spacing: 0.05em;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.arab {
  font-family: 'Amiri', serif;
}
`;

function getHtml(format, lang) {
  let formatStyle = "";
  if (format === "carre") {
    formatStyle = `
      width: 1080px;
      height: 1080px;
      padding: 75px 60px;
    `;
  } else {
    // story 9:16
    formatStyle = `
      width: 1080px;
      height: 1920px;
      padding: 180px 70px;
    `;
  }

  const badgeText = "CHALLENGE INTERNATIONAL";
  let titleTop = "";
  let titleBottom = "";
  let desc = "";

  if (lang === "fr") {
    titleTop = "ON REPART À 0";
    titleBottom = "VERS LE MILLIARD";
    desc = "Le compteur global de la Dahira KSN est réinitialisé. Rejoignez le challenge spirituel collectif pour atteindre ensemble 1 milliard de Prières sur le Prophète <span class='arab'>ﷺ</span>.";
  } else {
    // Wolof
    titleTop = "DAÑUY TÀMBALEE CI NÉEN";
    titleBottom = "JËM CI MILYAAR BI";
    desc = "Limu Dahira KSN bi dellu na ci néen. Bokk lëna ci wooté bi ngir ñu ànd àttan 1 milyaar ciy Selal ci kaw Yonent bi <span class='arab'>ﷺ</span>.";
  }

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  ${FONTS}
  <style>
    ${CSS_BASE}
  </style>
</head>
<body>
  <div class="container" style="${formatStyle}">
    <div class="glow-top"></div>
    <div class="glow-bottom"></div>
    <div class="pattern"></div>
    
    <!-- Top Logotype and Kicker -->
    <div class="logo-box">
      <img class="logo" src="${LOGO}" alt="Logo KSN">
      <div class="kicker">Kippangog Salaatu 'Alaa Nabii</div>
    </div>
    
    <!-- Main announcement content -->
    <div class="middle-box">
      <div class="badge">${badgeText}</div>
      <h1 class="title-top">${titleTop}</h1>
      <div class="arrow">↓</div>
      <h1 class="title-bottom">${titleBottom}</h1>
      <p class="desc">${desc}</p>
    </div>
    
    <!-- Footer Branding -->
    <div class="footer-box">
      <div class="url">salaatualaanabii.com</div>
    </div>
  </div>
</body>
</html>`;
}

async function renderToPng(browser, html, opts) {
  const { width, height, dsf = 2, out } = opts;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dsf });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 450));
  await page.screenshot({ path: out });
  await page.close();
  console.log("  ✓ Exported:", out);
}

async function run() {
  console.log("Starting visual generation for launch...");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-color-profile=srgb"],
  });
  try {
    // 1) French Square
    await renderToPng(browser, getHtml("carre", "fr"), {
      width: 1080,
      height: 1080,
      dsf: 2,
      out: join(VIS, "lancement_fr_carre.png"),
    });

    // 2) French Story
    await renderToPng(browser, getHtml("story", "fr"), {
      width: 1080,
      height: 1920,
      dsf: 2,
      out: join(VIS, "lancement_fr_story.png"),
    });

    // 3) Wolof Square
    await renderToPng(browser, getHtml("carre", "wo"), {
      width: 1080,
      height: 1080,
      dsf: 2,
      out: join(VIS, "lancement_wo_carre.png"),
    });

    // 4) Wolof Story
    await renderToPng(browser, getHtml("story", "wo"), {
      width: 1080,
      height: 1920,
      dsf: 2,
      out: join(VIS, "lancement_wo_story.png"),
    });
  } finally {
    await browser.close();
  }
  console.log("Visual generation completed successfully!");
}

run().catch((e) => {
  console.error("Visual generation failed:", e);
  process.exit(1);
});
