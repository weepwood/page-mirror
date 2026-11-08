import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { root } from '../scripts/mirror-config.mjs';

const read = file => readFileSync(resolve(root, file), 'utf8');
const exists = file => existsSync(resolve(root, file));
const workflows = () => readdirSync(resolve(root, '.github/workflows'))
  .filter(file => file.endsWith('.yml'))
  .map(file => '.github/workflows/' + file);

test('Node 版本与 runner 由单一真源驱动，全部工作流一致', () => {
  const version = read('.node-version').trim();
  assert.match(version, /^\d+$/, '.node-version 应为纯主版本号');
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.engines.node, '>=' + version, 'engines 必须与 .node-version 一致');

  for (const file of workflows()) {
    const yml = read(file);
    assert.ok(yml.includes("node-version-file: '.node-version'"), file + ' 未使用 .node-version');
    assert.ok(!/node-version:\s*['"]?\d/.test(yml), file + ' 仍硬编码 Node 版本');
    assert.ok(yml.includes('runs-on: ubuntu-24.04'), file + ' 未固定 runner');
    assert.ok(!yml.includes('ubuntu-latest'), file + ' 不应使用浮动 runner');
  }
  const pages = read('.github/workflows/pages.yml');
  assert.ok(pages.includes("- '.node-version'"), 'Node 版本变更必须触发发布校验');
  assert.ok(pages.includes('cache-dependency-path: sites/*/package-lock.json'), 'npm 缓存应覆盖所有 Vite 站点');
});

test('npm scripts 引用的脚本与子命令都存在', () => {
  const scripts = JSON.parse(read('package.json')).scripts;
  for (const [name, command] of Object.entries(scripts)) {
    for (const match of command.matchAll(/node (scripts\/[\w.-]+\.mjs)/g)) {
      assert.ok(exists(match[1]), name + ' 引用了不存在的脚本：' + match[1]);
    }
    for (const match of command.matchAll(/npm run ([\w:.-]+)/g)) {
      assert.ok(scripts[match[1]], name + ' 引用了不存在的子命令：' + match[1]);
    }
  }
  assert.ok(scripts.preview && scripts.preview.includes('scripts/preview.mjs'));
  assert.ok(scripts.audit.includes('audit:build'));
});

test('README 与 docs 的相对链接全部指向真实文件', () => {
  const docs = readdirSync(resolve(root, 'docs'))
    .filter(file => file.endsWith('.md'))
    .map(file => 'docs/' + file);
  for (const file of ['README.md', ...docs]) {
    const text = read(file);
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].trim().split('#')[0].trim();
      if (!target || /^(?:https?:|mailto:|data:)/i.test(target)) continue;
      const path = resolve(dirname(resolve(root, file)), target);
      assert.ok(existsSync(path), file + ' 的链接失效：' + target);
    }
  }
});

test('工程规范文件与共享模块契约齐备', () => {
  for (const file of ['.editorconfig', '.gitattributes', '.node-version', 'docs/engineering.md']) {
    assert.ok(exists(file), '缺少 ' + file);
  }
  assert.match(read('.editorconfig'), /end_of_line = lf/);
  assert.match(read('.gitattributes'), /\* text=auto eol=lf/);
  assert.match(read('docs/engineering.md'), /## 单一真源/);
  for (const name of ['audit-links.mjs', 'audit-external.mjs', 'audit-build.mjs']) {
    assert.ok(read('scripts/' + name).includes("from './scan-utils.mjs'"), name + ' 未复用共享扫描模块');
  }
  assert.ok(read('scripts/preview.mjs').includes('resolveHomepage'), '预览路径必须取 homepage');
  assert.ok(read('README.md').includes('docs/engineering.md'), 'README 应链接工程约定');
});
