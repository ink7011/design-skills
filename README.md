# Partner Badge Design Playbook

一套「企业伙伴认证徽章体系」的完整设计方法论 + 可复用模板 + 工具脚本。
从竞品调研 → 规则先行 → 视觉分级 → 视觉 QA → 交付评审的端到端流程。

> 来源：一次真实的企业伙伴徽章项目全流程沉淀（细节已完全脱敏）。

## 为什么需要这个 Playbook

伙伴徽章不是"画一个好看的图"。它同时是**品牌资产、法务文书和权限系统**：

- 它要防误用（不可改色、不可暗示背书、失效即停用）
- 它要表达认证语义（身份认证 ≠ 产品背书 ≠ 商业授权）
- 它要支撑等级叙事（tier 差异要"说得出口"）
- 它要能被验证（谁在用、有效期、从哪下载）

竞品（Microsoft / AWS / Google / NVIDIA）全是这么做的。这套 playbook 把它们的共性
提炼成可执行的步骤。

## 仓库结构

```
methodology/
  01-research.md          # 竞品调研方法（只读官方来源，提取表结构）
  02-rules-before-design.md  # 规则先行：认证语义/命名/生命周期/免责声明
  03-design-language.md   # 视觉语言：等级分级、克制、材质、差异化记号
  04-qa-delivery.md       # 视觉 QA 回路、评审页、尺寸检查、一键启动器
templates/
  badge-lockup.template.svg   # 通用横向 lockup 模板（占位 logo + token 占位符）
  review-page.template.html   # 设计评审对比页模板
  open-docs.template.command  # 双击启动本地服务打开文档的启动器
scripts/
  export-png.mjs          # SVG → PNG@2x 透明底批量导出（manifest 驱动）
  size-check.mjs          # 最小尺寸可读性检查（多宽度拼图）
```

## 快速开始

```bash
# 1. 复制模板，替换 {{TOKENS}} 为你的品牌变量
cp templates/badge-lockup.template.svg my-badge.svg

# 2. 配 manifest 后批量导出
node scripts/export-png.mjs manifest.json

# 3. 尺寸检查（160px 是否可读）
node scripts/size-check.mjs my-badge.svg
```

## ⚠️ 上传前脱敏清单（每次提交前过一遍）

本仓库**永远不包含**：

- ❌ 真实 logo / 字标的矢量路径或位图
- ❌ 品牌色 HEX 值、渐变定义（用 `{{ACCENT}}` 等 token 代替）
- ❌ 内部 tier 命名、门槛数字、名额、分成比例
- ❌ 伙伴名单、谈判状态、内部 owner
- ❌ 未公开的商业条款

自查命令：

```bash
grep -rniE "你的品牌名|内部产品代号|#[0-9a-f]{6}" --include="*.svg" --include="*.md" . | grep -v "{{"
```

（模板中的示例 HEX 全部为占位灰阶，无真实品牌信息。）

## License

MIT
