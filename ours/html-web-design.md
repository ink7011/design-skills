# HTML 网页设计工艺：深色高级感门户（Dark Editorial Portal Craft）

> 沉淀自真实实践的通用工艺，与任何具体项目无关。适用于企业门户 / 落地页 / 营销站的
> HTML+CSS+vanilla JS 构建，目标是"高级感 + 克制 + 可验证"。

## 1. 风格定位：近黑编辑风

- 底色 `#050608`（近黑，非纯黑），正文 `#eceef1`，辅助灰阶 `#a8afb8 → #787f88`。
- **点缀色只用于状态，不用于装饰**（focus ring、层级标记、方向箭头），占比 < 5%。
- mono 字体只做"编辑标签"：章节号 `/ 01 — Introduction`、microcopy、角标注。
- 大标题：`clamp(46px, 7.5vw, 100px)`、`letter-spacing: -0.03em`、`text-wrap: balance`；
  其中一个关键词做白→灰纵向渐变（background-clip: text）承担"材质"。
- 全暗色在 B2B 前沿科技语境是差异化定位（竞品多是浅色企业风或深浅交替）；
  长页面单调风险用 **面板化节奏** 化解：每 4-6 个板块给一个局部微光背景区。

## 2. 信息架构骨架（业界收敛公式）

```
Hero（双 CTA：转化主按钮 + 信息次按钮）
→ 计划/产品定义 → 权益（4-5 卡）→ 信任证明（logo 墙/参考画像/案例）
→ 分级/认证体系 → 资源 → 收尾 CTA band → 申请/联系表单弹窗
```

- **导航只留一条 sticky 顶栏**：大区间（Program / Partners / Resources）+ 下拉小分区。
  双 sticky 条（全局条 + 页内锚点条）被验证为冗余，用户分不清层级。
- 顶栏右侧：语言切换 + 实心主 CTA（转化入口上移到首屏常驻位）。
- 滚动进度线放顶栏底部（2px 渐变细线），不放独立条。

## 3. 设计令牌（可直接抄）

```css
:root {
  --ink: #050608; --ink-2: #0b0d10; --paper: #fafafa;
  --fg: #eceef1; --fg-2: #a8afb8; --fg-3: #787f88;
  --line: rgba(255,255,255,.09); --line-strong: rgba(255,255,255,.18);
  --card: rgba(255,255,255,.022); --accent: #4a7dff;
  --font-sans: "Inter", -apple-system, "Segoe UI", "PingFang SC", sans-serif;
  --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
  --radius: 18px; --ease: cubic-bezier(.22,.61,.36,1);
  --nav-h: 68px;
}
```

- 字体若声明 Inter 就必须真的 `<link>` 加载（display=swap），否则删掉声明——
  "声明了没加载"是环境差异隐患。字号用 520/560/620 这类非整百字重需配可变字体。

## 4. 组件语言

### 卡片聚光灯 + 顶线划入
```css
.card::before { /* 跟随鼠标的径向高光 */
  content:""; position:absolute; inset:0; border-radius:inherit;
  background: radial-gradient(260px circle at var(--mx,-300px) var(--my,-300px),
    rgba(255,255,255,.06), transparent 65%);
  opacity:0; transition: opacity .35s; pointer-events:none;
}
.card:hover::before { opacity:1; }
.card::after { /* 顶部光线划入 */
  content:""; position:absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
  transform: scaleX(0); transform-origin:left; transition: transform .5s var(--ease);
}
.card:hover::after { transform: scaleX(1); }
```
JS 侧一条 `pointermove` 委托写 `--mx/--my`；`(hover:none)` 媒体查询跳过触屏。

### 幽灵章节数字
`<header class="sec-head" data-num="05">` + `content: attr(data-num)`、字号
`clamp(80px,9vw,132px)`、颜色 `rgba(255,255,255,.04)`、父级 `position:relative; z-index:0`、
伪元素 `z-index:-1`——低透明大数字给板块节奏，比装饰线高级。

### 分级梯（tier ladder）
每行左缘 2px 色条：顶级=白→点缀色渐变+辉光，次级=纯点缀色，再次=灰线；
未公开级整行降透明度 + 虚线"内部"胶囊。等级字母做 34px 描边方块。

## 5. 3D 品牌标志（挤出体）与红线

**红线：LOGO 本体 path 逐字等于官方 SVG 资产、fill 纯白、绘制在最后一层、
零动画零变形。** 所有"3D 感"只能加在它背后：

