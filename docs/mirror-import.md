# 镜像仓库统一迁移与新增流程

## 架构

page-mirror 是 **唯一长期维护的源仓库**。各站点隔离在 sites/<slug>/，保留原版 HTML、CSS、JS、字体、图片与构建源码。首页使用 sites/registry.json 自动展示。静态项目在打包时只发布浏览器资源；Vite 项目分别安装和构建，构建结果被放进 .site-build/sites/<slug>/，互不污染。

### 首批迁移

只自动迁入已经公开的 GitHub 仓库：

- weepwood/mimo-mirror → sites/mimo-rl/（静态）
- weepwood/inftab-mirror → sites/inftab-app/（Vite）

导入操作在 main 分支配置更新后由 Import public mirror repositories 自动执行。它会 clone 公开源、复制二进制与文本资源、记录精确原提交 SHA、写入注册表，并提交到 page-mirror。之后 site 代码在本仓库直接维护，默认不会自动覆盖。需要重新导入时在 Actions 手动指定 refresh_slug；该操作会覆盖整个导入子目录，务必先检查本地改动。

**私有源仓库不会自动迁移。** page-mirror 当前公开，导入私有资源等于公开源代码和素材。确认授权及发布范围之前，请勿将私有仓库信息填写到公开配置，也不要把访问 Token 加进脚本。需要集中管理私有镜像时，应使用独立私有仓库或经明确审查后再发布。

## 继续添加 mirror

将已有的公开静态镜像登记到清单（不需要修改工作流）：

    node scripts/add-mirror.mjs --slug=sample --repo=weepwood/sample-mirror --name=Sample --sourceUrl=https://example.com/

对于使用 Vite 构建的项目：

    node scripts/add-mirror.mjs --slug=sample-app --repo=weepwood/sample-app-mirror --name=SampleApp --sourceUrl=https://example.com/ --kind=vite

默认 branch 为 main，可指定 --branch=master。提交 sites/mirror-sources.json，Action 会自动完成首次导入并更新站点目录。导入后日常改动直接在 page-mirror 的 sites/<slug>/ 中进行。新建而非迁移的站点，可使用 sites/_template 并手动登记 registry.json。

本地运行：

    node scripts/mirror-config.mjs
    node scripts/import-mirrors.mjs
    node scripts/import-mirrors.mjs --only=mimo-rl --refresh
    node scripts/validate-registry.mjs
    node --test tests/*.test.mjs
    node scripts/build-site.mjs

本地导入需要 Git、Node.js 22+；Vite 站点构建另需 npm，执行 npm ci 和 npm run build。导入器会拒绝非公开源、跨仓库重复映射、符号链接、未受管目录覆盖，过滤 .git/.github/.env、私钥及 node_modules 等文件。

## 发布与审核

- GitHub Pages 使用 .site-build/，不会把完整开发树、内部 README 或工作流当成公开网站资源。
- 每个站点以 sites/<slug>/ 作为部署根；Vite 站点应使用相对 base。
- 静态快照中的站内根绝对资源 URL 会尽可能按本地存在的资产改写为相对地址。JS 内硬编码的 /api、动态网络请求、原站路由、Service Worker scope 等仍需单站验证。
- 新导入站点一律标记 review，**不自动声称实现 1:1 或通过验收**。
- 建议逐站运行浏览器网络检查、滚动交互、移动端、资源 404 检查，再手动更新 status。
- 原有仓库发布链接保持不变。确认新页面可用和没有外部 CI 消费者后，旧仓库加迁移说明并 Archive，不删除历史。
- 上游页面的字体、图片、商标与交互代码可能涉及第三方版权；公开前必须核对许可与素材授权。
- GitHub Pages 单仓有构建与体积约束，视频、3D 与大型资源过多时应考虑外置对象存储并保持稳定 URL。
