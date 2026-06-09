import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const lang = process.argv[2] || "en";
const path = process.argv[3] || "/dahira";
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1500, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument((l) => {
  try {
    localStorage.setItem("ksn-locale", l);
    localStorage.setItem("ksn-cookie-consent", "all");
    localStorage.setItem("ksn-pwa-dismissed", "1");
  } catch (e) {}
}, lang);
await page.goto("https://salaatualaanabii.com" + path, { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3500));
const out = join(__dirname, "..", "public", "kit-assets", `lang-${lang}.png`);
await page.screenshot({ path: out });
console.log("OK", out);
await browser.close();
