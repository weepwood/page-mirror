import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectRegistryErrors } from './registry-rules.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = resolve(root, 'sites/registry.json');

if (!existsSync(registryPath)) {
  console.error('找不到 sites/registry.json');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(registryPath, 'utf8'));
} catch (error) {
  console.error('registry.json 不是有效 JSON：', error.message);
  process.exit(1);
}

const errors = collectRegistryErrors(data, root);
if (errors.length) {
  console.error(`站点清单校验失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`站点清单校验通过：${data.sites.length} 个站点。`);
