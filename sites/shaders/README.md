# shaders-mirror

1:1 镜像复刻 [shaders.com](https://shaders.com/) —— 基于 Nuxt 的 WebGPU 着色器组件站。

## 这是什么

本仓库是 shaders.com 的**构建产物镜像**：下载了站点的静态资源（HTML、JS chunk、CSS、图片、字体），并用一个本地服务器做"静态优先 + 反向代理兜底"：

- 本地已有的文件（`/_nuxt/`、`/_fonts/`、`/images/`、`index.html` 等）直接由本地副本提供，MIME 正确；
- 本地缺失的（路由 payload、未下载资源、深层 chunk）实时反向代理到 `https://shaders.com`，保证任意子路由 / 动态数据与原站一致。

## 目录结构

```
index.html            # 首页（Nuxt SSR 产物）
server.mjs            # 本地镜像服务器（静态优先 + 反向代理）
_nuxt/                # 659 个 JS chunk + CSS + jpg + svg
_fonts/               # 41 个 woff2 字体
images/  testimonials/ # 根级图片
icon.svg  cursor.svg  # 根级 SVG
crawl.py / download*.py / localize.py / validate.mjs  # 抓取与校验脚本
```

## 运行本地镜像

需要 Node.js（推荐 22+）：

```bash
node server.mjs
```

启动后控制台会打印 `SHADERS_MIRROR_PORT=xxxx`，浏览器打开 `http://localhost:<端口>/` 即可。

## 限制（与原站一致）

- 后端 `data.shaders.com`（Supabase 数据 / 缩略图）仍走真实服务，公开内容、编辑器依赖它；
- `clerk.shaders.com`（登录鉴权）因**域名绑定**，镜像站无法复用登录态（公开浏览 / WebGPU 编辑器不受影响）；
- PostHog / Sentry 埋点在镜像环境下会报错，属正常。

## 校验

使用 Playwright 无头加载真实页面校验：本地资源 `LOCAL_FAILED=0`、`LOCAL_404=0`，标题与内容正常渲染。

```bash
MIRROR_PORT=<端口> node validate.mjs
```

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/shaders-mirror`（`main@6816f2235e9d`）
- 导入日期：2026-10-24
- 统一仓库：`weepwood/page-mirror` → `sites/shaders/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/shaders/` 内进行。
