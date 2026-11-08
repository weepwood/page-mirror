# PAGE_TOPOLOGY — blog.zhheo.com 首页拓扑（Phase 1 侦察产物）

> 来源：桌面 1440px 实机提取（getComputedStyle）+ 原站公开 CSS（`/zhheo/heoblogmain.css` 等，已存档于 `docs/design-references/css/`）。日期 2026-08-04。

## 0. 整体布局骨架

```
body
└─ #body-wrap.homePage.page
   ├─ header#page-header.not-top-img.nav-at-top|nav-fixed   (60px 固定)
   │  └─ nav#nav.show
   │     ├─ #nav-group
   │     │  ├─ #blog_name  (heologo + back-home-button 下拉)
   │     │  └─ 菜单: 文库 / 专栏 / 友链 / 我的   (各带 chevron-down 下拉)
   │     └─ #nav-right 按钮组
   │        ├─ .nav-button.only-home  (开往/火车: travellings_button)
   │        ├─ .nav-button            (随机文章: randomPost_button)
   │        ├─ .nav-button            (站内搜索: search-button)
   │        ├─ .nav-button            (AI 智能对话: postChatNav-button)
   │        ├─ .nav-button            (中控台: nav-console)
   │        └─ .nav-button            (返回顶部: nav-totop)
   ├─ main#content-inner.layout.layout--home   (1400px, 居中, flex column)
   │  ├─ .home-category-bar.category-in-bar    (分类条, 横向滚动)
   │  └─ .home-layout-row                      (flex row, 间距 24px)
   │     ├─ .home_barAndPosts                  (文章列表区, 1030px)
   │     │  └─ #recent-posts                   (20 张卡 + 分页, flex column gap 8px)
   │     └─ .aside-content                     (侧边栏, 300px, x=1084)
   │        ├─ .card-widget.card-info          (作者卡)
   │        ├─ .card-widget.heo-right-widget.wechat (微信卡)
   │        ├─ .card-widget.heo-right-widget.skill  (技能卡)
   │        ├─ .card-widget.card-power         (互动 > 最近评论)
   │        └─ .sticky_layout                  (粘性区: 标签云 + 归档)
   ├─ footer                                   (社交 + 8 列链接 + 版权)
   ├─ .bottom-dock.needEndHide                 (底部音乐 Dock)
   ├─ audio.heo-radio-audio
   └─ 浮动: .custom-tooltip / 右键菜单 / 评论弹幕 .comment-barrage
```

关键尺寸：内容容器 1400px 居中；主行 = 1030 + 70(间距) + 300。断点 CSS: `heoblogmw1300.css`(≤1300), `heoblogmw1200.css`(≤1200), `heoblogmw768.css`(≤768)。

## 1. 设计令牌（CSS 变量，:root + [data-theme]）

### 1.1 主题色
| 变量 | light | dark |
|---|---|---|
| `--heo-theme` (主色) | `#425AEF` | `#ffc848` |
| `--heo-theme-op` | `#4259ef23` | `#f2b94b23` |
| `--heo-theme-op-deep` | `#4259efdd` | `#f2b94bdd` |
| `--heo-blue` | `#425AEF` | `#0084FF` |
| `--heo-red` | `#d80020` | `#FF3842` |
| `--heo-pink` | `#FF7C7C` | `#d44040` |
| `--heo-green` | `#57bd6a` | `#3e9f50` |
| `--heo-yellow` | `#936900` | `#ffc93e` |
| `--heo-orange` | `#e38100` | `#ff953e` |
| `--heo-purple` | `#7a60d2` | `#7a60d2` |

### 1.2 基础表面
| 变量 | light | dark |
|---|---|---|
| `--heo-fontcolor` | `#363636` | `#F7F7FA` |
| `--heo-background` | `#f7f9fe` | `#17191d` |
| `--heo-card-bg` | `#fff` | `#1b1c20` |
| `--heo-card-border` | `#e3e8f7` | `#3d3d3f` |
| `--heo-secondtext` | `rgba(60,60,67,.8)` | `#a1a2b8` |
| `--heo-secondbg` | `#f7f7f9` | `#21232a` |
| `--heo-card-btn-bg` | `#edf0f7` | `#30343f` |
| `--heo-shadow-border` | `0 8px 16px -4px #2c2d300c` | `0 8px 16px -4px #00000050` |
| `--heo-shadow-nav` | `0 5px 12px -5px rgba(102,68,68,.05)` | `0 5px 20px 0 rgba(28,28,28,.4)` |

### 1.3 阴影/其他
```
--heo-shadow-theme: 0 8px 12px -3px var(--heo-theme-op)
--heo-shadow-main:  0 8px 12px -3px var(--heo-main-op)
--heo-logo-color:   linear-gradient(215deg, #4584ff 0%, #cf0db9 100%)
--style-border:     1px solid var(--heo-card-border)
--style-border-hover: 1px solid var(--heo-lighttext)
```
过渡: `--t` = color/background-color/border-color/opacity/transform/box-shadow 等 .3s 集合（快: .2s `--t-fast`）。

### 1.4 Dock（底部音乐播放器）
```
--heo-dock-right:20px; --heo-dock-bottom:20px; --heo-dock-width:300px;
--heo-dock-duration:.6s; --heo-dock-ease:cubic-bezier(.42,0,.3,1.11);
--heo-dock-blur:saturate(180%) blur(20px);
--heo-musicColor: var(--heo-main)
```

