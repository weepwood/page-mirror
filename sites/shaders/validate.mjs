import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/weepw/.workbuddy/binaries/node/workspace/node_modules/playwright');

const URL = 'http://127.0.0.1:' + (process.env.MIRROR_PORT || '2363') + '/';
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox']
});
const page = await browser.newPage();
const localFailed = [];
const local404 = [];
const consoleErrors = [];
const extFailed = [];
const ext4xx = [];
page.on('requestfailed', req => {
  const u = req.url();
  if (!u.includes('127.0.0.1')) extFailed.push(u + ' :: ' + (req.failure()?.errorText||''));
});
page.on('response', resp => {
  const u = resp.url();
  if (!u.includes('127.0.0.1') && resp.status() >= 400) ext4xx.push(u + ' :: ' + resp.status());
});
page.on('requestfailed', req => {
  const u = req.url();
  if (u.includes('127.0.0.1')) localFailed.push(u + ' :: ' + (req.failure()?.errorText||''));
});
page.on('response', resp => {
  const u = resp.url();
  if (u.includes('127.0.0.1') && resp.status() >= 400) local404.push(u + ' :: ' + resp.status());
});
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
try {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
} catch (e) {
  console.log('goto error (non-fatal):', e.message);
}
await page.waitForTimeout(4000);
const title = await page.title();
const bodyLen = (await page.content()).length;
console.log('TITLE:', title);
console.log('CONTENT_LEN:', bodyLen);
console.log('LOCAL_FAILED_COUNT:', localFailed.length);
localFailed.slice(0,40).forEach(x=>console.log('  LF:', x));
console.log('LOCAL_404_COUNT:', local404.length);
local404.slice(0,40).forEach(x=>console.log('  4xx:', x));
console.log('CONSOLE_ERROR_COUNT:', consoleErrors.length);
consoleErrors.slice(0,30).forEach(x=>console.log('  ERR:', x));
console.log('EXT_FAILED_COUNT:', extFailed.length);
extFailed.slice(0,20).forEach(x=>console.log('  XF:', x));
console.log('EXT_4XX_COUNT:', ext4xx.length);
ext4xx.slice(0,20).forEach(x=>console.log('  X4:', x));
await browser.close();
