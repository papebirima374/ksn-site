import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "kit-assets", "visuels", "compte-a-rebours");
mkdirSync(OUT, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const dataUri = (p) =>
  "data:image/png;base64," + readFileSync(p).toString("base64");

const LOGO = dataUri(join(ROOT, "public", "logo", "ksn-logo.png"));

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;600;700;800&family=Amiri:wght@400;700&display=swap" rel="stylesheet">`;

const CITATIONS = [
  {
    day: 17,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "Accorde Ta Prière et Ton Salut tout le temps à Celui dans la Nuit de la Naissance de qui on a banni les pécheurs endurcis.",
    wo: "Sinal ciy ñaan ak jàmm ci kaw Ki nga xam ne, ci Guddi Juddu gu am, dañu fa dàkkoon mbooleem ab bàkkaarkat."
  },
  {
    day: 16,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "La Nuit de la Naissance du Prophète est la Nuit de l’anéantissement, la Nuit de la dissipation de la peine et de la purification des gens entachés de péchés.",
    wo: "Guddi Juddu Yonent bi, guddi gu dakkal mbooleem lor la, di guddi gu raxas ñi amon ay bàkkaar."
  },
  {
    day: 15,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "La Nuit de la délivrance, de la prospérité accompagnée de joie et de réussite, celle de l’avantage et de la vertu, avec l’éloignement du tourment.",
    wo: "Guddi gu muslay la, gu wërsëg ànd ak mbégte ak raw, di guddi gu teeñe ak baax, te soreel nañu fi coono."
  },
  {
    day: 14,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "A rayonné, au Moment où naquit le Meilleur Prophète Une Lumière Sublime par laquelle celui qui se trouvait dans la Mecque apercevait le Palais de César.",
    wo: "Leeraay gu kawe feeñ na ci saasa bi gën ji mbindéef juddoo, ba ñi nekkoon Makk gu tedd gi doon séen kër u Réwum Sézar."
  },
  {
    day: 13,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "Accorde Prière et Salut à Celui qui a obtenu une Naissance qui a dénoncé les jaloux dans le camp d’un autre que nous.",
    wo: "Sinal ciy ñaan ak jàmm ci kaw Ki am juddu gu feeñal ñi koy kiñaanal ci suñu wut."
  },
  {
    day: 12,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "Sa Naissance est Glorieuse, Bénite et Respectueuse ; sa célébration est obligatoire pour tout chef.",
    wo: "Juddoom gu tedd la, gu am barke te mag, te féetali ko ab wareef la ci mbooleem kilifa."
  },
  {
    day: 11,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "Quiconque célèbre la Naissance de notre Prophète qui est la Porte de la Bonne Guidée, point il ne sera soumis au Règlement des Comptes Demain.",
    wo: "Kép ku màggal Juddu suñu Yonent bi nga xam ne mooy buntu njub gi, du ñu ko layal euleuk ca jàll bi."
  },
  {
    day: 10,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "Celui qui assiste à l’Anniversaire de la Naissance de la Meilleure des créatures... il ne rencontrera pas de malheur le Jour du Rassemblement des Communautés.",
    wo: "Kép ku tew ci màggal Juddu gën ji mbindéef... du dal ciy coono Bis bu ñuy dajale mbooleem nit ñi."
  },
  {
    day: 9,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "La vivification de la célébration de la Naissance de l’Annonciateur des Bonnes Nouvelles protège les familles et les demeures.",
    wo: "Dundal màggal Juddu Yaye xibaar yu neex yi dafay aar keur yi ak ñi fa dëkk."
  },
  {
    day: 8,
    source: "Serigne Touba — Jazbul Qulob",
    fr: "Il est manifestement la Plus Parfaite des créatures, du point de vue Physique et Moral ; jamais on n’a vu et point on ne verra son égal.",
    wo: "Moom mooy gën ji mbindéef ci melokan ak jikko ; kenn musu ko yemal te du ñu yem euleuk."
  },
  {
    day: 7,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Tout homme de science, d’action ou de mérite est impuissant à égaler l’Elu le Plus Pur (Al Muçtafâ) dans son Caractère qui est Hautement Sublime.",
    wo: "Mbooleem boroom xam-xam ak jëf mënul yem ak gën ji mbindéef (Al Muçtafâ) ci jikkom gu kawe gi."
  },
  {
    day: 6,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Il est un Prophète à la Dignité Incommensurable bien connue, c’est Lui l’Elu le Plus Pur (Al Muçtafâ), le Choisi le Meilleur (Al Mukhtâr) et c’est Lui en vérité le Désigné.",
    wo: "Nék na Yonent bu tedd bu am daraja bu mag, mooy Al Muçtafâ, gën ji mbindéef te mooy Ki ñu tànn."
  },
  {
    day: 5,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Sa Prophétie a existé avant la création; il avait donc une Primauté alors que l’Aïeul Adam était latent dans la boue.",
    wo: "Yonentam amoon na laata mbindéef yi ; amoon na daraja laata sunu baay Aadam di nekk ci ban."
  },
  {
    day: 4,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Il est le Secourable, le Très-Glorieux, il est Celui qui fait parvenir (à DIEU) celui qui se dirige vers Lui, Il est Eminent, Précellent.",
    wo: "Moom mooy dimbalikayt bi, Tedd-nga bi, di kiy àndal jëm ci Yàlla képp ku jëm ci moom, di ku tedd."
  },
  {
    day: 3,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Tu es Honorable, Tu es Au-Dessus de tous, ô Meilleur Envoyé ! que la Prière dont la suavité de l’odeur est au-dessus de celle du musc se répande sur Toi.",
    wo: "Tedd nga te kawe nga ñépp, yaay gën ji ndaw ! Na ñaan gu mel ni misk sotti ci yaw."
  },
  {
    day: 2,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Tu as la Primauté et la Précellence, ô Toi le Meilleur Seigneur Auprès de l’UNIQUE DOMINATEUR, le MAITRE TRES-HAUT des créatures !",
    wo: "Yaa am daraja ak tedd-nga gu kawe, yaay kilifa gu mag ca kanam Yàlla, Ku tedd ki."
  },
  {
    day: 1,
    source: "Serigne Touba — Muqadammatul Amdah",
    fr: "Point une créature n’est semblable à Mouhammad, le Choisi le Meilleur (Al Mukhtâr) sur Lui les deux Saluts de CELUI Qui Détient le Commandement et le Jugement.",
    wo: "Kenn yemul ak Mouhammad, gën ji mbindéef (Al Mukhtâr) ciy ñaan ak jàmm yu sotti ci moom."
  }
];

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
  width: 800px;
  height: 800px;
  top: -300px;
  border-radius: 50%;
  filter: blur(100px);
  background: rgba(212, 175, 55, 0.14);
  z-index: 1;
}
.glow-bottom {
  position: absolute;
  width: 600px;
  height: 600px;
  bottom: -200px;
  border-radius: 50%;
  filter: blur(90px);
  background: rgba(15, 124, 85, 0.22);
  z-index: 1;
}
.pattern {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 40 40'%3E%3Cpath d='M20 0l6 6-6 6-6-6zM0 20l6 6-6 6zM40 20l-6 6 6 6zM20 40l6-6-6-6-6 6z' fill='%23D4AF37'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  z-index: 1;
}
.header-box {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;
}
.mini-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid #D4AF37;
}
.header-title {
  color: #D4AF37;
  font-weight: 800;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-size: 11px;
}
.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin: auto 0;
  max-width: 90%;
}
.day-circle {
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 50%;
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  backdrop-filter: blur(5px);
  margin-bottom: 35px;
}
.day-badge {
  color: #D4AF37;
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  text-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
}
.day-label {
  font-weight: 700;
  text-transform: uppercase;
  color: #d7e7df;
  letter-spacing: 0.15em;
}
.quote-text {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 700;
  color: #fff;
  line-height: 1.5;
  letter-spacing: -0.01em;
}
.ornement-svg {
  width: 60px;
  height: 15px;
  fill: #D4AF37;
  opacity: 0.8;
  margin: 25px 0 20px;
}
.source-text {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #D4AF37;
  text-transform: uppercase;
}
.footer-box {
  z-index: 2;
}
.url {
  font-weight: 800;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-radius: 999px;
  font-size: 19px;
  padding: 10px 28px;
  letter-spacing: 0.05em;
}
.arab {
  font-family: 'Amiri', serif;
}
`;

function getHtml(dayObj, format, lang) {
  let formatStyle = "";
  let quoteSize = "";
  let circleSize = "";
  let badgeSize = "";
  let labelSize = "";

  if (format === "carre") {
    formatStyle = `width: 1080px; height: 1080px; padding: 65px 60px;`;
    quoteSize = `font-size: 34px; max-width: 900px;`;
    circleSize = `width: 130px; height: 130px; margin-bottom: 25px;`;
    badgeSize = `font-size: 58px;`;
    labelSize = `font-size: 11px; margin-top: -4px;`;
  } else {
    // story 9:16
    formatStyle = `width: 1080px; height: 1920px; padding: 160px 75px;`;
    quoteSize = `font-size: 42px; max-width: 860px;`;
    circleSize = `width: 160px; height: 160px; margin-bottom: 45px;`;
    badgeSize = `font-size: 72px;`;
    labelSize = `font-size: 13px; margin-top: -6px;`;
  }

  const quote = lang === "fr" ? dayObj.fr : dayObj.wo;
  const wordJour = lang === "fr" ? "JOUR" : "FÀNN";

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
    
    <!-- Top Header -->
    <div class="header-box">
      <img class="mini-logo" src="${LOGO}" alt="KSN">
      <div class="header-title">Dahira Kippangog Salaatu 'Alaa Nabii</div>
    </div>
    
    <!-- Content -->
    <div class="center-box">
      <div class="day-circle" style="${circleSize}">
        <span class="day-badge" style="${badgeSize}">J-${dayObj.day}</span>
        <span class="day-label" style="${labelSize}">${wordJour}</span>
      </div>
      <p class="quote-text" style="${quoteSize}">« ${quote} »</p>
      
      <!-- Calligraphic separator -->
      <svg class="ornement-svg" viewBox="0 0 100 20">
        <path d="M10,10 Q50,0 90,10 Q50,20 10,10 Z M45,10 A5,5 0 1,1 55,10 A5,5 0 1,1 45,10" />
      </svg>
      
      <span class="source-text">${dayObj.source}</span>
    </div>
    
    <!-- Footer -->
    <div class="footer-box">
      <div class="url">salaatualaanabii.com</div>
    </div>
  </div>
</body>
</html>`;
}

