# 微信读书网页版公开首页镜像

- 原站：https://weread.qq.com/
- 子项目路径：`sites/weread/`
- 复刻方式：Playwright 打开**真实原站**、等待内容加载、滚动触发懒加载、获取渲染后 DOM 与同源/腾讯 CDN 公开图片、CSS、字体；移除原站脚本后生成静态页面。
- 当前状态：**building**（已交付采集器；原站视觉快照尚未成功生成、未验收；index.html 暂为说明页）。
- 目标范围：**未登录的公开首页**。不复制账号登录、微信扫码入口的登录逻辑、不采集书架、读书笔记、付费章节、Cookie 或用户凭证。
- 页面：`/`（公开首页）；个人内容、阅读正文、付费内容不在范围内。

## 运行采集

```bash
npm install --no-save playwright
npx playwright install --with-deps chromium
node sites/weread/capture.mjs
node scripts/validate-registry.mjs
```

在仓库根目录运行。采集器仅在找到“大家都在看”或“榜单”等核心正文之后才生成快照；如果触发验证码/反爬限制则**失败退出**，不会把错误页作为成品。运行后生成：
- `sites/weread/index.html`：来自原站浏览器 DOM 的静态页面
- `sites/weread/assets/*`：公开资源的本地副本
- `sites/weread/snapshot-status.json`：采集时间、资源数量和已知限制
- `weread-reference/desktop-1440.png` 与 `mobile-390.png`：对照截图（CI 临时工件，不包含在部署站点）

注意：此技术保留真实布局，但原站 JS 已移除，依赖服务器接口的搜索、阅读、评论、排行榜排序等交互不会在静态镜像中复现。链接默认返回微信读书官方站，账号输入只应在官方站完成。

## GitHub Actions

工作流 `.github/workflows/capture-weread.yml` 支持手动执行。其动作依次为：采集、清单校验、上传截图用于人工对照、如成功则提交快照。提交后现有 Pages 工作流部署。请核对自动提交权限与平台政策，必要时在仓库设置里启用 Actions 写入权限。

## 待验收

- [ ] 真实 DOM 采集成功，且保存完整资源
- [ ] 1440×900 桌面端原站/镜像逐屏对照
- [ ] 390×844 手机端原站/镜像逐屏对照
- [ ] 检查首页所有图片、字体、栅格位置
- [ ] 原站的公开交互逐项记录可复现与不可复现项
- [ ] 浏览器控制台及资源 URL 正常
- [ ] GitHub Pages 子路径 `/page-mirror/sites/weread/` 测试通过
- [ ] 素材的对外使用许可确认

**未完成这些步骤前不得标记 completed。**

## 版权与站点身份

原站名称、商标、书封、文本属于对应权利人。公开静态快照只适用于获授权的学习研究；如对外分发，应先核实网站条款与素材许可。该项目与腾讯/微信读书无官方关联。
