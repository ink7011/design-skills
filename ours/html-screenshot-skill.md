# HTML 截图工艺 Skill（无依赖 CDP 捕获）

> 用途：给设计评审 / PRD / 归档产出网页截图证据——全页、逐区块、移动端视口、
> 交互态（下拉/模态/成功态）。零依赖（Node 原生 WebSocket + 无头 Chrome，不需要
> Puppeteer/Playwright）。本 skill 的核心价值不在"怎么截图"，而在**五个必踩的坑
> 与防御**——每个都来自真实事故。配套审查侧见 [html-review-methodology.md](html-review-methodology.md)。

## 1. 基础设施（30 行骨架）

```js
// capture.mjs — node capture.mjs（Node ≥ 22，原生 WebSocket）
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const b = spawn(CH, ["--headless=new","--remote-debugging-port=9333",
  "--no-first-run","--user-data-dir=/tmp/cap","about:blank"],{stdio:["ignore","ignore","ignore"]});
await new Promise(r=>setTimeout(r,2000));
const ws = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const sock = new WebSocket(ws.find(t=>t.type==="page").webSocketDebuggerUrl);
let id=0; const P=new Map();
const send=(m,p={})=>new Promise(res=>{const i=++id;P.set(i,res);
  sock.send(JSON.stringify({id:i,method:m,params:p}))});
sock.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&P.has(m.id))P.get(m.id)(m.result)};
await new Promise(r=>sock.onopen=r);
// …设视口 → 导航 → 整理状态 → Page.captureScreenshot …
sock.close(); b.kill();
```

## 2. 标准流程（每张截图都走完五步）

1. **设视口并断言**（见坑 1）：`Emulation.setDeviceMetricsOverride` 后必须读
   `innerWidth` 验证等于目标值，失败重试，4 次不中就中止——不要带着错误视口按快门。
2. **导航并沉降**：`Page.navigate` → 等 2s（字体/布局/脚本就绪）。
3. **整理页面状态**（见坑 2、3）：注入动效禁用 + 强制懒加载 + 触发入场动画终态。
4. **按目标类型捕获**：
   - 视口截图：`Page.captureScreenshot({format:"png"})`（首屏/模态/交互态）。
   - 区块截图：先 `getBoundingClientRect` + scroll 偏移算页面坐标，再
     `clip:{x,y,width,height,scale:1}` + `captureBeyondViewport:true`。
   - `deviceScaleFactor:2` 出 2x 图，评审文档里更清晰。
5. **验证再入库**（见坑 5）：尺寸对不对、内容真渲染了没有。

## 3. 五个必踩的坑（核心资产）

### 坑 1 · 视口覆盖静默失效 → 截出一堆窄图
**症状**：明明设了 1440×900，截出的区块图只有 ~757px 宽，页面按窄断点渲染，
布局全错；且**同一脚本内时好时坏**。
**根因**：无头 Chrome 的 `setDeviceMetricsOverride` 偶发不生效，回退到默认窗口宽
（约 757 逻辑像素）；导航也可能重置覆盖。
**防御**（三条缺一不可）：
- 覆盖放在**导航之后**再设一次；
- 设置后**断言 `innerWidth === 目标`**，不等就重试（最多 4 次），仍失败直接抛错中止；
- 截完做**宽度审计**：桌面全节图应 ≈ 视口宽×2（2x），移动图应为移动宽×2，不符即重截。

### 坑 2 · 懒加载图未触发 → 黑块
**症状**：区块截图中 `loading="lazy"` 的图片（徽章/画廊）是纯色空块。
**根因**：视口外的懒图在截图时从未发起请求；`captureBeyondViewport` 只改捕获范围，
不触发 IntersectionObserver。
**防御**：截图前 `document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')`，
然后轮询 `[...document.images].every(i=>i.complete&&i.naturalWidth>0)` 最多 6s。

### 坑 3 · 入场动画停在 opacity:0 → 隐身内容
**症状**：滚动进场（reveal）类动画的区块截出来是空白。
**根因**：动画由 IntersectionObserver 驱动，离屏元素永远停在初始隐藏态。
**防御**：注入 `<style>*{animation:none!important;transition:none!important}</style>`，
并给所有 reveal 元素补终态 class（如 `.in`），再等 500ms。

### 坑 4 · 坐标系与固定尺寸壳
- 区块裁切的 clip 用**页面坐标**：`rect + scrollX/Y`；量取时机在滚动定位之后。
- 自建的预览壳（手机框内嵌 iframe）**不要用固定像素高 + JS 缩放**——在窄高视口
  （侧栏面板）会崩成一条内容带。用 `aspect-ratio` + `max-height/max-width` 纯 CSS
  弹性填充，数学上不可能溢出，缩放 JS 整个删掉。
- `file://` 下 iframe 跨文件**脚本访问被禁但显示不受影响**——验证渲染用亮像素，
  别依赖 `contentDocument`。

### 坑 5 · "截到了"≠"截对了"
截图任务最容易的失败是**静默劣化**：命令全成功，图全废。交付前必须：
- **尺寸审计**：逐张核对宽度是否等于视口×倍率（一条 Python/PIL 循环即可）；
- **像素验证**：裁目标区域算非黑像素占比（暗色站点正常 >8%，纯黑块 <2%）；
  有品牌色的元素可用彩色像素占比（如蓝色渐变 >5%）确认真实渲染；
- 发现坏图，先查坑 1/2/3 再重截，不要带病入库。

## 4. 交互态截图

打开下拉/模态再截呈现状态，用 JS `.click()` 即可（这里测的是渲染不是交互）；
但**交互测试**（点得到点不到、焦点、键盘）必须用真实输入派发
（`Input.dispatchMouseEvent`），两者不要混——详见 html-review-methodology.md 的 H2。
成功态等"伪终态"（本地模拟提交）可直接 toggle DOM 状态后截，图注要如实标注。

## 5. 交付打包

- 评审快照：截图 + 逐图一句图注进协作文档，图注写清视口与状态（如"402×874 · 模态全屏形态"）。
- 传阅包（zip）最小集：`index.html + src/ + assets/ + README`，双击 file:// 直开；
  响应式站点附一个流体手机壳预览页（见坑 4），同事双击即可看移动端。
- 正式协作走 Git 仓库，截图可随时再生，不进版本库。

## 6. 何时用本 skill

- 大改后出评审证据（桌面 + 真机逻辑分辨率双视口）
- 设计评审 / PRD 文档配图
- 归档版本快照（tag 对应一套图）
- 排查"用户看到的和我看到的不一样"（用对方视口复现截图）
