// Capture les pages a onglets sur localhost (mobile).
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PAGES = [
  ["/journee-salaatu", "check-tabs-journee.png", 700],
  ["/spiritualite", "check-tabs-spiritualite.png", 450],
  ["/media", "check-tabs-media.png", 450],
  ["/notre-histoire", "check-tabs-histoire.png", 450],
  ["/challenge", "check-tabs-challenge.png", 1500],
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => {
  localStorage.setItem("ksn-cookie-consent", "all");
  localStorage.setItem("ksn-pwa-dismissed", "1");
});

for (const [path, file, scrollY] of PAGES) {
  await page.goto("http://localhost:3100" + path, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 4000));
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: file });
  console.log("OK", file);
}

await browser.close();
