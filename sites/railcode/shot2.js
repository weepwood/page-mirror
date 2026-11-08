const { chromium } = require('playwright');
(async () => {
  const PORT = process.env.PORT || 12810;
  const browser = await chromium.launch({ headless: true, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle', timeout: 30000 }).catch(()=>{});
  await page.waitForTimeout(2000);
  // 平滑滚动到中部并等待动画
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 800); await page.waitForTimeout(250); }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'preview-mid.png' });
  const textLen = await page.evaluate(() => document.body.innerText.trim().length);
  console.log('after scroll, body text len:', textLen);
  await browser.close();
})();
