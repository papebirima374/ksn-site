// Capture la page /inscription (formulaire d'intégration) sur localhost.
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 1700, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => {
  localStorage.setItem("ksn-cookie-consent", "all");
  localStorage.setItem("ksn-pwa-dismissed", "1");
});
await page.goto("http://localhost:3100/inscription", { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(() => window.scrollTo(0, 500));
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "check-form.png", fullPage: false });
console.log("OK check-form.png");
await browser.close();
