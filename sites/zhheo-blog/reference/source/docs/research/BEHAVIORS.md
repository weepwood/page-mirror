# BEHAVIORS — 交互行为清单（blog.zhheo.com，实机验证）

## 1. Header / 导航
- `#page-header` 初始 `nav-at-top`，初始化后为 `nav-fixed`：60px 高、`position: relative`、背景透明（内容区之上）；有 `--heo-shadow-nav` 阴影状态。
- 菜单（文库/专栏/友链/我的）: hover/点击展开下拉（`aria-expanded` 切换，`fas.fa-chevron-down.expand` 旋转）。
- `#blog_name` 的 `back-home-button`: 点击展开 app 下拉列表（主页/博客/图片博客/HeoBBS/… 17 项）。
- 右侧按钮（带 `heotip` 自定义 tooltip）:
  - 火车 → 开往 travellings.cn（新窗口）
  - 骰子 → `toRandomPost()` 随机文章
  - 搜索 → 打开搜索面板（`--search-bg:#f6f8fa`）
  - AI 对话 → `togglePostChatContainer()` 打开 AI 对话浮窗
  - 中控台 → `heo.toggleConsole()` 打开中控台
  - 返回顶部 → `btf.scrollToDest(0, 500)` 平滑 500ms 滚动
- 移动端: `#nav-group` 变为汉堡菜单（hamburger），点击展开全屏菜单。

## 2. 文章卡
- 整卡可点（`onclick="heo.handlePostClick(url, event)"`）。
- hover 效果（实测）:
  - 卡边框 → 1px solid 主题色 `#425AEF`（dark: `#ffc848`）
  - 卡阴影 → `rgba(66,89,239,.137) 0 8px 12px -3px`
  - 封面图 → `transform: scale(1.03)`（overflow hidden）
  - 标题 → 主题色
- 徽章: `.original`（分类）、`.lastestpost`（最新）、`.unvisited-post`（未读）。

## 3. 分类条
- 横向滚动（`overflow-x: auto`，scrollbar 隐藏）；点击分类 → 过滤文章列表（URL 参数），active 分类高亮。
- 首页加载时分类条固定项: 精选/热门/必看/全部文章 + 10 个文章分类。

## 4. 主题切换（light ↔ dark）
- 按钮: `button.darkmode_switchbutton`（导航内 + 右键菜单 `.rightMenu-item#menu-darkmode`）。
- 机制: `<html data-theme="light|dark">` 属性切换，CSS 变量两套令牌随属性切换（见 PAGE_TOPOLOGY §1）。
- 偏好持久化: localStorage（`saveToLocal.set/get`，带 ttl 过期）。
- 切换时有过渡动画（`--t` 系列变量, 0.3s）。

## 5. 侧边栏
- 作者卡: 关注按钮 hover 变化；头像圆形。
- 互动卡"最近评论": 评论弹幕滚动/淡入效果。
- 归档卡: 年份可折叠（`details`/点击展开），显示 `2026 61篇` 等计数。
- `.sticky_layout` 粘性跟随（sticky top）。

## 6. Footer
- 社交链接 hover: 主题色高亮。
- 无其他特殊交互。

## 7. 浮动元素
- 右下 Dock（300px）: 音乐播放器卡片，展开显示 APlayer 播放列表；播放按钮控制音频（`audio.heo-radio-audio`，电台流）。
- 返回顶部按钮: 滚动时出现（`needEndHide` 类控制），点击平滑回顶。
- 评论弹幕 `.comment-barrage`: 右侧垂直滚动弹幕。
- 自定义 tooltip `.custom-tooltip`: 对 `heotip` 属性元素显示。
- 右键菜单: 全屏自定义 contextmenu（含"切换深色模式""复制链接"等）。

## 8. 其他
- pace.js 顶部加载进度条（`.pace`）。
- 文章 URL 格式: `/p/xxxx.html`（Hexo permalink）。
- 移动端断点 768px: 主行变单列（侧边栏移到文章列表下方、全宽）、卡片封面变小/变形、导航变汉堡。