## 2. 字体与图标
- 字体栈（body）: `PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif`（实测 computed）；`html { font-size: 20px }`，body 16px / line-height 2。
- 图标字体: `heoblogIcon`（iconfont）、`remixicon`（subset）、FontAwesome（`fas fa-*`）。
- favicon: `/img/favicon4.0.webp`；apple-touch-icon: `/apple-touch-icon.webp`。

## 3. 区块详析

### 3.1 导航 header（60px）
- 背景透明/`rgba(0,0,0,0)`，fixed 顶部；`#nav.show`。布局: flex，左 logo 区 + 菜单，右按钮组。
- `#blog_name` 内含 heologo（渐变 logo）+ `back-home-button`（app 图标，点击展开下拉：主页/博客/图片博客/HeoBBS/敲木鱼/DNS测速/轻节食/DelSpace/比例计/摸鱼/洪墨AI/HeoMusic/公众号/图标助手/Heo/熊猫二憨/更多我的项目）。
- 菜单项: `button.site-page[aria-haspopup]`（文库/专栏/友链/我的），带 `i.fas.fa-chevron-down.expand`。
- 右按钮: 火车(开往 travellings)、骰子(随机文章)、搜索、AI 对话、中控台(dashboard 图标)、返回顶部(totop)。

### 3.2 分类条 .home-category-bar（首页特有）
- 内容: `.category-bar-item` 列表，横向可滚动。
- 项结构: `span[style*="background-image:url('/img/category-bar/*.svg')"]` 图标 + 名称 + 数量徽标。
- 固定项 + 颜色:
  - 精选 `featured.svg` `#2f6bff`
  - 热门 `hot.svg` `#ff4d4f`
  - 必看 `must-read.svg` `#16c2c2`
  - 全部文章 `all-posts.svg` `#ff8f1f`
  - 分类（10 个）: 我的项目 / 经验分享 / 软件推荐 / 好物推荐 / 翻译内容 / 资源中心 / 佳作推荐 / 闲聊杂谈 / 转载内容 / 网站公告
- SVG 已下载至 `public/img/category-bar/`。

### 3.3 文章卡 .recent-post-item（20 张）
- 结构: `div.recent-post-item[onclick=heo.handlePostClick(...)]`，flex row，高约 148px，卡片半径 12px，`--style-border` 边框 + `--heo-shadow-border` 阴影。
- 左: `.post_cover.left_radius` 216px 方形图（`.post_bg`，object-fit cover，border-radius 12px 0 0 12px）。
- 右: `.recent-post-info` padding 16px 18px：
  - `.recent-post-info-top`: `.recent-post-info-top-tips`（分类徽章 `.original` + `.lastestpost` 最新 + `.unvisited-post` 未读 徽章）+ `.article-title`（2 行省略）+ `.content` 摘要（3 行省略, `--heo-secondtext`）。
  - `.article-meta-wrap`: `.article-meta.tags`（`|` 分隔 + `标签` 链接 + `•`）+ `.post-meta-date`（`far.fa-calendar-alt` + 创建时间, 相对时间如 "5天前"）。
- hover（实测 computed）: border → `1px solid rgb(66,90,239)`（主题色），boxShadow → `rgba(66,89,239,.137) 0 8px 12px -3px`，封面图 `transform: scale(1.03)`，标题色 → 主题色。过渡 .3s。
- 列表 gap 8px。分页器在 #recent-posts 末尾。

### 3.4 侧边栏 .aside-content（300px, sticky）
模块清单：
1. `.card-widget.card-info` 作者卡: 头像（圆形, img/avatar.webp）+ 昵称"张洪Heo" + 简介 + 关注/订阅按钮。
2. `.card-widget.heo-right-widget.wechat` 微信卡（公众号卡片）。
3. `.card-widget.heo-right-widget.skill` 技能卡。
4. `.card-widget.card-power` 互动卡: 标题"互动" > "最近评论" 弹幕列表。
5. `.sticky_layout`（position sticky）: 标签云卡 + 归档卡（2026 61 篇 / 2025 89 篇 … 年份折叠）。

### 3.5 footer
- 顶部社交行: `mailto:mail@zhheo.com`、微博、Twitter、Dribbble、GitHub、Pinterest、Bilibili、抖音（图标 + 文字链接）。
- 中部分类链接列（8 组）: 软件 / 产品 / 设计 / 开发 / 生活 / 服务 / 聚合 / 协议 + 友链（含"我的朋友们"）。
- 底部版权: `©2019-2026 By 张洪Heo` + 主题版权 + `蜀ICP备19030858号-2`（备案）。

### 3.6 浮动元素
- `.bottom-dock.needEndHide`（右下 300px Dock）: 音乐播放器（当前曲目"草海"，封面 `public/img/music-cover.webp`），点击展开 APlayer 播放列表。
- 返回顶部（nav 内 + 右下）。
- `.comment-barrage` 评论弹幕（needEndHide）。
- `.custom-tooltip` 自定义 tooltip；右键菜单（含"切换深色模式" `.rightMenu-item#menu-darkmode`）。
- 主题切换按钮: `button.darkmode_switchbutton`（`<html data-theme="light|dark">` 切换）。

## 4. 页面数据（演示用，已下载至 public/）
- 20 张封面: `public/posts/cover/cover-01.png` ~ `cover-20.webp`
- 分类 SVG: `public/img/category-bar/{featured,hot,must-read,all-posts}.svg`
- favicon: `public/favicon.webp`、`public/apple-touch-icon.webp`
- 头像: `public/img/avatar.webp`；音乐封面: `public/img/music-cover.webp`
