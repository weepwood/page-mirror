# FeralUI recreation

A dependency-free static recreation of the public experience at **feralui.dev**, built as a single-page application with 12 interactive routes.

## Included pages

- `/pullcord` — draggable pull-cord theme switch
- `/captcha` — playable claw-machine verification concept
- `/gradients` — Japanese-inspired gradient builder
- `/scenes` — animated mobile screen gallery
- `/deskfolio` — interactive portfolio book
- `/blob` — reactive logout mascot
- `/animaps` — animated route map
- `/fur` — pointer-reactive canvas fur
- `/vacuum` — theatrical bulk deletion
- `/crumple` — paper crumple interaction
- `/hologram` — pointer-tilted foil card
- `/matchday` — football diary and ratings

## Run locally

```bash
python -m http.server 4173
```

Open `http://localhost:4173`.

## Deployment

The project contains plain HTML, CSS and JavaScript, so it can be deployed directly to GitHub Pages, Netlify, Vercel or any static host. `404.html` preserves sub-page routes on GitHub Pages.

## Attribution

This repository is an independent front-end recreation made for study and demonstration. Product names and public descriptions are attributed to the original FeralUI project by [mortspace](https://github.com/mortspace). The implementation and generated visual assets in this repository are original and do not copy the original website source code.

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/feralui`（`main@84b4567000b5`）
- 导入日期：2026-07-16
- 统一仓库：`weepwood/page-mirror` → `sites/feralui/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/feralui/` 内进行。
