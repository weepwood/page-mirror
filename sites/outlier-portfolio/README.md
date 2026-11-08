# Outlier — Investment Portfolio Management

投资组合管理单页应用(基于 [louis-outlier-table.vercel.app](https://louis-outlier-table.vercel.app/) 的 1:1 复刻,并在此基础上做了性能优化与功能补全)。

整个应用是一个自包含的单 HTML 文件(`index.html`),无构建步骤,双击或任意静态服务器即可运行。

## 功能

- **表格视图**:400 家公司、分组、多选、删除/撤销、可拖拽列宽、行高预设(紧凑/默认/舒适)、筛选排序、列显隐、CSV 导出、页脚每列聚合计算
- **Kanban 视图**:按增长状态分 5 列,卡片跨列拖拽
- **地图视图**:Leaflet + 400 标记、卫星/普通图层、标记状态筛选、公司定位
- **列表视图**:分组、排序、搜索
- 暗色模式(View Transitions 圆形展开动画)、可折叠侧边栏、AI 助手弹窗(Aether)

## 相比原站的改进

### 性能优化

| 指标 | 优化前 | 优化后 |
|---|---|---|
| 主题切换长任务 | ~4s | ~0.1–0.25s |
| 侧边栏收起/展开 | 1.2–4s | ~40ms |
| 渲染树 DOM 元素 | 27,531 | ~14,000 |

- 行级 `content-visibility: auto` + `contain-intrinsic-size`(离屏行跳过样式/布局/绘制,滚动条几何零漂移)
- 非活动视图面板挂起(detach),切换时恢复并保留过渡动画
- 主题切换移除全文档过渡风暴(reduced-motion 下直切;无 View Transitions 的浏览器排除表格行)

### 功能补全

原站约 40 个按钮无功能,现已全部实现:Kanban 视图、CSV 导出、筛选排序、列显隐、添加公司、批量备注/标签、地图标记筛选、页脚聚合计算、Aether 弹窗交互、视图复制/移除等。

## 本地运行

```bash
# 方式一:直接双击 index.html

# 方式二:任意静态服务器,例如
npx serve .
```

## 说明

- 头像来自 ui-avatars.com / pravatar.cc(随机颜色,需联网)
- `?reduced=1` 参数可关闭所有动画(页面默认开启动画,因内嵌 webview 会误报 prefers-reduced-motion)

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/outlier-portfolio`（`master@5050ce7cdc98`）
- 导入日期：2026-10-24
- 统一仓库：`weepwood/page-mirror` → `sites/outlier-portfolio/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/outlier-portfolio/` 内进行。
