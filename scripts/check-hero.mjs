// Capture le hero de l'accueil (desktop + mobile) sur localhost.
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3100/";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });

async function shot(viewport, file) {
  const page = await browser.newPage();
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("ksn-cookie-consent", "all");
    localStorage.setItem("ksn-pwa-dismissed", "1");
  });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 4500));
  await page.screenshot({ path: file });
  console.log("OK", file);
  await page.close();
}

await shot({ width: 1440, height: 950 }, "check-hero-desktop.png");
await shot({ width: 390, height: 844 }, "check-hero-mobile.png");

await browser.close();
