const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const failed = [];
  const consoleErrors = [];
  const apiCalls = [];
  page.on("requestfailed", (r) => failed.push(r.url() + " :: " + (r.failure()?.errorText || "")));
  page.on("response", (r) => {
    const u = r.url();
    if (u.includes("/api/")) apiCalls.push(r.status() + " " + u);
    if (r.status() >= 400 && !u.includes("/api/")) failed.push(r.status() + " " + u);
  });
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });

  await page.goto("http://127.0.0.1:11399/", { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  // wait for root to populate
  await page.waitForTimeout(4000);

  const rootHtmlLen = await page.evaluate(() => document.getElementById("root")?.innerHTML.length || 0);
  const blockCards = await page.evaluate(() => document.querySelectorAll("a[href*='/blocks/']").length);
  const h1 = await page.evaluate(() => document.querySelector("h1")?.innerText || "(none)");
  const title = await page.title();

  // try clicking first block link to see detail behavior
  let detailInfo = "n/a";
  try {
    const links = await page.$$("a[href*='/blocks/']");
    if (links.length) {
      await links[0].click();
      await page.waitForTimeout(2500);
      detailInfo = "clicked block -> url=" + page.url() + " | rootLen=" + (await page.evaluate(() => document.getElementById("root")?.innerHTML.length || 0));
    }
  } catch (e) {
    detailInfo = "click err: " + e.message;
  }

  console.log("=== RENDER REPORT ===");
  console.log("TITLE:", title);
  console.log("H1:", h1);
  console.log("ROOT_HTML_LEN:", rootHtmlLen);
  console.log("BLOCK_LINKS:", blockCards);
  console.log("DETAIL:", detailInfo);
  console.log("=== /api/ CALLS (backend-dependent) ===");
  console.log(apiCalls.join("\n") || "(none)");
  console.log("=== FAILED/4xx (non-api) ===");
  console.log(failed.filter(f => !f.includes("/api/")).join("\n") || "(none)");
  console.log("=== CONSOLE ERRORS ===");
  console.log(consoleErrors.join("\n") || "(none)");

  await browser.close();
})();
