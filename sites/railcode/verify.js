const { chromium } = require('playwright');

(async () => {
  const PORT = process.env.PORT || 12810;
  const BASE = `http://127.0.0.1:${PORT}/`;
  const failed = [];
  const badStatus = [];
  const requested = new Set();

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist', '--no-sandbox'
    ]
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  page.on('request', r => requested.add(r.url()));
  page.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure()?.errorText || '')));
  page.on('response', r => { if (r.status() >= 400) badStatus.push(r.status() + ' ' + r.url()); });
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('goto warn:', e.message));
  // 等待 React 挂载
  await page.waitForTimeout(2500);

  const rootChildren = await page.evaluate(() => document.getElementById('root')?.childElementCount || 0);
  const hasCanvas = await page.evaluate(() => !!document.querySelector('canvas'));
  const bodyTextLen = await page.evaluate(() => document.body.innerText.trim().length);
  const headline = await page.evaluate(() => {
    const els = [...document.querySelectorAll('h1,h2')];
    return els.map(e => e.innerText).filter(Boolean).slice(0, 3);
  });

  // 模拟交互：滚动 + 点击以触发按需资源/动画
  await page.mouse.move(640, 450);
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1500);

  console.log('=== VERIFY REPORT ===');
  console.log('root children :', rootChildren);
  console.log('has canvas    :', hasCanvas);
  console.log('body text len :', bodyTextLen);
  console.log('headlines     :', JSON.stringify(headline));
  console.log('requested URLs:', requested.size);
  console.log('failed reqs   :', failed.length);
  failed.slice(0, 20).forEach(f => console.log('  FAIL:', f));
  console.log('bad status    :', badStatus.length);
  badStatus.slice(0, 20).forEach(b => console.log('  HTTP:', b));
  console.log('console errors:', consoleErrors.length);
  consoleErrors.slice(0, 20).forEach(e => console.log('  ERR :', e));

  await browser.close();
  // 把缺失/失败中属于本地 127.0.0.1 的列出（外部第三方失败可忽略）
  const localFailed = failed.filter(f => f.includes('127.0.0.1'));
  console.log('=== LOCAL FAILED (must be 0) ===', localFailed.length);
  localFailed.forEach(f => console.log('  LOCALFAIL:', f));
})();
