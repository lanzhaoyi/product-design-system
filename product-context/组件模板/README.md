# 静态页面模板（html/）

纯静态 HTML 模板，用于快速生成后台具体页面。视觉与交互对齐当前仓库的实现：
Vue3 + Element Plus，设计变量取自 `src/assets/styles/**` 与 `src/layout/**`。

## 文件

| 文件 | 对应场景 | 参考的项目实现 |
| --- | --- | --- |
| `01-frame.html` | 框架页：左侧导航 + 顶部信息栏 | `src/layout/index.vue`、`Sidebar/*`、`Navbar.vue`、`AppMain.vue` |
| `02-list.html` | 标准列表：搜索 / 筛选 / 表格 / 分页 | `src/views/system/dept/index.vue`、`src/components/Pagination`、`RightToolbar` |
| `03-dialog-form.html` | 弹框表单：新增 / 编辑同一套表单 | 列表页内的 `el-dialog` + `el-form` 惯例 |
| `04-drawer-detail.html` | 侧滑详情：分组信息 + Tabs + 底部操作条 | `src/views/system/patient/detail/*`（`.detail_drawer`） |
| `05-multi-select-dialog.html` | 多选弹框：表格多选 + 已选回显 | `el-table` 多选 + `reserve-selection` |
| `assets/template.css` | 共享样式基座（设计变量 + Element Plus 覆盖 + 布局 + 通用骨架） | `src/assets/styles/element-ui.scss`、`variables.module.scss`、`sidebar.scss` |
| `assets/template.js` | 共享引导脚本：依赖加载、图标注册、`Tpl` 工具、挂载 | — |


## 打开方式

推荐用本地静态服务打开（`file://` 下 `01-frame.html` 的 iframe 在部分浏览器会被限制）：

```bash
# 在仓库根目录执行，随后访问 http://127.0.0.1:8899/html/01-frame.html
python3 -m http.server 8899
```

打开 `01-frame.html` 作为入口：点击左侧菜单或卡片，内容区通过 `?embed=1` 加载其余 4 个模板；
单独打开 `02`~`05` 任一文件也可以（页面顶部会显示模板说明，被内嵌时自动隐藏）。

依赖加载顺序：先读本地 `../node_modules`（仓库根目录 `npm install` / `pnpm install` 后可用），
失败自动回退 unpkg CDN；两者都不可用时页面渲染降级说明面板，HTML/CSS 结构仍可阅读。

## 约定

- 这些文件**不参与 Vite 构建**（构建入口只有 `index.html`），仅作参考模板，不要直接复制进 `src`。
- 页面通过 `window.__TPL_PAGE__` 传入 Vue Options API 配置，由 `assets/template.js` 挂载；
  标记必须使用 kebab-case，且组件要写**完整闭合标签**（in-DOM 模板不支持自闭合）。
- 落到真实页面时：mock 数据换成 `src/api/*` 的接口、分页沿用 `pageNum / pageSize` 与 `rows / total`、
  按钮按需补 `v-hasPermi`、请求统一走 `src/utils/request.js`，不要在本目录内新增业务代码。
- 新增模板页请复用 `assets/template.css` 的类名（`.app-container`、`.page-header`、`.toolbar`、
  `.table-card`、`.pagination-container`、`.drawer-section`、`.drawer-footer`、`.tpl-notes` 等），
  避免页面级样式与基座冲突。
