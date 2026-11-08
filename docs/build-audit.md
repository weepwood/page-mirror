# 发布产物体检

> 自动生成，请勿手工编辑。运行 `npm run audit:build` 重新生成（需先 `npm run build`）；`-- --check` 为只读门禁。

本报告只读取 `.site-build/`（真正部署到 GitHub Pages 的产物），不修改任何镜像 HTML。

## 汇总

| 指标 | 数值 |
| --- | ---: |
| 文件总数 | 2442 |
| 产物总体积 | 152.0 MB |
| 根目录文件体积 | 48.5 KB |
| 已发布站点 | 23 |
| 重复内容分组 | 18 |
| 重复内容可复用空间 | 1.3 MB |
| 体积告警阈值 | 400 MB |

## 逐站点体积

| 站点 | 文件 | 体积 |
| --- | ---: | ---: |
| `makemepulse-2019` | 223 | 56.1 MB |
| `shaders` | 807 | 29.3 MB |
| `chaz-5310` | 266 | 12.5 MB |
| `arc-crm` | 115 | 10.6 MB |
| `firewood` | 49 | 9.1 MB |
| `bencho` | 230 | 8.2 MB |
| `planes-react` | 374 | 8.1 MB |
| `opencode-data` | 20 | 5.1 MB |
| `pnpm-io` | 45 | 2.9 MB |
| `zhheo-blog` | 66 | 1.8 MB |
| `icon-museum` | 34 | 1.8 MB |
| `mimo-rl` | 20 | 1.7 MB |
| `railcode` | 30 | 1.5 MB |
| `inftab-app` | 88 | 1.2 MB |
| `ccunpacked` | 29 | 880.6 KB |
| `google-homepage` | 22 | 535.1 KB |
| `outlier-portfolio` | 1 | 314.7 KB |
| `zcode-website` | 3 | 110.4 KB |
| `feralui` | 9 | 58.7 KB |
| `inftab` | 1 | 24.9 KB |
| `artcraft-apps` | 1 | 20.2 KB |
| `holo` | 1 | 17.9 KB |
| `weread` | 1 | 948 B |

## 最大的文件

| 文件 | 体积 |
| --- | ---: |
| `sites/shaders/_nuxt/7cVyfpow.js` | 3.6 MB |
| `sites/makemepulse-2019/assets/adieu/scene.glb` | 3.5 MB |
| `sites/firewood/assets/stump_v02_mesh_warm_ktx2_2048.glb` | 3.3 MB |
| `sites/opencode-data/index.html` | 2.9 MB |
| `sites/makemepulse-2019/assets/eclosion/scene.glb` | 2.8 MB |
| `sites/makemepulse-2019/assets/voyage/goose.jpg.dds` | 2.7 MB |
| `sites/makemepulse-2019/assets/adieu/new-plants-albedo.jpg.dds` | 2.0 MB |
| `sites/makemepulse-2019/assets/adieu/plants-albedo.jpg.dds` | 2.0 MB |
| `sites/makemepulse-2019/assets/adieu/rock-albedo.jpg.dds` | 2.0 MB |
| `sites/makemepulse-2019/assets/adieu/tree-albedo.jpg.dds` | 2.0 MB |

## 重复内容（按可复用空间排序）

| 份数 | 单份体积 | 可复用空间 | 路径 |
| ---: | ---: | ---: | --- |
| 76 | 5.8 KB | 434.6 KB | `sites/chaz-5310/assets/gallery/pictures/28032014.webp`、`sites/chaz-5310/assets/gallery/pictures/Image008.webp`、`sites/chaz-5310/assets/gallery/pictures/Image011.webp` 等 |
| 2 | 300.2 KB | 300.2 KB | `sites/arc-crm/opengraph-image.png`、`sites/arc-crm/twitter-image.png` |
| 3 | 54.6 KB | 109.3 KB | `sites/zhheo-blog/404/index.html`、`sites/zhheo-blog/404.html`、`sites/zhheo-blog/_not-found/index.html` |
| 2 | 93.0 KB | 93.0 KB | `sites/zhheo-blog/index.txt`、`sites/zhheo-blog/__next._full.txt` |
| 3 | 34.6 KB | 69.2 KB | `sites/makemepulse-2019/assets/audio/SCENE_1/IT-Leaves.mp3`、`sites/makemepulse-2019/assets/audio/SCENE_2/IT-Leaves.mp3`、`sites/makemepulse-2019/assets/audio/scene_transition.mp3` |
| 2 | 48.2 KB | 48.2 KB | `sites/makemepulse-2019/assets/audio/SCENE_2/IT-Bird-01.mp3`、`sites/makemepulse-2019/assets/audio/SCENE_3/IT-Bird-01.mp3` |
| 2 | 47.8 KB | 47.8 KB | `sites/makemepulse-2019/assets/audio/SCENE_2/IT-Bird-02.mp3`、`sites/makemepulse-2019/assets/audio/SCENE_3/IT-Bird-02.mp3` |
| 2 | 47.1 KB | 47.1 KB | `sites/arc-crm/_next/static/media/6c596dfcddeca1e9-s.p.woff2`、`sites/arc-crm/_next/static/media/inter-latin-wght-normal.6c596dfc.woff2` |
| 2 | 41.4 KB | 41.4 KB | `sites/makemepulse-2019/assets/audio/SCENE_2/IT-Bird-03.mp3`、`sites/makemepulse-2019/assets/audio/SCENE_3/IT-Bird-03.mp3` |
| 2 | 36.4 KB | 36.4 KB | `sites/makemepulse-2019/assets/audio/SCENE_1/IT-Liana.mp3`、`sites/makemepulse-2019/assets/audio/SCENE_2/IT-Liana.mp3` |

## 检查结论

- 必需文件：齐备
- 发布卫生：无违规文件
- sitemap：23 个站点 URL / 产物 23 个站点
- 错误：0
- 提示：0

## 说明与处置

- **错误**会阻断 `--check`（CI 门禁）：必需文件缺失、发布卫生违规、站点缺入口、sitemap 与产物不一致。
- **提示**不阻断部署：部分构建（`--only`）本就会缺少站点，重复资源与体积只是优化线索。
- 重复内容多为各镜像自带的同一份字体/脚本/贴图。按项目决议，镜像保持 1:1 独立，不在构建期合并或改写。
- 与 [链接审计](link-audit.md)、[第三方外链审计](external-assets.md) 配合阅读：本报告管产物构成与发布卫生，后两者管路径与对外请求。
