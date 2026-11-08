# 镜像子项目规范

## 目录

每个站点一个目录，例如：

```text
sites/
├── registry.json
├── _template/
│   └── README.md
└── holo/
    ├── README.md
    ├── index.html
    ├── assets/
    └── ...
```

`_template` 是模板，不是可部署站点，不应登记到站点清单中。

## 注册清单

`sites/registry.json` 的顶层字段：

- `schemaVersion`: 清单结构版本，目前为 `1`。
- `sites`: 站点对象数组。

每个站点对象：

- `slug`：唯一英文标识，只允许小写字母、数字和连字符。
- `name`：目录展示名称。
- `sourceUrl`：原网站 URL。
- `description`：一句话介绍复刻范围。
- `status`：`planned`、`building`、`review`、`completed` 或 `paused`。
- `previewPath`：可选；相对于主站根目录的预览路径。默认是 `sites/<slug>/`。
- `readme`：可选；项目说明路径，默认是 `sites/<slug>/README.md`。
- `updatedAt`：可选；最后更新日期，格式为 `YYYY-MM-DD`。

示例：

```json
{
  "schemaVersion": 1,
  "sites": [
    {
      "slug": "example",
      "name": "Example 镜像",
      "sourceUrl": "https://example.com/",
      "description": "复刻首页与导航交互。",
      "status": "building",
      "previewPath": "sites/example/",
      "readme": "sites/example/README.md",
      "updatedAt": "2026-10-09"
    }
  ]
}
```

## 独立性

- 各站点应可独立阅读、测试和维护。
- 默认不跨站点共享 CSS、组件或依赖，避免某个站点的调整影响其他站点。
- 如果引入共享工具，必须保持向后兼容，并在变更中说明影响范围。
- 大型框架项目需要在 README 记录安装、开发、构建和部署命令。
- 资源路径必须适配 GitHub Pages 的仓库子路径，不能默认部署在域名根目录。
- 不提交 `.env`、访问令牌、Cookie、个人数据、`node_modules`、构建缓存或临时截图。

## 发布范围

`npm run build` 只把浏览器资源复制进 `.site-build/sites/<slug>/`，规则集中在 `scripts/site-assets.mjs`，并配有单元测试：

- **排除目录**：`.git`、`.github`、`node_modules`、`tests`、`scripts`、`reference`、`docs`、`coverage`、`dist`、`out`、`.next`，以及所有点开头的路径。
- **排除文件**：`MIRROR-IMPORT.json`、`package.json`、`package-lock.json`、`README.md`、`netlify.toml` 等工程文件；本地服务与采集脚本（`server.js`、`serve.mjs`、`shot*.js`、`verify.js`、`check.js` 等）；凭据与密钥（`.env*`、`.npmrc`、`.pypirc`、`credentials.json`、`*.pem|key|p12|pfx|ppk` 等）；sourcemap。
- **保留**：HTML/CSS/JS、图片、字体、音视频、wasm/glb、JSON/XML 数据、webmanifest，以及 Next.js 静态导出所需的 `.txt` RSC 载荷。

站点运行需要的静态数据（`feed.json`、`nav.json` 等）会被发布，因此不要把内部说明或密钥写进同名 JSON。带哈希的站点资源（如 `shots-xP4pPuRW.js`）不会被误判为本地脚本。
