# 工程约定

本文记录 page-mirror 的基础设施：单一真源、脚本职责、命令矩阵、CI 触发与本地验证。站点验收规则见 [验收 SOP](acceptance.md)，复刻流程见 [工作流程](workflow.md)。

## 单一真源

新增功能时先确认数据来自哪里，不要在第二个地方复制一份常量。

| 关注点 | 唯一真源 | 主要消费方 |
| --- | --- | --- |
| 站点目录、分类、状态 | `sites/registry.json` | 首页、sitemap、清单校验、三份审计、404 站点推荐 |
| 自动导入边界（仅公开源） | `sites/mirror-sources.json` | `import-mirrors.mjs`、`sync-mirrors.yml` |
| 发布过滤与敏感文件规则 | `scripts/site-assets.mjs` | `build-site.mjs`、`import-mirrors.mjs`、发布过滤测试 |
| 清单字段与枚举规则 | `scripts/registry-rules.mjs` | `validate-registry.mjs`、清单测试 |
| 部署 URL 基准 | `package.json` 的 `homepage` | `sitemap.mjs`、`build-site.mjs`、`preview.mjs`、`robots.txt`、全局页面测试 |
| Node 版本 | `.node-version` | 三个工作流的 `setup-node`；`engines` 由一致性测试校验 |
| 构建产物遍历 | `scripts/scan-utils.mjs` | 三份审计脚本共用 `walkFiles` / `collectHtml` / `formatBytes` |

`404.html` 里的 `BASE` 是唯一例外：静态页面不能 import，因此保留绝对路径常量，并由测试校验它与 `homepage` 的 pathname 一致。

## 目录与职责

- `scripts/`：构建与导入（`build-site.mjs`、`import-mirrors.mjs`）、只读审计（`audit-links.mjs`、`audit-external.mjs`、`audit-build.mjs`）、校验与工具（`validate-registry.mjs`、`preview.mjs`）。
- `tests/`：每个脚本模块都有对应测试；测试不依赖真实构建产物，临时目录自给自足，因此 `npm test` 可在 `npm run build` 之前运行。
- `docs/`：`link-audit.md`、`external-assets.md`、`build-audit.md` 为自动生成报告（请勿手改），其余为手写规范。
- `sites/<slug>/`：每个镜像自成一体的静态资源；`reference/` 内的源码与本地工具脚本不会发布。

审计脚本**只读产物**：不修改任何镜像 HTML，也不在构建期合并重复资源。

## 命令矩阵

| 命令 | 作用 | 是否写文件 |
| --- | --- | --- |
| `npm run validate` | 镜像源配置 + 清单规则校验 | 否 |
| `npm test` | 全部单元测试 | 否 |
| `npm run build` | 全量构建 `.site-build/`（支持 `--only=<slug>`） | 是（忽略目录） |
| `npm run preview` | 本地模拟 GitHub Pages 子路径 | 否 |
| `npm run audit:links` | 链接健康报告 | 是（docs） |
| `npm run audit:external` | 第三方外链报告 | 是（docs） |
| `npm run audit:build` | 发布产物体检报告；`-- --check` 为只读门禁 | 可选 |
| `npm run audit` | 依次运行三份审计 | 是（docs） |
| `npm run check` | validate + test + build | 是（忽略目录） |

三个审计会刷新 `docs/` 报告，故不纳入 `npm run check`；验收前手动运行并提交结果。`audit:build -- --check` 只读，已接入 CI。

## 本地预览

    npm run build
    npm run preview
    npm run preview -- --port=8080

预览服务零外部依赖，行为贴近线上 Pages：只响应 `/page-mirror/` 子路径，缺失路径回退 `404.html` 并返回真实 404 状态，按扩展名设置 MIME，拒绝目录穿越，禁用缓存。可用于验证子路径资源、自定义 404 的站点推荐、首页筛选与分享链接；`Ctrl+C` 退出。

## CI 触发与门禁

- `pages.yml`：push 到 main（paths 白名单，含 `.node-version`）、PR、`workflow_dispatch`；`validate → deploy` 两阶段，`validate` 内依次执行 `validate`、`test`、`build`、`audit:build -- --check`。
- `sync-mirrors.yml` 只监听 `sites/mirror-sources.json`，该路径被 `pages.yml` 排除；`capture-weread.yml` 仅手动触发。两者用 `GITHUB_TOKEN` 提交不会触发 push 工作流，因此仅在确有变更时显式 `gh workflow run pages.yml --ref main`。
- 并发组按 `github.ref` 隔离 PR 与 main，`cancel-in-progress: false` 保证部署不被中途取消。
- runner 固定 `ubuntu-24.04`（不使用 `ubuntu-latest`，避免平台镜像迁移导致不可复现）；Node 由 `.node-version` 提供，npm 缓存用 `sites/*/package-lock.json` 覆盖当前及未来新增的 Vite 站点。
- 门禁分层：单元测试与 `validate` 守住清单/脚本契约，`audit:build --check` 守住产物构成与发布卫生；人工对照验收仍按 [验收 SOP](acceptance.md) 单独完成。

## 决议与边界

- 镜像 HTML 保持 1:1 原样，站内导航不自动改写；第三方外链只登记、不拦截。
- 报告文件自动生成，人工结论写进站点 README，不写进报告。
- `.gitattributes` 统一 LF、`.editorconfig` 统一缩进与 UTF-8，避免跨平台换行噪音。
- 每轮较大改动前创建 `backup/before-<主题>-<日期>` 分支，指向改动前的 HEAD，便于回退。
