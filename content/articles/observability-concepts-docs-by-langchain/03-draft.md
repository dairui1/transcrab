# LangSmith 可观测性概念

LangSmith Observability 可以记录、检查并分析 AI 智能体采取的每一个步骤。本页将介绍这些数据在 LangSmith 中如何组织和呈现，以及如何开始发送追踪数据。

## LangSmith 如何组织和呈现数据

在 LangSmith 中，智能体执行的每个工作单元，例如模型调用、工具调用或信息检索，都会被记录为一个 [*Run*](#runs)。一次操作中的所有 Run 会汇集成一条 [*Trace*](#traces)。你可以把多轮会话中的多条 Trace 关联成一个 [*Thread*](#threads)。[*Trajectory*](#trajectories) 则是组织和呈现同一批数据的另一种方式。Thread 会把一次会话的 Trace 组合起来并保留其嵌套结构，而 Trajectory 会将整个会话展平为按顺序排列的消息列表，展示智能体从开始到结束所走过的路径。

![Thread 会把一次会话的 Trace 组合起来并保留嵌套结构，而 Trajectory 会将同一会话展平为按顺序排列的消息列表](https://mintcdn.com/langchain-5e9cc07a/_6XeQZT2NAQ4WqkK/langsmith/images/thread-trajectory-light.png?fit=max&auto=format&n=_6XeQZT2NAQ4WqkK&q=85&s=e770ae021710ef231582cd59aae3a403)

![Thread 会把一次会话的 Trace 组合起来并保留嵌套结构，而 Trajectory 会将同一会话展平为按顺序排列的消息列表](https://mintcdn.com/langchain-5e9cc07a/_6XeQZT2NAQ4WqkK/langsmith/images/thread-trajectory-dark.png?fit=max&auto=format&n=_6XeQZT2NAQ4WqkK&q=85&s=b60e198867da6e9a43877a66b0d90e54)

### Run

*Run* 表示智能体执行的单个工作单元，例如调用 LLM、格式化提示词或检索文档。如果你熟悉 [OpenTelemetry](https://opentelemetry.io/)，可以把一个 Run 理解为一个 Span。

### Trace

*Trace* 是一次操作中所有 Run 的集合。例如，一次用户请求触发智能体先调用模型、再运行工具、随后再次调用模型，那么所有这些 Run 都属于同一条 Trace。每个 Run 通过唯一的 Trace ID 归属于相应 Trace。

### Thread

*Thread* 是一系列 Trace，代表一次多轮会话。会话中的一轮，是用户的一条消息以及智能体为响应这条消息所做的一切。每一轮都会被记录为一条独立的 Trace。要把多条 Trace 组合成一个 Thread，请在元数据中传入具有唯一值的 `thread_id` 键。[了解如何配置 Thread](https://docs.langchain.com/langsmith/threads)。

### Trajectory

*Trajectory* 是一个扁平、按顺序排列的消息列表，用来展示智能体从开始到结束所走过的路径。在 LangSmith 中，Trajectory 是对一个 Thread 中所有 Trace 的投影。它包含会话期间交换的人类消息、AI 消息和工具消息；每条消息只出现一次，并按照首次出现的顺序排列，同时移除 Run 的嵌套结构。

[了解 Trajectory 如何在 Messages 视图中呈现](https://docs.langchain.com/langsmith/messages-view-integrations)。

### 比较 Trace、Thread 与 Trajectory

|  | Trace | Thread | Trajectory |
| --- | --- | --- | --- |
| 形态 | Run 构成的树 | Trace 构成的序列 | 扁平、按顺序排列的消息列表 |
| 包含内容 | 每个 Run，以及完整的输入和输出 | 每条关联 Trace 中的所有 Run | 每条关联 Trace 中的所有消息，去重后呈现 |
| 适用场景 | 调试某一次操作为何失败或运行缓慢 | 检查智能体跨多轮的行为，同时保留时间信息和嵌套关系 | 阅读会话中交换了什么，而不关注执行细节 |

### Project

*Project* 是一个容器，用于存放与同一应用或服务相关的所有 Trace。[将 Trace 记录到 Project](https://docs.langchain.com/langsmith/log-traces-to-project)。

## 丰富 Trace 信息

### Feedback

*Feedback* 允许你按照特定标准为单个 Run 评分。每条 Feedback 由一个标签和一个分数组成，并通过唯一的 Run ID 绑定到相应 Run。Feedback 可以是连续值，也可以是离散值（分类）；同一组织内的不同 Run 可以复用标签。关于 Feedback 的存储方式，请参阅 [Feedback 数据格式指南](https://docs.langchain.com/langsmith/feedback-data-format)。

### Tag

*Tag* 是可以附加到 Run 上的字符串，用于在 LangSmith UI 中进行分类、筛选和分组。[了解如何为 Trace 添加 Tag](https://docs.langchain.com/langsmith/add-metadata-tags)。

### Metadata

*Metadata* 是一组可以附加到 Run 上的键值对，例如应用版本、环境或其他上下文信息。与 Tag 类似，你可以使用 Metadata 筛选和分组 Run。[了解如何为 Trace 添加 Metadata](https://docs.langchain.com/langsmith/add-metadata-tags)。

## 发送 Trace

向 LangSmith 发送 Trace 数据有两种方式。

### 集成

LangSmith *集成*可以为常见的 LLM 提供商和智能体框架自动启用追踪，相当于通用可观测性中的自动插桩。当你使用 LangChain、LangGraph、OpenAI、Anthropic 或 CrewAI 等受支持的框架时，集成无需你手动修改代码，便会捕获输入、输出和元数据。[浏览所有集成](https://docs.langchain.com/langsmith/integrations)。

### 手动插桩

*手动插桩*允许你为任何代码添加追踪，而不受所用框架限制。当你没有使用受支持的集成，或需要精细控制具体追踪哪些内容时，可以使用这种方式。LangSmith 提供三种机制：

* `@traceable` / `traceable`：用于追踪任意函数的装饰器
* `trace` 上下文管理器（Python）：包裹特定代码块
* `RunTree` API：以底层、显式的方式构建 Trace

[了解如何添加手动插桩](https://docs.langchain.com/langsmith/annotate-code)。

## 数据保留

LangSmith（SaaS）会从数据摄入之日起保留 Trace 数据 180 天。此后，Trace 将被永久删除，仅保留少量元数据用于使用情况统计。有关保留层级和定价的详细信息，请参阅[用量与计费：数据保留](https://docs.langchain.com/langsmith/usage-and-billing#data-retention)。

如需在到期前删除 Trace，请参阅[管理 Trace](https://docs.langchain.com/langsmith/manage-trace#delete-a-trace)。

* * *
