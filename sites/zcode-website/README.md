# ZCode 官网复刻（zcode.z.ai/cn）

对 ZCode 中文官网首页的 1:1 静态复刻，纯 HTML + CSS + JS 实现，无构建步骤、无框架依赖。

## 运行

```bash
cd zcode-clone
npx http-server -p 8937 -c-1
# 打开 http://127.0.0.1:8937/
```

或使用任意静态服务器（`python -m http.server`、`serve` 等）。

## 文件结构

```
zcode-clone/
├── index.html   # 页面结构（头部导航 / Hero / 应用界面 mockup / 定价 / 产品能力 / 下载 / 页脚）
├── css/style.css # 全部样式（设计变量取自原站 oklch 令牌换算）
└── js/main.js   # 交互：导航滚动态、社区下拉、移动端菜单、下载平台检测、工具块折叠
```

## 复刻内容

- **顶部导航**：sticky 透明 → 滚动后毛玻璃+描边；Logo、文档/更新日志/提交漏洞/社区（悬停下拉）、EN / 登录按钮
- **Hero**：🎉 公告胶囊、主标题、副标题、白色下载卡片（按访问平台自动切换安装包）、查看全部下载
- **应用界面 mockup**（1248×768 毛玻璃窗口）：
  - 左侧栏：新建任务/打开工作区/技能、任务分组列表（4 个工作区、活动任务高亮）
  - 中间对话列：用户消息、执行历史、工具调用块（可折叠）、终端输出、diff 摘要卡、输入框、底部终端
  - 右侧状态面板：Git tools / Goal / Progress
- **GLM Coding Plan 定价**：Lite / Pro（推荐高亮）/ Max（琥珀渐变）
- **产品能力**：三张能力卡（图片引用原站 CDN）
- **全部下载**：macOS / Windows / Linux 三列，链接指向官方 CDN 真实安装包
- **页脚**：版权、ICP 备案（悬停展开详情）、条款链接

## 实现说明

- 颜色体系取自原站 CSS 变量（`.dark` / `.hero-visual-theme` 令牌的 oklch → hex 换算）
- 字体：Geist Sans / Geist Mono（Google Fonts）
- 图片与 favicon 直接引用原站公开 CDN，需联网加载
- 响应式断点与原站一致：768px 以下隐藏侧栏/终端、堆叠卡片；1024px 以下隐藏右侧状态面板

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/zcode-website-clone`（`master@c9f4b41a34d4`）
- 导入日期：2026-10-24
- 统一仓库：`weepwood/page-mirror` → `sites/zcode-website/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/zcode-website/` 内进行。
