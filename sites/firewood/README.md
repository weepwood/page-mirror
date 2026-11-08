# firewood-mirror

1:1 镜像 [screen.toys/firewood](https://screen.toys/firewood/) 的 Three.js 劈柴交互体验。

- 拖拽旋转视角，点击劈开原木
- 纯前端静态站点（无构建步骤），使用 Three.js + KTX2 压缩纹理 + 程序化音效
- 本地预览：`node serve.mjs`（需通过 HTTP 托管，不能用 file:// 直接打开）

## 在线预览

**站点地址：** https://firewood-mirror.netlify.app

## 目录结构

```
index.html
assets/      # 构建产物 + 模型/贴图/视频/音效
basis/       # KTX2 纹理解码器
serve.mjs    # 本地静态服务器（含正确 MIME）
netlify.toml # 静态部署配置
```

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/firewood-mirror`（`master@87518c11a5de`）
- 导入日期：2026-07-09
- 统一仓库：`weepwood/page-mirror` → `sites/firewood/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/firewood/` 内进行。
