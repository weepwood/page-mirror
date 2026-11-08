const { chromium } = require('playwright');
(async () => {
  const PORT = process.env.PORT || 12810;
  const browser = await chromium.launch({ headless: true, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle', timeout: 30000 }).catch(()=>{});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'preview-top.png' });
  await page.screenshot({ path: 'preview-full.png', fullPage: true });
  console.log('screenshots saved');
  await browser.close();
})();
