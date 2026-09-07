# SVG 工艺笔记：渐变 / 裁切 / 对齐 / 导出

> 沉淀自真实实践的通用工艺，与任何具体项目无关。

## 渐变

- `gradientUnits="userSpaceOnUse"` 的坐标系是**引用该渐变的元素所处的用户空间**——
  在 `<g transform="...">` 内部引用时，坐标是元素的**局部坐标系**，不是画布坐标系。
  模板/复制粘贴渐变定义时这是第一大坑。
- 每个 SVG 文件的渐变 `id` 必须唯一；同页内嵌多个 SVG 时 id 冲突会互相劫持。
- "材质感"渐变的明暗跨度要足够大（顶部亮部到底部暗部至少 3-4 个阶梯），
  跨度太小的渐变渲染出来等于纯色，白白增加复杂度。

## 裁切

- 圆角容器内的色条/色块**必须**用 `clipPath`（引用与容器同参数的圆角矩形）裁切，
  否则方角会戳出圆角。这是纯矩形元素进入圆角容器的通病。
- 或者直接用 `path` 画出带圆角的形状，但坐标计算成本高于 clipPath。

## 文字与对齐

- **文字宽度永远实测，不要目测**：无头浏览器里 `getComputedTextLength()` 或
  `getBBox().width` 拿到精确值再写死到图形里。
- 注意 letter-spacing 的尾随空隙：Chromium 会在最后一个字符后也加 spacing，
  对齐左端没问题，对齐右端要减去一个 spacing 值。
- SVG `text` 的 `dominant-baseline` 跨渲染器行为不一，baseline 对齐用 `y` 坐标
  手工控制最稳。

## 导出

- SVG→PNG：无头浏览器打开 SVG，`page.locator("svg").screenshot()`，
  `viewport` = SVG 尺寸，`deviceScaleFactor: 2` 出 @2x，`omitBackground: true` 出透明底。
- `font-family` 写字体栈（`Inter, Arial, sans-serif`），不依赖单一字体安装。
- manifest 驱动批量导出（文件列表 json + 通用脚本），避免每加一个文件改一次脚本。

## 文件组织

- SVG 与导出的 PNG 同名成对放在同一目录
- 多变体（深/浅、多档位）共享同一骨架，差异参数集中在头部（颜色 token、文案），
  便于 diff 审查