```svg
<!-- 4 层暗色挤出（#161b24→#070910），向右上偏移 7px 步进 -->
<g transform="translate(204 136)" fill="#070910">…官方path…</g> ×4
<!-- 扫光只 clip 在挤出层的 clipPath 内，永远不越过白面 -->
<!-- 最后：纯白官方 logo 面 -->
<g transform="translate(176 156)" fill="#FFFFFF">…官方path…</g>
```
- 整体 `filter: drop-shadow(0 34px 46px rgba(0,0,0,.55))` + 底部微弱呼吸辉光。
- **定位必须 absolute + 定宽**（clamp(300px,30vw,430px)），否则内联 SVG 撑满整宽毁首屏。
- ≤1080px 隐藏（与正文碰撞带实测在 901–1200px）；`prefers-reduced-motion` 关扫光/辉光。
- 验收：path 与官方资产做字符串比对 + "hero 内容 top < 视口高"布局断言。

## 6. 动效预算

- 入场动画模式（不与 hover transform 冲突）：
```css
.reveal { opacity: 0; }
.reveal.in { opacity: 1; animation: rise .65s var(--ease) backwards;
             animation-delay: var(--d, 0ms); }
@keyframes rise { from { opacity:0; transform: translateY(22px); } }
```
`backwards` 解决 delay 期闪现，不用 `forwards`（fill forwards 会锁死 transform 让 hover 失效）。
JS 在 observe 时按兄弟序写入 `--d`（`min(idx*70ms, 350ms)`）做 stagger。
- 全站动效上限：入场 stagger + 卡片聚光灯 + 一处材质扫光。再多是营销站气质。

## 7. 多语言工程

- 全文案走**数据驱动字典**（每语言一个对象），DOM 用 `data-i18n` 键绑定；
  `setLang` 同步 `html[lang]`、`document.title`、localStorage。
- 语言菜单用 menu 模式：`role="menu"` + `menuitemradio` + `tabindex="-1"` +
  方向键/Home/End/Escape 漫游（ARIA 承诺的键盘行为必须真实现）。
- 文案质量管线：脚本从源码 eval 提取字典 → 分块调 LanguageTool API（en/fr/de）→
  品牌词/货币/选项码过滤 → 报告落盘。中文接 pycorrector（可选），小语种标注待母语审校。
- RTL 前置清单（加阿拉伯/希伯来语前必做）：`dir="rtl"`、margin/padding 改逻辑属性、
  导航与弹窗镜像、表格列序。预估 1-1.5 天。

## 8. 交互质量门（a11y 硬标准）

- 弹窗：焦点圈闭（Tab 首尾环绕）+ ESC 关闭 + 关闭还原焦点；
  **成功态要同时隔离表单与 footer**（`visibility:hidden` + `inert`），否则可重复提交。
- 下拉/chips：roving tabindex（方向键移动 + 选中项 tabindex=0 其余 -1）。
- skip-link 跳转后 `#main.focus()`（main 加 `tabindex="-1"`）。
- 表单：条件字段（选"其他"显说明框）、空提交逐项标错并聚焦首错、
  提交成功给出本地参考号 + 诚实标注 demo 未发送。

## 9. 验证方法（血的教训）

- **JS `.click()` 会穿透 `pointer-events:none`**——移动端抽屉类 bug 必须用
  CDP `Input.dispatchMouseEvent` 真实坐标点击验证。
- 回归脚本必备**布局断言**：触发按钮不在被折叠容器内、hero 内容在折叠线上、
  装饰元素有界（position/宽度）、CTA 视觉顺序。
- 结构手术（脚本批量改 HTML）后 grep 断言标签闭合数（`</nav>` 计数）。
- CSS 用脚本插入必须 `assert anchor in css`，replace 静默失败=样式没生效但绿灯。
- 部署面：静态服务用**白名单**（只放行 index/src/assets），文档与配置目录 404。
- Builder/Reviewer 分离：实现者与审查者用不同上下文（子代理），审查者只读 +
  否定偏好，产出分级发现表。

## 10. 常见坑速查

| 坑 | 解 |
|---|---|
| 正则带 `g` 标志复用 `.test()` 结果交替 | 过滤函数里不用 `g`，或每次 `new RegExp` |
| 顶栏光学居中在 900-1060px 与两端元素碰撞 | 绝对居中断点 ≥1081px |
| `100vh` 弹窗在 iOS 地址栏收展露底 | `100dvh` 双写降级 |
| 半宽表单字段小屏被挤压 | ≤640px 显式 `max-width:none` |
| 徽章/大图无尺寸属性引发布局抖动 | `width/height` + 下方图 `loading="lazy"` |
