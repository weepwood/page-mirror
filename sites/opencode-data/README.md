# opencode-data-mirror

1:1 镜像 [opencode.ai/zh/data](https://opencode.ai/zh/data) 的静态站点。

- 原站为 SolidStart + Vite 构建，全部模型/统计数据已内联在 HTML 中，无需运行时 API。
- 本仓库是镜像产物的纯静态快照：`index.html` + `/data/_build/assets/` 下的 JS/CSS/字体/SVG sprite + `banner.jpg`。
- 本地预览：用任意静态服务器以本目录为根托管，访问 `/zh/data` 或 `/`。

## 在线预览

**站点地址：** https://opencode-data-mirror.netlify.app

## 目录结构

```
.
├── index.html
├── data/
│   ├── banner.jpg
│   └── _build/assets/   # JS chunks, CSS, woff2 字体, SVG sprite
├── netlify.toml
└── _redirects
```

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/opencode-data-mirror`（`master@88ba27c3f3a2`）
- 导入日期：2026-07-09
- 统一仓库：`weepwood/page-mirror` → `sites/opencode-data/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/opencode-data/` 内进行。
