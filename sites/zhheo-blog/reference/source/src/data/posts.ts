export interface Post {
  id: number;
  title: string;
  category: string;
  tags: string[];
  date: string; // 展示用，如 "5天前"
  dateRaw: string; // 排序用
  excerpt: string;
  cover: string;
  isLatest?: boolean; // 最新徽章
  isUnread?: boolean; // 未读徽章
}

/** GitHub Pages 项目站点 basePath（静态资源统一加前缀） */
export const asset = (p: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;

export const posts: Post[] = [
  {
    id: 0,
    title: "报错回顾：给OpenClaw添加错误行为记忆机制，让自己写的skill不断成长",
    category: "经验分享",
    tags: ["干货", "AIGC", "OpenClaw"],
    date: "5天前",
    dateRaw: "2026-07-30",
    excerpt:
      "用过 OpenClaw 的朋友应该都遇到过这种情况：它在执行某个任务时踩了个坑，花了好大力气排查修复，结果下次又是同样的坑，它完全不记得之前是怎么爬出来的。",
    cover: "/posts/cover/cover-01.png",
    isLatest: true,
    isUnread: true,
  },
  {
    id: 1,
    title: "腾讯miora上手：设计师又又又失业的一集？",
    category: "软件推荐",
    tags: ["评测", "设计", "AI绘画"],
    date: "7/23",
    dateRaw: "2026-07-23",
    excerpt:
      "最近腾讯出了一个专门针对于设计的AI工具叫miora。像是平常做开发都有很多Claude code、codex等都很成熟了，设计行业一直属于能用但不好用的阶段。",
    cover: "/posts/cover/cover-02.webp",
    isUnread: true,
  },
  {
    id: 2,
    title: "Mac 合盖不休眠：用 pmset 彻底禁止系统睡眠",
    category: "经验分享",
    tags: ["教程", "干货", "软件"],
    date: "7/23",
    dateRaw: "2026-07-23",
    excerpt:
      "我之前一直在用 AlDente 管理 MacBook 的电池充电，设置 80% 上限之类的。但有个问题一直困扰我——AlDente 在放电的时候，macOS 会…",
    cover: "/posts/cover/cover-03.webp",
    isUnread: true,
  },
  {
    id: 3,
    title: "如何用 OpenClaw 配置早报晚报，科技新闻信源、微博热搜获取",
    category: "经验分享",
    tags: ["教程", "AIGC", "运维"],
    date: "7/20",
    dateRaw: "2026-07-20",
    excerpt:
      "话说很多人配置OpenClaw的归途就是每天发个新闻早报看看天气之类的。虽然这是一个确实很让人无语的低级用法，但是我也确实在干。我的早报一般就会放一些新闻和微博热搜。",
    cover: "/posts/cover/cover-04.webp",
    isUnread: true,
  },
  {
    id: 4,
    title: "给 SearXNG 接入豆包搜索，解决 OpenClaw 信源难题",
    category: "经验分享",
    tags: ["教程", "运维", "Docker"],
    date: "7/17",
    dateRaw: "2026-07-17",
    excerpt:
      "之前一直有个头疼的问题，就是 OpenClaw 的搜索信源。它自带的 web_search 就那么几个选择，百度搜出来的质量大家懂的，Google 又被墙了。",
    cover: "/posts/cover/cover-05.webp",
    isUnread: true,
  },
  {
    id: 5,
    title: "OpenClaw记忆系统升级：从memory-core到memory-lancedb-pro的迁移与配置",
    category: "经验分享",
    tags: ["教程", "干货", "AIGC"],
    date: "7/16",
    dateRaw: "2026-07-16",
    excerpt:
      "为什么选择 memory-lancedb-pro 最近用 OpenClaw 办事的时候，发现一个问题：龙虾经常丢记忆。比如我让它写一段歌词，它直接就写了，压根没调记忆。",
    cover: "/posts/cover/cover-06.webp",
    isUnread: true,
  },
  {
    id: 6,
    title: "screenpipe：开源本地的 AI 记忆引擎，让电脑更懂你",
    category: "软件推荐",
    tags: ["软件", "开发", "OpenClaw"],
    date: "7/16",
    dateRaw: "2026-07-16",
    excerpt:
      "最近在 B 站刷到一个小黑日报助手的视频，它能自动总结你每天做了什么、看了什么，生成日报。这个需求确实不错——现代工作环境下，我们每天在无数个标签页、聊天窗口之间切换。",
    cover: "/posts/cover/cover-07.webp",
    isUnread: true,
  },
  {
    id: 7,
    title: "混元hy3模型上手：腾讯送了云函数个人版6个月，怎么才能用上",
    category: "经验分享",
    tags: ["评测", "日常", "软件"],
    date: "7/8",
    dateRaw: "2026-07-08",
    excerpt:
      "昨天看到混元送Token了，这就迫不及待去装了，曾经小米送Token的活动还历历在目。混元这个送了10亿虽然没小米的多，但也是很大方的了。但是有一个点，就是送…",
    cover: "/posts/cover/cover-08.webp",
    isUnread: true,
  },
  {
    id: 8,
    title: "给OpenClaw加上rm删除保护：防止AI误删你的整个电脑",
    category: "经验分享",
    tags: ["教程", "Mac", "运维"],
    date: "7/7",
    dateRaw: "2026-07-07",
    excerpt:
      "本来一开始没想写这个文章，因为有点过于丢人了。但是我之前一直推荐大家用OpenClaw，我都翻车了还是本着负责任的态度说说。之前有个事故，OpenClaw 在…",
    cover: "/posts/cover/cover-09.webp",
    isUnread: true,
  },
  {
    id: 9,
    title: "豆言豆语Skill发布：让AI学会豆包的毒舌说话风格",
    category: "我的项目",
    tags: ["软件", "AIGC", "OpenClaw"],
    date: "7/2",
    dateRaw: "2026-07-02",
    excerpt:
      "前几天刷短视频，有人在模仿豆包说话，就是那种”我用最直白最不绕弯子的大白话跟你捋清楚”的调调，评论区全在刷”太像了”。我当时就想，这玩意能不能做成 OpenClaw 的 skill。",
    cover: "/posts/cover/cover-10.webp",
    isUnread: true,
  },
  {
    id: 10,
    title: "美团longcat上手：缓存免费，主打便宜，就是速度太慢，思考时间looooong",
    category: "软件推荐",
    tags: ["评测", "软件", "AIGC"],
    date: "7/2",
    dateRaw: "2026-07-02",
    excerpt:
      "美团最近搞了个新的模型叫LongCat-2.0，宣称是使用国产芯片训练的，虽然说是重要一步，但是这价格。。。这年头国产替代已经不是低价普惠的代名词了吗，咋价格…",
    cover: "/posts/cover/cover-11.webp",
    isUnread: true,
  },
  {
    id: 11,
    title: "OpenClaw Workboard 功能上手：让 Agent 自己干活，你只管盯进度",
    category: "经验分享",
    tags: ["教程", "AIGC", "OpenClaw"],
    date: "7/1",
    dateRaw: "2026-07-01",
    excerpt:
      "最近打开 OpenClaw 的网页面板，发现顶部多了一个”工作板”的入口。点进去一看，是个看板界面，有点像 Trello。研究了一下才发现这东西挺适合我平时用。",
    cover: "/posts/cover/cover-12.webp",
    isUnread: true,
  },
  {
    id: 12,
    title: "小米平板8Pro上手：便宜且流畅的好平板，安卓平板的高效令人印象深刻",
    category: "好物推荐",
    tags: ["评测", "软件", "产品"],
    date: "6/29",
    dateRaw: "2026-06-29",
    excerpt:
      "本文使用语音输入进行创作。在纠结了很长时间之后，从 iPad Air 的各代到安卓平板，最后精挑细选买下了小米平板 8 Pro。之前我用的是苹果的 iPad。",
    cover: "/posts/cover/cover-13.webp",
    isUnread: true,
  },
  {
    id: 13,
    title: "洪绘动图发布：将视频转换为帧图或者GIF并且限制只有5MB，APNG、WEBP动图生成工具",
    category: "我的项目",
    tags: ["视频", "软件", "AIGC"],
    date: "6/25",
    dateRaw: "2026-06-25",
    excerpt:
      "写公众号的都知道有一个动图生成的痛，就是5MB限制。像是我经常会给别人做一些配图等，一旦涉及到动图就需要去做压缩和转换。于是我写了一个专门处理动图的小软件，叫做…",
    cover: "/posts/cover/cover-14.webp",
  },
  {
    id: 14,
    title: "AI支付宝上手：内容全靠编，出问题甩锅给商家，付款快退款难",
    category: "软件推荐",
    tags: ["评测", "软件", "闲聊杂谈"],
    date: "6/18",
    dateRaw: "2026-06-18",
    excerpt:
      "前些天搞到了一个AI支付宝的邀请码，所以体验了几天。主要的第一点就是界面变好看了。以前的支付宝底部很多功能，但是作为一个支付工具其实根本用不太上这些东西。",
    cover: "/posts/cover/cover-15.webp",
  },
  {
    id: 15,
    title: "重要照片一定要备份，手机养成照片备份的好习惯",
    category: "经验分享",
    tags: ["教程", "干货", "Mac"],
    date: "6/17",
    dateRaw: "2026-06-17",
    excerpt:
      "今天我的一个同事打算把旧手机C用来作为工作手机，所以删除了旧手机的所有照片，并且从最近删除中把照片都删掉了。过了大概一个星期，才发现自己新手机A上的照片在不断…",
    cover: "/posts/cover/cover-16.webp",
  },
  {
    id: 16,
    title: "HeoSticker3D发布：3D形态的Heo表情，个人免费使用",
    category: "我的项目",
    tags: ["设计", "AI绘画", "产品"],
    date: "6/11",
    dateRaw: "2026-06-11",
    excerpt:
      "无意间用image2出表情的时候在想能不能弄一套3d的小黄脸表情，通用的那种，折腾了一顿提示词、大量输出、二次裁剪、处理之后，新的一套3d版本的heosticker…",
    cover: "/posts/cover/cover-17.webp",
  },
  {
    id: 17,
    title: "这才是我心目中AI博客的样子",
    category: "我的项目",
    tags: ["开发", "AIGC"],
    date: "6/9",
    dateRaw: "2026-06-09",
    excerpt:
      "博客接入AI有好久了， 从最开始的文章摘要，到后来和Tianli共同开发的PostChat洪墨AI，再到博客支持OpenClaw订阅、支持AI摘要图、播客陪读…",
    cover: "/posts/cover/cover-18.webp",
  },
  {
    id: 18,
    title: "洪绘历史记录大更新：支持根据浏览器历史记录的AI对话",
    category: "我的项目",
    tags: ["软件", "开发", "AIGC"],
    date: "6/9",
    dateRaw: "2026-06-09",
    excerpt:
      "在经历很长一段时间的优化，洪绘历史记录终于支持了全新的AI对话功能。其实这个也是我一开始做历史记录插件的核心需求之一。因为光翻列表找内容还是感觉太麻烦了。",
    cover: "/posts/cover/cover-19.webp",
  },
  {
    id: 19,
    title: "如何让OpenClaw调用你的百度网盘？百度网盘官方Skill帮你上传、下载与分享",
    category: "软件推荐",
    tags: ["教程", "日常", "干货"],
    date: "6/4",
    dateRaw: "2026-06-04",
    excerpt:
      "之前都是使用夸克网盘进行分享的，但是很多小伙伴都说没夸克网盘或者不想下夸克网盘应用。虽然夸克网盘是我的主力网盘，但是照顾到更多小伙伴方便的网盘更重要，所以研究了…",
    cover: "/posts/cover/cover-20.webp",
  },
];

/** 首页分类条：固定项 + 文章分类 */
export interface CategoryItem {
  name: string;
  icon?: string; // /img/category-bar/*.svg
  color?: string; // 高亮色
  count?: number;
}

export const fixedCategories: CategoryItem[] = [
  { name: "精选", icon: "/img/category-bar/featured.svg", color: "#2f6bff" },
  { name: "热门", icon: "/img/category-bar/hot.svg", color: "#ff4d4f" },
  { name: "必看", icon: "/img/category-bar/must-read.svg", color: "#16c2c2" },
  { name: "全部文章", icon: "/img/category-bar/all-posts.svg", color: "#ff8f1f" },
];

export const blogCategories: CategoryItem[] = [
  { name: "我的项目", count: 120 },
  { name: "经验分享", count: 366 },
  { name: "软件推荐", count: 500 },
  { name: "好物推荐", count: 72 },
  { name: "翻译内容", count: 48 },
  { name: "资源中心", count: 96 },
  { name: "佳作推荐", count: 33 },
  { name: "闲聊杂谈", count: 140 },
  { name: "转载内容", count: 27 },
  { name: "网站公告", count: 19 },
];

/** 归档 */
export const archives = [
  { year: "2026", count: 61 },
  { year: "2025", count: 89 },
  { year: "2024", count: 84 },
  { year: "2023", count: 78 },
  { year: "2022", count: 45 },
  { year: "2021", count: 33 },
  { year: "2020", count: 12 },
];

/** 标签云 */
export const tagCloud = [
  "教程",
  "干货",
  "AIGC",
  "OpenClaw",
  "软件",
  "评测",
  "设计",
  "AI绘画",
  "开发",
  "运维",
  "Docker",
  "Mac",
  "日常",
  "产品",
  "视频",
  "闲聊杂谈",
];

/** 最近评论（互动卡） */
export const recentComments = [
  { name: "阿彬", text: "感谢分享，学到了！", time: "2天前" },
  { name: "小鹿", text: "这个方法太实用了，收藏了", time: "3天前" },
  { name: "CodeMaster", text: "有没有 Windows 版本的方案？", time: "4天前" },
  { name: "雨落", text: "期待后续更新，一直在关注", time: "5天前" },
  { name: "Zero", text: "配图很好看，排版也很舒服", time: "1周前" },
];

/** 页脚社交 */
export const socials = [
  { name: "邮箱", href: "mailto:mail@zhheo.com", icon: "mail" },
  { name: "微博", href: "https://weibo.com/zhheo", icon: "weibo" },
  { name: "Twitter", href: "https://twitter.com/zhheo", icon: "twitter" },
  { name: "Dribbble", href: "https://dribbble.com/zhheo", icon: "dribbble" },
  { name: "GitHub", href: "https://github.com/zhheo", icon: "github" },
  { name: "Pinterest", href: "https://pinterest.com/zhheo", icon: "pinterest" },
  { name: "Bilibili", href: "https://space.bilibili.com/zhheo", icon: "bilibili" },
  { name: "抖音", href: "https://douyin.com/user/zhheo", icon: "douyin" },
];

/** 页脚链接列 */
export const footerLinks = [
  {
    title: "软件",
    links: ["洪绘", "洪绘历史记录", "洪绘动图", "HeoSticker", "DelSpace", "摸鱼"],
  },
  {
    title: "产品",
    links: ["洪墨AI", "比例计", "DNS测速", "HeoMusic", "轻节食", "敲木鱼"],
  },
  {
    title: "设计",
    links: ["设计分享", "设计规范", "灵感收集", "配色方案", "字体推荐"],
  },
  {
    title: "开发",
    links: ["前端笔记", "后端笔记", "效率工具", "开源项目", "技术周刊"],
  },
  {
    title: "生活",
    links: ["日常记录", "好物推荐", "数码评测", "旅行日志", "读书笔记"],
  },
  {
    title: "服务",
    links: ["关于本站", "投稿合作", "广告服务", "友情链接", "加入我们"],
  },
  {
    title: "聚合",
    links: ["文章归档", "标签云", "站点地图", "RSS订阅", "最新评论"],
  },
  {
    title: "协议",
    links: ["版权声明", "隐私政策", "免责声明", "Cookie说明"],
  },
];
