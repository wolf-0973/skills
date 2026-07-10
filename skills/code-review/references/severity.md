# Severity（critical / warning / nit）

所有 lens 与主 agent 共用的评级标准。

## critical — merge 这个就出事（阻塞）

- 明确的业务逻辑 bug：null 解引用、off-by-one、状态转换错、错误的 API 参数 / 方法 / 路径
- 安全：XSS、注入、凭据 / secret 硬编码、敏感信息写日志或明文存储、origin 未校验
- 数据破坏：误删 / 误覆盖数据、非幂等的写操作；并发写未加锁仅在并发属于当前 spec / slice 或已有支持行为时适用
- 严重性能：N+1、循环里同步 IO、明显内存泄漏（未清理的 listener / interval / observer）
- 项目自有检查在**变更文件**上报 error（lint / typecheck 失败）
- spec 核心 AC 未实现或做错

## warning — 脆弱但不立刻炸（必须展示）

- 缺关键 null check / 错误分支处理（catch 后只 log 也算）
- 偏离项目已有抽象：已有共享 util / 组件 / hook，新代码另写一套
- 违反 repo 明文规范（standards 来源里写明的条目）
- 无说明注释的类型强转、lint / 类型检查抑制注释
- spec 部分实现、范围蔓延（spec 没要求的改动）

## nit — 不阻塞，仅建议

- 可读性 / 结构建议（含 [smell-baseline.md](smell-baseline.md) 大多数条目）
- 不影响功能的重构建议

## 校准

- **宁可标低不标高**：模棱两可 → 低一级。critical 是「merge 就出事」，不是「这写得不太好」。
- **空 findings 是合理的**：干净 diff 就报 0 条，不要硬凑。
- file / line 从 diff 里复制，不能编造。
- 每条 message：一句问题 + 修复方向，用对话语言。

## 不要报的（任何 lens、任何等级）

- 变量名「更语义化」、重命名建议
- 「建议加注释」
- 缩进、空行、风格偏好（lint 没管的就别管）
- 单个魔法数字
- 纯理论性的问题：正常使用触发不到的边界、假想的未来风险 / drift 风险
- 工具或类型系统已强制执行的事
- spec / slice 显式列为未决或超范围的行为；除非本 diff 主动改变它，否则不把它升级成当前契约 finding
