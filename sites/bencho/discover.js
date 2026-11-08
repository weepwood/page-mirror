const { chromium } = require("playwright");

(async () => {
  const PORT = process.env.PORT || "11399";
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage({ viewport: { width: 1366, height: 1000 } });

  const missing = new Map(); // url -> count
  page.on("response", (r) => {
    const u = r.url();
    if (u.includes("/api/")) return;
    if (r.status() >= 400) missing.set(u, (missing.get(u) || 0) + 1);
  });
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (u.includes("/api/")) return;
    missing.set(u, (missing.get(u) || 0) + 1);
  });

  const base = `http://127.0.0.1:${PORT}`;
  console.log("== loading home ==");
  await page.goto(base + "/", { waitUntil: "load", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const rootLen = await page.evaluate(() => document.getElementById("root")?.innerHTML.length || 0);
  const blockLinks = await page.evaluate(() => document.querySelectorAll("a[href*='/blocks/']").length);
  console.log("ROOT_LEN:", rootLen, "BLOCK_LINKS:", blockLinks);

  // scroll to trigger lazy block previews
  console.log("== scrolling ==");
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await page.waitForTimeout(600);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // visit a few block detail pages
  console.log("== visiting block details ==");
  const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll("a[href*='/blocks/']")).map(a => a.getAttribute("href")).slice(0, 8));
  for (const h of hrefs) {
    await page.goto(base + h, { waitUntil: "load", timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1500);
  }

  // visit sponsor
  console.log("== visiting /sponsor ==");
  await page.goto(base + "/sponsor", { waitUntil: "load", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(500);
  }

  console.log("== visiting /pro ==");
  await page.goto(base + "/pro", { waitUntil: "load", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const list = [...missing.keys()].filter(u => !u.includes("/api/"));
  console.log("=== MISSING LOCAL ASSETS (" + list.length + ") ===");
  list.forEach(u => console.log(u));

  await browser.close();
})();
