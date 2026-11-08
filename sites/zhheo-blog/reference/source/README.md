# 张洪Heo 博客复刻（Next.js）

使用 `/clone-website` skill 从 https://blog.zhheo.com/ 反向工程复刻的博客首页。

## 技术栈

- **Next.js 16** (App Router, Turbopack) + **React 19** + TypeScript
- **Tailwind CSS v4** + **shadcn/ui**（设计令牌以 Heo 主题 CSS 变量 `--heo-*` 为基准）
- **next-themes**：浅色/深色主题切换（`<html class="dark">` 切换，两套 `--heo-*` 令牌）
- **lucide-react**：图标

## 快速开始

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建
npm run start    # 生产预览
```

## 已实现（首页）

- 顶部固定导航：logo + 主页下拉、4 个下拉菜单（文库/专栏/友链/我的）、右侧工具按钮组（开往/随机/搜索/AI对话/中控台/返回顶部）、主题切换、移动端汉堡菜单
- 分类条：精选/热门/必看/全部文章 + 10 个文章分类（SVG 图标 + 计数）
- 文章列表：20 张卡，三档响应式布局（>1280px 双列竖向大卡 / 768-1280px 单列横向卡 / <768px 单列竖向卡），hover 边框/阴影/封面缩放/标题变色动效
- 侧边栏：作者卡、微信卡、互动（最近评论）、标签云、归档（sticky）
- 页脚：8 组社交链接 + 8 列分类链接 + 版权/备案信息
- 浮动元素：右下音乐播放器 Dock、左下返回顶部按钮

## 目录结构

```
src/
├── app/              # layout.tsx / page.tsx / globals.css（Heo 设计令牌）
├── components/       # header / category-bar / post-card / post-list / sidebar / footer / music-dock / back-to-top / theme-provider
├── data/posts.ts     # 文章、分类、归档、标签、评论、页脚数据
public/
├── posts/cover/      # 20 张演示封面图
├── img/              # 分类 SVG、头像、音乐封面
docs/
├── research/         # PAGE_TOPOLOGY.md（页面拓扑）/ BEHAVIORS.md（交互行为）
├── design-references/ # 原站截图 + 原站 CSS + 克隆站截图
```

## 说明

- 数据为演示数据（提取自原站首页快照），文章链接 `/p/:id` 为占位。
- 原站 CSS（`docs/design-references/css/`）仅作参考用于提取设计令牌与布局规则，未直接复制。
