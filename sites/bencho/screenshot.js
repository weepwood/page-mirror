const { chromium } = require("playwright");

(async () => {
  const PORT = process.env.PORT || "11323";
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const base = `http://127.0.0.1:${PORT}`;

  await page.goto(base + "/", { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3500);
  await page.screenshot({ path: "shot-home.png", fullPage: false });

  // open first block detail
  const href = await page.evaluate(() => {
    const a = document.querySelector("a[href*='/blocks/']");
    return a ? a.getAttribute("href") : null;
  });
  if (href) {
    await page.goto(base + href, { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "shot-detail.png", fullPage: false });
    console.log("detail url:", href);
  }
  // sponsor page
  await page.goto(base + "/sponsor", { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "shot-sponsor.png", fullPage: false });

  console.log("screenshots saved");
  await browser.close();
})();
