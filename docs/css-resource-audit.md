# 镜像资源与部署检查

运行 `npm run build` 后可使用 `npm run audit:css -- --json` 检查内联样式、CSS 文件和 style 属性中对本地字体、图片及其他资源的引用。此工具是**只读静态检查**，无法代表实时 HTTP 请求成功、浏览器绘制正常或第三方来源已获授权。

- `root-fixable`：实际文件存在，但 CSS 仍写域名根路径，GitHub Pages 子路径会失效。
- `relative-missing`：资源使用相对路径，但镜像产物中不存在该文件。
- `root-missing`：根路径引用的资源不存在，可能属于未抓取资源或动态接口；需要逐站分析。
- `npm run audit:css -- --check`：仅对可以确定的 `root-fixable` 返回失败。缺失资源须人工核查，避免对不完整的历史快照误判并中断全部发布。

GitHub Pages 发布工作流对偶发 artifact 元数据读取失败增加了一次延时重试，保留现有产物，不重复打包。若仍失败，查看对应 Actions deploy job 日志；不要把 validate 成功误称为部署成功。
