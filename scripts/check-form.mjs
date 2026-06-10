// Capture la page /dahira (onglets) sur localhost — mobile + desktop.
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });

async function shot(viewport, file, scrollY = 0) {
  const page = await browser.newPage();
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("ksn-cookie-consent", "all");
    localStorage.setItem("ksn-pwa-dismissed", "1");
  });
  await page.goto("http://localhost:3100/dahira", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 4000));
  if (scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise((r) => setTimeout(r, 900));
  }
  await page.screenshot({ path: file });
  console.log("OK", file);
  await page.close();
}

await shot({ width: 390, height: 844 }, "check-dahira-mobile.png", 600);
await shot({ width: 1366, height: 850 }, "check-dahira-desktop.png", 500);

await browser.close();
