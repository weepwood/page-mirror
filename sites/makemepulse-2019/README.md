# makemepulse 2019 — "Nomadic Tribe" (1:1 镜像)

这是 https://2019.makemepulse.com/ 的 1:1 静态镜像，通过下载构建产物 + 本地重新托管实现（非从零重写）。

## 内容

- `index.html` / `main.css` / `main.js` — 原站打包产物
- `assets/` — 5 个章节（eclosion / adieu / voyage / premiere / ending）的：
  - 3D 模型：`scene.glb`、`flower.glb`、过渡 `transition_N.glb`
  - 纹理：含 DDS 压缩纹理、各章节 `textures/`
  - 数据：`splines.bin`、粒子
  - 音频：语音旁白 `.mp3` + `.srt` 字幕、章节环境循环音、UI 音效、`UI_MUSIC_STEM-1~4`
  - Gotham 字体（5 字重）、UI 图片、favicon

## 在线预览

**站点地址：** https://makemepulse-2019-mirror.netlify.app

## 本地运行

任意静态服务器即可（注意 `.glb` 需 `model/gltf-binary` MIME）：

```bash
npx serve .
# 或
python -m http.server 8080
```

# 原理与实现

## 一、原站是怎么做出来的

这是一个**纯前端的 WebGL 交互体验**，没有任何后端渲染，全部在浏览器里实时运行。分层结构如下：

| 层 | 文件 / 技术 | 职责 |
|----|------------|------|
| 外壳层 | `index.html` + `main.css` | 落地页外壳：进入按钮、加载动画、UI 图片 |
| 逻辑层 | `main.js`（约 2MB，browserify 打包） | 全部逻辑：Three.js 引擎、5 个章节、音频、字幕、事件总线 |
| 引擎层 | Three.js | 场景图 / 相机 / `WebGLRenderer` / `requestAnimationFrame` 渲染循环 |
| 硬件层 | WebGL → GPU | 着色器、压缩纹理、几何、动画的最终光栅化 |

### 资产流水线（`./assets/`）

所有素材统一在 `./assets/` 下，由 `asset_url(path)` 拼成 `./assets/<path>`：

- **3D 内容**：glTF 二进制 `.glb`（`scene.glb` 场景 + `flower.glb` 可交互花朵）
- **纹理**：DDS 压缩格式（`.jpg.dds`），直接进 GPU，省显存、加载快
- **运镜**：`splines.bin` 存相机运动曲线
- **粒子**：`particle.png` 精灵贴图
- **音频**：分三类——旁白 `mp3` + `srt` 字幕、章节环境循环音 `SCENE_1~3`、UI 音效与音乐 stem
- **字体/图片**：Gotham 字体（5 字重）、UI 图片、favicon
- **注意**：天空是纯色材质，没有独立的 skybox 文件

### 运行时流程

```
落地页(body-landing) → 点击画布进入 → loader 加载本章资产
  → 章节序列：eclosion → adieu → voyage → premiere → ending
      每章内部：加载 scene.glb + flower.glb + 纹理 + 运镜
              → 播放旁白 mp3 → 解析 .srt 字幕
              → EVENTS.SUBTITILE 事件 → .subtitles(视口固定定位) 渲染
      章节间用 transition_N.glb 做转场
  → 字幕 DOM 渲染 + UI 音效 / 音乐 stem(sound-ui 模块)
```

字幕通过 `EVENTS.SUBTITILE` 事件总线，把 SRT 解析出的文本推给一个**视口固定定位**的 DOM 元素（`.subtitles`）渲染，子元素 `.subtitles-container` 是默认 `static` 块级，祖先节点无 `transform`/`filter`，因此不会撑开文档流。

## 二、镜像是怎么"复刻"的

核心方法：**下载构建产物 + 本地重新托管**（不是从零重写）。难点在于 WebGL 站点的资源路径大多在 JS 里**动态拼接**，仅靠静态分析会漏掉大量按需加载的资产。

工作流：

1. **抓取首页**：`curl --compressed`（解 gzip）拿到 `index.html` / `main.css` / `main.js`。
2. **静态提取**：用 Python 正则扫描压缩后的 `main.js`，找出 80+ 个能确定的资源路径（GLB / 纹理 / 音频 / 字体）。
3. **无头浏览器补抓（关键）**：用 Playwright + swiftshader 软件 WebGL 真正把 5 章交互跑一遍，捕获 **163 个资源请求**，自动补齐静态分析漏掉的 **48 个动态资源**（DDS 压缩纹理、章节循环音、转场 GLB）。
4. **本地服务器验证**：Node 静态服务器正确设置 MIME（`.glb` → `model/gltf-binary`），复跑确认 **0 个 404**，最终 **236 文件 / 57MB**。
5. **部署**：`git` → GitHub 私有仓库 → Netlify（`netlify.toml` 强制 `.glb` 的 MIME），得到可公开访问的链接。

### 部署配置要点

- `netlify.toml`：`publish = "."`，并对 `assets/**/*.glb` 设置 `Content-Type: model/gltf-binary`（WebGL 加载 GLB 必需）。
- `.gitignore`：排除所有抓取/分析脚本（`*.py`、`capture*.js`、`repro*.js`、`server.js` 等）与截图，只提交静态站点。
- 已移除 `index.html` 里的 Google Analytics 外链，并在 `index.html` 中保留 `window.ga` 空 stub，避免 `main.js` 调用 `ga()` 时报错打断加载流程。

> 一句话总结：原站 = 浏览器用 Three.js 实时渲染 3D 资产 + 同步播放带字幕的旁白音频；镜像 = 把构建产物和全部资产原样下载、用正确 MIME 本地托管，再用无头浏览器实跑一遍确保"一个不漏"，最后部署到 Netlify。

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/makemepulse-2019-mirror`（`main@9fc36cfc8c09`）
- 导入日期：2026-07-09
- 统一仓库：`weepwood/page-mirror` → `sites/makemepulse-2019/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/makemepulse-2019/` 内进行。
