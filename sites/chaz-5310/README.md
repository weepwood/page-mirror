# Nokia 5310 XpressMusic 3D 体验站（镜像）

对 `https://chaz.fun/phone/5310/` 的 1:1 静态镜像 —— 一个基于 Three.js / WebGL 的
Nokia 5310 XpressMusic 交互式 3D 展示页面。

## 内容

- **3D 模型**：Draco 压缩 glTF（`5310-*.bin`）
- **纹理/材质**：AO 贴图、外壳凹凸遮罩、噪点法线贴图
- **音效**：开机音、S40/S60 系统音效
- **开机动画**：`nokia_poweron-*.gif`
- **画廊**：多张 webp 样张
- **解码器**：Draco GLTF decoder（wasm + js）

## 本地预览

由于是 SPA（前端路由 `/phone/5310/`），需要一个支持 SPA 回退的静态服务器：

```bash
node server.mjs   # 内置静态服务器，含正确 MIME 与 SPA 回退
```

然后访问 `http://localhost:<port>/phone/5310/`。

## 部署

已配置 `netlify.toml`（`publish = "."` + `/* -> /index.html 200` SPA 回退），
可直接部署到 Netlify。

## 说明

本仓库仅用于技术学习与研究，所有素材版权归原站点所有。

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/chaz-5310-mirror`（`main@908c445ef20f`）
- 导入日期：2026-07-09
- 统一仓库：`weepwood/page-mirror` → `sites/chaz-5310/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/chaz-5310/` 内进行。
