# Planes React Mirror

[Planes](https://useplanes.com/components/introduction) 文档站的**非官方 React + Vite 静态学习复刻**。目标是研究文档交互、布局、导航和组件展示体验，而不是提供原项目的付费组件源码。

> 本仓库由第三方维护，与 Planes / useplanes.com 官方无隶属关系。页面快照、缩略图、字体、样式和商标可能涉及第三方权利；请先核查上游许可，再考虑公开再发布或商业使用。外部链接和 AI 提示词会明确跳转官方文档。

## 运行

要求 Node.js 20.19+ 或 22.12+。推荐 Node.js 22。

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

默认使用 Vite 本地开发服务器。站点使用 HashRouter，例如 `/#/components/introduction`，不依赖服务端 SPA 路由回退。

## 已实现

- **静态文档导航**：本地 `public/nav.json` 提供 13 个分类、185 个导航节点；`public/pages/*.json` 保存对应页面 HTML 快照。
- **搜索命令面板**：Ctrl/⌘ + K，支持关键词/路由过滤、↑/↓、Home/End、Enter 跳转、Esc 退出、焦点恢复和结果数提示。
- **侧栏与缩略图**：桌面侧栏状态、悬停预览；移动端抽屉和遮罩关闭，关闭时隐藏不可聚焦的导航。
- **主题与工具**：明暗主题选择存储到 localStorage，优先遵循已保存偏好；Copy Page 与 AI assistant 链接保留。
- **失败处理**：本地页面加载失败展示错误与重试操作，不再自动把用户带离本站。
- **自动检查**：Node 内置测试校验搜索、路径、导航快照完整性；GitHub Actions 在 PR 上执行 `npm ci`、`npm test`、`npm run build`。

## 代码结构

```text
src/
  components/
    Layout.jsx        复刻页面壳层、委托事件、抽屉及页面状态
    SearchDialog.jsx  可键盘操作的命令面板
  layout/             静态 HTML 壳层快照
  lib/
    data.js           静态数据加载/验证、导航、提示词
    search.js         可单独测试的搜索逻辑
  App.jsx             HashRouter 路由
  main.jsx            入口和主题初始化
public/
  nav.json            本地导航树
  pages/              页面 HTML JSON 快照
  thumbs/             组件缩略图
tests/                node:test 自动化测试
.github/workflows/ci.yml
```

## 已知限制与后续工作

1. 页面主体和壳层目前通过 `dangerouslySetInnerHTML` 插入**仓库内受控静态快照**，它并不是完全 React 组件化的实现；如改为远程抓取内容，必须先考虑 HTML 消毒、脚本与外链隔离。
2. 动态动画 / 交互型付费演示不包含在静态 HTML 快照中，也不声称提供原版组件源码。
3. 壳层 CSS 与静态资源在当前配置下仍使用站点根路径，子目录部署（例如默认 GitHub Pages 项目路径）需要额外的资源前缀重写。
4. 目前没有视觉回归截图测试；建议逐步拆分页面壳层为 React 组件，并补充 Playwright 端到端测试。
5. 当前重点是改善**文档镜像站的浏览体验**，不是发布一个独立的可安装 UI npm 包。

## 来源与说明

- 原设计与内容参考：<https://useplanes.com/>
- 代码结构与交互实现由此学习项目维护。不要把学习复刻或静态快照视为官方授权的可商用组件库。

## React 壳层拆分（PR #2）

壳层不再以 `SHELL_A + HTML + SHELL_B` 一次性注入：

| 组件 / Hook | 职责 | 内容来源 |
| --- | --- | --- |
| `Banner.jsx` | 顶部横幅及官方价格页跳转 | JSX |
| `Sidebar.jsx` | 分类/项目导航、选中态、缩略图悬停、无障碍抽屉 | `public/nav.json` |
| `WorkspaceDock.jsx` | Dock、搜索入口、主题切换、底部渐变模糊 | JSX |
| `PageSnapshot.jsx` | 页面加载、错误与重试 UI | JSX + 受控 HTML 快照 |
| `useSnapshotInteractions.js` | 暂存的文档内部链接、Copy Page 和 AI assistant 菜单事件 | 渐进式兼容层 |
| `Layout.jsx` | 组合以上组件，负责路由、键盘、主题及侧栏状态 | React state |

**剩余迁移边界：** `public/pages/*.json` 中的正文仍使用 `dangerouslySetInnerHTML`。后续应按页面模块拆为 React/MDX，逐步移除 `useSnapshotInteractions`；不可直接将不可信远程 HTML 注入页面。

**回归重点：** 桌面/移动端侧栏、导航滚动位置、搜索快捷键、Copy Page、AI 菜单、主题偏好、静态页面宽度及 Dock 定位。目前 CI 负责单元测试和构建，尚没有浏览器截图级视觉回归。

## 正文逐类组件化（PR #3）

本次沿用原版快照作为只读参考，并完成以下十五个入口页的渐进迁移：

- **指南页**：Introduction、Installation、MCP 的页头、Copy Page、AI assistant 菜单、前后页导航均由 React 组件控制；中间复杂正文和代码示例仍保留原来的快照 HTML。
- **分类页**：AI、WebGL、Media、Carousels、Controls、Physics、Text、Sections、Charts、Heroes、Logins、Footers（全部 12 个分类）改为 `CategoryPage` React 卡片网格（由 `nav.json` 读取条目），FAQ、介绍与 Pro 标签单独保存在 `src/data/category-pages.json`。这些入口不再请求或注入分类页 HTML。
- **兼容桥接**：`useSnapshotInteractions` 不再动态生成 AI 菜单或处理 Copy Page，只维护剩余静态正文里的页面链接、锚点和代码片段复制。

技术文件：`DocsActions.jsx`、`DocsPagination.jsx`、`GuidePage.jsx`、`CategoryPage.jsx`。

目前尚未迁移组件详情页（含动态 demo / 展示 tabs），也尚未迁移其他分类。原页面正文 HTML 可能仍含大量依赖上游组件运行时的静态状态，不能视为对应动态演示的完整 React 移植。请保留现有静态快照作为回归基线，并在浏览器中分别检查十二类网格、指南顶部/底部分页、Copy Page 和 AI 菜单。

## Netlify 部署

Netlify 站点：<https://app.netlify.com/projects/planes-react-clone>，公开站点地址：<https://planes-react-clone.netlify.app/>。

项目已添加根目录 `netlify.toml`，将 Node.js 固定为 22，构建命令为 `npm run build`，发布目录为 `dist`。静态文件从 Vite 的 `public/` 自动复制到发布目录。路由使用 React Router 的 HashRouter（例如 `/#/components/introduction`），**不要额外添加重写到 `index.html` 的 SPA catch-all 规则**，以免不存在的 JSON 快照和图片错误地返回 HTML。

如果首次创建的站点尚未绑定 Git 仓库：

1. 在 [Netlify 项目后台](https://app.netlify.com/projects/planes-react-clone) 选择连接 Git 仓库（Set up continuous deployment / Link repository）。
2. 授权 Netlify 读取私有 GitHub 仓库，选择 `weepwood/planes-react-clone`，生产分支 `master`。
3. 检查 `netlify.toml` 的构建和发布目录配置后触发首次部署；以后推送 `master` 自动构建，PR 可生成 Deploy Preview。
4. 部署完成后打开根地址，以及 `/#/components/introduction` 和 `/#/components/ai` 检查首页、侧栏、字体、快照 JSON 和图片加载。

**发布提醒：** 仓库私有不代表部署内容私有；Netlify 网站默认可以被公众访问。目前在 HTML 和 Netlify 响应头添加 `noindex, nofollow`，但这不构成访问控制或版权许可。部分文档快照、字体和缩略图属于第三方内容，在公开部署前请确认相关使用和再分发权利。
