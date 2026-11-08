# Page Mirror

个人网站镜像统一工作区。**每个镜像独立维护，一套目录与发布流水线统一管理。**

长期源仓库为 page-mirror，原有独立 *-mirror 仓库在迁移完成、审核与回归验收前继续保留。

## 在线入口

https://weepwood.github.io/page-mirror/

## 核心结构

- sites/registry.json：站点展示目录及验收状态。
- sites/mirror-sources.json：**公开**旧仓库的一次性迁移配置；未来可按需继续添加。
- sites/<slug>/：独立镜像的源码、静态资源、字体与图片。
- scripts/import-mirrors.mjs：克隆公开源仓库并复制完整代码、记录迁移 SHA。
- scripts/build-site.mjs：按站点类型独立构建，输出 .site-build/；支持 `--only=<slug>` 只重建单个站点。
- scripts/site-assets.mjs：发布过滤与敏感文件规则，供导入器和构建脚本共用。
- scripts/registry-rules.mjs：站点清单校验的单一真源，供校验脚本与测试共用。
- scripts/validate-registry.mjs：校验站点目录、路径、状态与导入记录一致性。
- tests/：清单规则、发布过滤与迁移记录一致性测试。
- .github/workflows/sync-mirrors.yml：首次同步及可选人工重新导入。
- .github/workflows/pages.yml：自动检查和统一 GitHub Pages 发布；其 push 路径与同步工作流互斥，避免同一提交重复部署。

## 首批迁移（自动导入，仅限公开源）

- mimo-mirror → sites/mimo-rl/（静态站点）
- inftab-mirror → sites/inftab-app/（Vue 3 / Vite）

自动导入只接受公开仓库，配置在 sites/mirror-sources.json。原有 holo、artcraft-apps、inftab、weread 项目继续存在。

## 一次性批量导入（2026-11-08）

经明确确认后，另外 17 个原私有镜像仓库已一次性迁入本公开仓库，站点清单共 23 个。15 个为纯静态镜像，planes-react-clone 与 zhheo-blog-clone 先在本地构建为静态产物再迁入，完整源码保存在各自的 `reference/source/`（不会发布到 Pages）。

- 每个导入目录含 `MIRROR-IMPORT.json`，记录来源仓库、分支、原提交 SHA 与导入日期。
- 所有新站点状态为 `review`，尚未完成逐屏对照验收。
- 这批仓库**不登记**到 `sites/mirror-sources.json`，因此自动导入 Action 不会重复克隆，也不会放宽「私有源禁止自动导入」的边界。
- 迁入后源码与第三方站点素材已随公开仓库及 GitHub Pages 对外可见；上游字体、图片、商标与交互代码的许可仍需逐站核对，详见 [镜像迁移说明](docs/mirror-import.md)。

## 添加新镜像

    node scripts/add-mirror.mjs --slug=demo --repo=weepwood/demo-mirror --name=Demo --sourceUrl=https://example.com/

普通静态网页无需改动中央部署流程；Vue/Vite 的镜像加上 --kind=vite。提交配置后 GitHub Actions 会完成首次导入，之后直接修改本仓库内 sites/<slug>/。若无需从其他仓库导入，可复制 sites/_template/ 并更新 registry.json。

## 开发与验证

需要 Node.js 22+。源仓库导入需 Git；Vite 镜像构建需 npm。统一入口在根 `package.json`：

    npm run validate                     # 镜像源配置 + 站点清单校验
    npm test                             # 单元测试
    npm run build                        # 全量构建 .site-build/
    npm run build -- --only=feralui      # 仅重建单个站点，保留其余产物
    npm run check                        # validate + test + build

构建时只把浏览器资源复制进 `.site-build/`；规则集中在 `scripts/site-assets.mjs`：`MIRROR-IMPORT.json`、`package*.json`、本地服务/采集脚本（`server.js`、`shot*.js` 等）、凭据文件、sourcemap 与 `reference/` 源码都不会发布。

详细安全边界、导入模式、私有镜像与发布验证参阅 [镜像迁移说明](docs/mirror-import.md)。完整设计对照与治理规范见 docs/。

## 验收与来源

新导入镜像默认标记 review，必须自行确认静态资源、相对路径、交互、浏览器错误、移动端表现及相关授权后，才可标记 completed。镜像属于个人学习和研究，站点的第三方版权、商标和素材授权仍归原权利人。
