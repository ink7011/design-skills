# 设计工程（SVG / Design Tokens / 视觉测试）

设计与代码交界处的公开资源。

## SVG

| 资源 | 链接 | 注解 |
|---|---|---|
| MDN SVG Tutorial | https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial | 权威入门；渐变/裁切/变换章节必读 |
| MDN: gradientUnits | https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientUnits | `userSpaceOnUse` vs `objectBoundingBox` 的语义差异（最大坑点） |
| CSS-Tricks SVG Guide | https://css-tricks.com/guides/svg/ | SVG 实战技巧合集（含 masks/clip-path 专文） |
| SVG spec (W3C) | https://www.w3.org/TR/SVG2/ | 最终裁决依据（渲染器行为冲突时查这里） |
| SVGOMG | https://jakearchibald.github.io/svgomg/ | 在线 SVG 优化器（交付前压缩） |

## Design Tokens

| 资源 | 链接 | 注解 |
|---|---|---|
| W3C Design Tokens Spec (DTCG) | https://tr.designtokens.org/ | token 格式的行业标准（多平台管道的基础） |
| Style Dictionary | https://amzn.github.io/style-dictionary/ | token → 多平台代码的构建工具（Amazon 出品） |
| Tokens Studio | https://tokens.studio/ | 设计侧 token 管理（Figma 插件生态事实标准） |
| Figma Variables 官方文档 | https://help.figma.com/hc/en-us/articles/15339657135383 | 设计文件内的 token 化原语 |

## 视觉测试 / 渲染

| 资源 | 链接 | 注解 |
|---|---|---|
| Playwright screenshot assertions | https://playwright.dev/docs/test-snapshots | 无头浏览器截图断言（视觉回归自动化） |
| Percy | https://percy.io/ | 托管式视觉回归（跨浏览器 diff） |
| Chromatic | https://www.chromatic.com/ | 组件级视觉回归 + UI review 工作流 |
| Applitools (Visual AI) | https://applitools.com/ | AI 视觉对比（减少布局抖动误报） |
| Resemble.js | https://github.com/rsmbl/Resemble.js | 本地图片 diff 库（自建流水线用） |

## 品牌资产工程

| 资源 | 链接 | 注解 |
|---|---|---|
| SVG Logo 库 (Simple Icons) | https://simpleicons.org/ | 3000+ 品牌 logo 的单色 SVG（注意各品牌使用条款） |
| Logojoy Brand Guidelines 汇编 | https://looka.com/blog/brand-guidelines-examples/ | 各大品牌 guideline 的拆解案例 |