async function renderToPng(browser, html, out, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 450));
  await page.screenshot({ path: out });
  await page.close();
}

async function run() {
  console.log("Starting visual generation for the 17-day countdown...");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-color-profile=srgb"],
  });

  try {
    for (const c of CITATIONS) {
      console.log(`Generating Day J-${c.day}...`);
      
      // 1) French Square
      await renderToPng(
        browser,
        getHtml(c, "carre", "fr"),
        join(OUT, `J${c.day}_fr_carre.png`),
        1080,
        1080
      );
      console.log(`  ✓ FR Square`);

      // 2) French Story
      await renderToPng(
        browser,
        getHtml(c, "story", "fr"),
        join(OUT, `J${c.day}_fr_story.png`),
        1080,
        1920
      );
      console.log(`  ✓ FR Story`);

      // 3) Wolof Square
      await renderToPng(
        browser,
        getHtml(c, "carre", "wo"),
        join(OUT, `J${c.day}_wo_carre.png`),
        1080,
        1080
      );
      console.log(`  ✓ WO Square`);

      // 4) Wolof Story
      await renderToPng(
        browser,
        getHtml(c, "story", "wo"),
        join(OUT, `J${c.day}_wo_story.png`),
        1080,
        1920
      );
      console.log(`  ✓ WO Story`);
    }
  } finally {
    await browser.close();
  }
  console.log("Countdown series generation completed successfully!");
}

run().catch((e) => {
  console.error("Countdown generation failed:", e);
  process.exit(1);
});
