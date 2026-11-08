# 镜像仓库统一迁移与新增流程

## 架构

page-mirror 是 **唯一长期维护的源仓库**。各站点隔离在 sites/<slug>/，保留原版 HTML、CSS、JS、字体、图片与构建源码。首页使用 sites/registry.json 自动展示。静态项目在打包时只发布浏览器资源；Vite 项目分别安装和构建，构建结果被放进 .site-build/sites/<slug>/，互不污染。

### 首批迁移

只自动迁入已经公开的 GitHub 仓库：

- weepwood/mimo-mirror → sites/mimo-rl/（静态）
- weepwood/inftab-mirror → sites/inftab-app/（Vite）

导入操作在 main 分支配置更新后由 Import public mirror repositories 自动执行。它会 clone 公开源、复制二进制与文本资源、记录精确原提交 SHA、写入注册表，并提交到 page-mirror。之后 site 代码在本仓库直接维护，默认不会自动覆盖。需要重新导入时在 Actions 手动指定 refresh_slug；该操作会覆盖整个导入子目录，务必先检查本地改动。

**私有源仓库不会自动迁移。** page-mirror 当前公开，导入私有资源等于公开源代码和素材。请勿将私有仓库信息填写到公开配置，也不要把访问 Token 加进脚本。需要集中管理私有镜像时，应使用独立私有仓库或经明确审查后再发布。

## 一次性批量导入（2026-11-08）

在明确确认「接受公开」后，另有 17 个原私有镜像仓库通过**本地一次性脚本**迁入，未改动 `mirror-sources.json`、`import-mirrors.mjs` 或 CI 工作流。因此：

- 自动导入通道依旧只处理公开源，上述 17 个仓库不会被 Action 重新克隆或覆盖。
- 每个 `sites/<slug>/MIRROR-IMPORT.json` 记录来源仓库、分支、原提交 SHA 与导入日期，供追溯；`registry.json` 的 `sourceRepository` 与之对应，测试会校验一致性。
- 15 个纯静态镜像直接以原仓库快照作为站点根；`planes-react-clone`（Vite）与 `zhheo-blog-clone`（Next.js `output: export`）先本地构建，静态产物放在站点根，完整源码放在 `reference/source/`。构建脚本会排除 `reference/`，源码不会进入 `.site-build/`。
- Next.js 静态产物的 `basePath` / `assetPrefix` 已改为 GitHub Pages 实际子路径 `/page-mirror/sites/<slug>`，避免绝对路径在项目子路径下失效。
- 本批站点状态一律为 `review`。公开后第三方素材与商标授权、浏览器网络检查、移动端与 404 检查仍需逐站完成，才可改为 `completed`。

后续若要更新这些站点，直接修改 `sites/<slug>/`；不要改用 `--refresh`（那会按公开源重新克隆并覆盖本地改动）。

## 继续添加 mirror

将已有的公开静态镜像登记到清单（不需要修改工作流）：

    node scripts/add-mirror.mjs --slug=sample --repo=weepwood/sample-mirror --name=Sample --sourceUrl=https://example.com/

对于使用 Vite 构建的项目：

    node scripts/add-mirror.mjs --slug=sample-app --repo=weepwood/sample-app-mirror --name=SampleApp --sourceUrl=https://example.com/ --kind=vite

默认 branch 为 main，可指定 --branch=master。提交 sites/mirror-sources.json，Action 会自动完成首次导入并更新站点目录。导入后日常改动直接在 page-mirror 的 sites/<slug>/ 中进行。新建而非迁移的站点，可使用 sites/_template 并手动登记 registry.json。

本地运行（统一命令见根 package.json）：

    npm run validate
    npm test
    npm run build
    npm run build -- --only=mimo-rl
    npm run import:mirrors
    npm run import:mirrors -- --only=mimo-rl --refresh

本地导入需要 Git、Node.js 22+；Vite 站点构建另需 npm，执行 npm ci 和 npm run build。导入器会拒绝非公开源、跨仓库重复映射、符号链接与未受管目录覆盖；过滤 `.git`/`.github`/`node_modules`/`dist` 等目录，以及 `.env*`、`.npmrc`、`.pypirc`、`credentials.json`、`*.pem|key|p12|pfx|ppk` 与私钥等凭据文件（规则见 `scripts/site-assets.mjs`）。

## 发布与审核

- GitHub Pages 使用 .site-build/，不会把完整开发树、内部 README 或工作流当成公开网站资源。
- 每个站点以 sites/<slug>/ 作为部署根；Vite 站点应使用相对 base。
- 静态快照中的站内根绝对资源 URL 会尽可能按本地存在的资产改写为相对地址。JS 内硬编码的 /api、动态网络请求、原站路由、Service Worker scope 等仍需单站验证。
- 新导入站点一律标记 review，**不自动声称实现 1:1 或通过验收**。
- 建议逐站运行浏览器网络检查、滚动交互、移动端、资源 404 检查，再手动更新 status。
- 原有仓库发布链接保持不变。确认新页面可用和没有外部 CI 消费者后，旧仓库加迁移说明并 Archive，不删除历史。
- 上游页面的字体、图片、商标与交互代码可能涉及第三方版权；公开前必须核对许可与素材授权。
- GitHub Pages 单仓有构建与体积约束，视频、3D 与大型资源过多时应考虑外置对象存储并保持稳定 URL。
