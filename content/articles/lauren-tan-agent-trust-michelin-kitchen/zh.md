---
title: 'Lauren Tan：一个月交付 2,000 个高质量 PR，关键是让 Agent 值得信任'
date: '2026-09-24T05:16:02.367Z'
sourceUrl: 'https://x.com/poteto/status/2102050467505430555'
lang: zh
---
讲者：Lauren Tan（[@poteto](https://x.com/poteto)）。原视频发布于 2026 年 9 月 21 日，时长约 38 分 02 秒。本文包含完整中文译稿、英文清洗逐字稿，以及单独标明的译者总结。

> **整理说明**：根据用户提供的视频进行本地语音识别，清除无实义口癖和紧邻的重复词，补全标点，纠正明显识别错误；保留发言顺序、论述、例子和立场，不以摘要替代正文。时间戳用于定位，小标题由译者添加。视频开场口述和标题页均为 **2,000 个 PR**，原帖配文则写 **2,500 个 PR**，这里按视频保留 2,000，不擅自统一。产出数量及内部工程效果均为讲者自述，不代表独立审计结论。

[观看原帖视频](https://x.com/poteto/status/2102050467505430555) · [英文清洗稿](https://github.com/dairui1/transcrab/blob/main/content/articles/lauren-tan-agent-trust-michelin-kitchen/transcript.cleaned.txt) · [英文 ASR 字幕（第二轮，机器时间轴）](https://github.com/dairui1/transcrab/blob/main/content/articles/lauren-tan-agent-trust-michelin-kitchen/transcript.pass2.srt)

## 译者总结：真正需要扩展的不是 Agent 数量

**以下是我的总结与判断，不是讲者原话。**

这场演讲的主线不是「如何一次开一百个 Agent」，而是：**先把工程经验变成可执行、可检查、可复用的环境，再增加并行度。** 人不再逐条盯着输出，但仍然对产品结果和工作环境负责。

1. **验证要同时具备操作能力和产品知识。** CLI 让 Agent 可重复地运行真实应用、采集证据；功能地图让它知道产品有什么、用户如何到达对应功能。只会点击和运行命令，还不足以理解一张含糊的报错截图。
2. **代码库本身是一种记忆。** Agent 会沿用眼前的模式，因此一次临时绕行可能成为后续大量提交的模板。修正 Agent 时，优先考虑架构、数据结构和静态检查，再补规则与技能，而不是只多写一段提示词。
3. **把资深工程师的经验沉淀到系统里。** 调试、性能分析、开发流程可以成为团队共享的技能；模块边界、依赖方向和禁止模式则尽可能由工具强制执行。
4. **自动化的外环负责接收信号、启动工作。** Slack、错误告警等触发任务，云端 Agent 执行，验证机制收集实际证据。扩大吞吐的前提是这些环节能可靠协作，而非一套庞大而神秘的「公司大脑」。

我认为最值得带走的一问是：**这次纠正，能否变成下次不再需要人工纠正的机制？** 但也要保留边界：PR 数量不等于业务价值；运行验证不等于形式化证明；讲者团队对 Dune 的「禁止注释」是特定治理选择，不应直接推广成所有项目的通则。比照搬禁令更重要的是识别注释是否在为本可消除的问题找借口，以及是否把好坏模式都固化进了环境。

## 术语说明

| 原词 | 本文用法 |
| --- | --- |
| Agent / skills | 保留 Agent；skills 译为「技能」，指供 Agent 使用的流程与操作知识，不是模型训练能力的泛称。 |
| pull request / PR | 合并请求（PR）；不与 Git commit「提交」混为一谈。 |
| verification / formal verification | 验证 / 形式化验证；前者可指运行应用并取证，后者涉及形式化方法与不变量证明。 |
| performance trace / heap snapshot | 性能追踪记录 / 堆快照；不是「热快照」。 |
| Feature Map / materialized memory | 功能地图 / 物化记忆，即保存下来的、可供读取的具体记忆载体；这里不是神经网络中的特征图。 |
| pstack / Control Glass / Dune / Bugbot | 保留名称。pstack 是讲者的技能插件；Control Glass 是视频所述的内部验证技能；Dune 是视频所述的客户端框架，不与同名其他项目混淆；Bugbot 是代码审查产品名。 |
| paved path / workaround | 标准路径 / 临时绕行方案；分别指团队认可的常规实现方式和绕过问题的权宜实现。 |
| outer loop / routines | 外环 / 例行自动化任务；用于描述接收外部信号并触发后续工作的流程。 |

产品及公司名称按视频语境保留为 Cursor、Grok Bot、SpaceXAI；人名保留 Lauren Tan。`pstack` 的拼写与作者身份另核对了 [Cursor 插件页](https://cursor.com/marketplace/cursor/pstack)及[官方仓库](https://github.com/cursor/plugins/tree/main/pstack)。内部系统的能力描述以本视频为依据，不视为已经独立验证的公开产品规格。

## 完整中文译稿

### 00:00 信任，以及「米其林厨房」

大家好，我叫 Lauren。你可能在 X 上见过我，我的账号是 poteto。我在 SpaceXAI 从事 Grok Bot 的开发。上个月，我做了一件挺疯狂的事：我把 2,000 个合并请求交付到了生产环境。我之所以能做到这一点，很大程度上靠的是信任。我经常思考这个问题：即使我不在场，怎样才能相信我的 Agent 依然会产出高质量的工作？

我今天这场演讲的核心观点是：如果你把 Agent 的工作环境搭建得足够好，最终就能形成某种个人、甚至团队的「软件工厂」，以远高于以往的速度产出高质量代码。

不过，我不太喜欢「软件工厂」这个说法。我更喜欢「米其林厨房」这个比喻。作为技术工作者，我们并不是在流水线上大批量制造同一种产品。我们的工作富有创造性，是在打造产品，从某种意义上说也是一种艺术。因此，即使有了 Agent，我们不再亲手烹制组成产品的每一道配料，仍然要对最终结果负责，也仍然要思考厨房该怎样布置。

你如何安排各工位的厨师、副厨，他们拥有什么设备、接受什么训练，洗碗工如何安排，以及工位厨师和洗碗工的比例，这些因素都会影响最终成品。我觉得这个比喻非常贴切。

### 02:03 从手工性能排查到验证技能

正式开始之前，我想先讲一段经历。六个月前，我刚加入 Cursor，那时我们还没有成为 SpaceXAI 的一部分。显然，我手上没有任何现成的 Agent 技能可用。我刚进公司，面对的是全新的代码库和全新的产品。当时，Cursor 正在打造 Cursor IDE 的替代产品，也就是新的 Agent 窗口。

在我加入之前，Cursor 的 Agent 窗口就有不少性能问题。当时的经理问我能不能帮忙。由于我在加入 Cursor 之前曾在 React 团队工作过一段时间，这看起来是个很合适的任务。但真正开始之后，我很快意识到，这套流程实在太依赖手工操作了。我当然做过性能优化，可当时合并请求落地的速度太快了，源源不断的 PR 就像一堵几乎无法翻越的高墙。我根本不知道应用的性能会不会因此发生退化。

所以，刚加入 Cursor 团队时，我花了很多时间盯着 Chrome DevTools 和性能表现，采集性能追踪记录、抓取堆快照。整个过程极其依赖手工操作。手工到什么程度呢？最后我实在受不了了，开始想：等一下，我们不是有 Agent 吗？我到底在干什么？

于是我开始思考验证技能：如果 Agent 能自己运行应用，替我采集追踪记录，理解这些记录，找出性能热点，再通过不断迭代、逐步改进的爬山式优化，自动提升应用性能，会怎么样？

### 04:13 我才是瓶颈

在 Cursor 和 SpaceXAI 的这六个月里，可以很明显地看到，我的生产力大幅提高了。我从来没有立下过「每个月交付 2,000 个 PR」的目标，那完全不是我的初衷。但后来我意识到，我构建的所有技能、工具，以及对代码库所做的修改，都指向同一个概念：信任。

当时我还没有清楚地认识到这一点，但脑海里一直隐约有个念头：我才是瓶颈。我必须把自己作为工程师积累的知识传递给这支 Agent 团队，这样就不必事事都卡在我这里。现在可以很明显地看到，这种投入得到了回报。

### 05:13 从一个 Agent 到一百个 Agent

所以，我认为归根结底还是信任。但到底怎样建立这种信任？无论你现在处于使用 Agent 的哪个阶段，又该从哪里开始？

我刚开始时，显然处于图中的这个区间：一个，或者一到五个 Agent。这个阶段，你仍然觉得必须盯着每一段聊天和对话，不断纠偏、介入、纠正 Agent，才能让它做对事情。如果你不在场，基本上就什么也推进不了，Agent 还会把事情做错。

我甚至认为，使用 Agent 的这个阶段最难走出来，因为你往往并不清楚，究竟该怎样离开这个阶段。说到底，还是信任。你之所以无法从一个或一到五个 Agent 扩展到更多，比如一百个，就是因为你还不信任它们的工作。

如果没有这种信任，就直接启动一百个子 Agent 或云端 Agent，你很快会发现，得到的只是一大堆低质量的 PR、一堆回归问题，以及一堆被带到生产环境中的 bug。没有人会满意。因此，问题就变成了：怎样才能更信任你的 Agent？

### 06:50 验证有不同层次

对我而言，这件事真正开始于前面提到的那段经历：我加入 Cursor 团队，开始处理性能问题，然后意识到了验证的必要性。我所说的验证，其实有不同层次。较基础的一端，就是我提到的验证技能：教 Agent 如何运行应用，如何使用 Chrome DevTools Protocol（Chrome 开发者工具协议），或者你使用的其他调试协议；教它调试应用、采集性能追踪记录、抓取堆快照，等等。

而在另一端，是困难得多、也仍然有很多开放问题的形式化验证。你可能会借助形式化方法，或者 Lean、TLA+ 这样的语言来做验证，检查业务层面或业务逻辑中的不变量是否始终成立，并用形式化方式验证应用始终处于正确状态。不过我想说，即使你没有能力使用形式化方法，实际上真正有这种能力的人也很少，仅靠验证技能，你也已经能走得很远。

### 08:37 Control Glass：可复用的 CLI

我加入 Cursor、开始处理 Agent 窗口时，构建的第一个技能叫 Control Glass。它就是前面提到的验证技能，教 Agent 如何运行应用、采集追踪记录，底层使用的是 Chrome DevTools Protocol。

这个技能有一点很有意思。这也是我逐步迭代才得到的结果，并不是一开始就设计好的：控制类技能，或者说验证技能，实际上有两个组成部分。第一部分显然是 CLI，也就是命令行接口。你希望 Agent 能够以可重复的方式运行应用、采集追踪记录，并取得实际证据，证明代码确实在工作、性能确实达到了要求。

与其让 Agent 每次都重新写脚本，而且每个会话写出来的脚本还可能不一样，不如直接在技能目录里放一个 CLI，让 Agent 每次都使用它。当然，你得真正投入精力，把这个 CLI 做好，让它能够应对各种不同的使用场景，并正确地运行应用。

### 10:16 功能地图：不仅能操作，还要知道产品是什么

另一个非常重要的概念，是功能地图，也就是 Feature Map。这个说法大概算是我自己提出的。当时，我们开始在 Cursor 内部使用这些控制类技能，很快就遇到这样的问题：Slack 里有人发来一个问题报告，只有一张很含糊的截图，可能只是 UI 的一小块，再配上三个问号。使用控制技能的 Agent 完全摸不着头脑。它能把应用运行起来，却只能猜用户到底在说什么。

于是我想到，能不能建立一个「功能地图」？这个想法有点受网站地图的启发。它本质上是一种物化记忆：你的应用究竟怎样工作？有哪些功能？用户如何到达这些功能，比如使用什么快捷键、点击哪些 DOM 元素？各个功能分别做什么？

这份功能地图就存放在代码库中的技能里，是技能目录的一部分。我们还有自动化任务来维护它。把 CLI 和功能地图结合起来之后，我们很快发现，这个组合非常强大。因为 Agent 不仅可以重复、稳定地控制应用和采集追踪记录，还能理解内部用户和外部用户提出的请求。

我们很快意识到，这些用于控制和验证的技能实在太有用了，已经几乎成了团队不可或缺的基础设施，需要持续维护。Agent 能验证自己的工作，这种能力非常强大。我们在这个技能上投入了大量时间，而它对建立信任确实非常有效。

### 12:33 正确性、质量与 pstack

除了验证，当然还需要别的东西，因为验证主要回答的是正确性问题。在我看来，正确性指的是：这个功能或这段代码，是否真的完成了你希望它完成的事情？比如，结账按钮是否真的能完成购物车结账？验证之所以重要，是因为你能取得这个功能确实有效的实证。但它本身并不能充分说明这个功能的性能怎么样、代码质量怎么样。因此，你还需要思考另一类技能：教 Agent 像真正的软件工程师那样工作。

我构建了一个叫 pstack 的插件。今天我不会花太多时间介绍插件本身，但它是我创建的一组技能的集合，很多灵感来自我从事软件工程时亲自采用的工作流程，覆盖各种不同类型的任务，比如调试、功能开发和原型制作。pstack 里有很多不同的操作流程和技能，用来教 Agent 按你期望的方式写代码。

这也是团队里更有经验的工程师能够做出重要贡献的地方：建立一个团队共享的技能仓库，让 Agent 更聪明。把这些技能与验证技能结合起来后，Agent 就不仅能验证自己的工作是否正确，还能验证它是否具有较高质量。而且，由于有验证机制，你可以采集真实的性能指标，拿到关于应用性能的实际数字、统计数据和遥测数据。因此，我认为这是非常值得投入的一个方面。

### 14:53 代码库本身就是记忆

另一个我认为非常重要的方向，是重构乃至重写架构，让它对 Agent 更友好。我甚至想说，这是软件工程团队最值得做的事情之一。如果你真的相信，未来所有代码都会由 Agent 来写，那么我们就应该设计好代码库，让 Agent 默认就能做对事情。

你会发现，在构建 Agent 信任的这些不同手段之间，似乎存在一个层次，或者说一条连续谱。我这里列了五项。其中，代码库本身实际上是最好的记忆形式，因为 Agent 非常喜欢沿用它看到的现有模式。我想，这就是大语言模型的工作性质决定的：它更倾向于利用上下文窗口里已有的东西来进行修改。

当然，Agent 读取和打开的文件，也是上下文窗口的一部分。因此，代码库在这里非常重要。Agent 不会每写一个 PR，就把你的代码重构一遍。它通常只会看看已经有什么，然后沿着已有模式继续扩展。

### 16:27 静态分析、规则、技能与风格指南

下一个层次，我认为是静态分析。你有 lint 检查器、编译器诊断、持续集成。这些都是可以在代码库里强制执行的规范和约束。每当你纠正 Agent，却发现它总在犯同样的错误，就可以把这些要求写成 lint 规则。更好的做法，则是重构代码库，让 Agent 犯的这种错误从结构上就不可能发生。

再往上一层，就不那么像硬性约束和强制执行，而更接近指导了。这里有规则、Bugbot 和技能。Agent 在工作时当然通常会用到它们，但也有可能因为各种原因忘记读取某条规则，或者操作 Agent 的用户忽略了这些要求。所以，它们的强制性没那么高，但同样是搭建可信工作环境的重要部分。

最后是风格指南。它实际上只能依靠人在代码审查中执行。当然，你也可以把这些要求放进规则、Bugbot 和技能里。但如果没有这么做，审查流程里就会留下一个巨大的缺口：人必须看过每一行改动，还得记得提出审查意见。面对当前 PR 涌入的速度，这根本不可能持续下去。

所以，我肯定不建议只依赖风格指南。要发现流程中缺少什么，风格指南和人工审查记录都是很好的起点，但你真正应该投入时间思考的是另外四部分：代码库，通过更好的数据结构或算法让某些错误根本无法发生；静态分析；然后在此之上叠加规则、Bugbot 和技能。

### 18:58 Dune：让最省事的路就是正确的路

说到代码库，我们在 Grok Bot 的代码库里投入建设了一套名为 Dune 的框架，它是为 Agent 友好使用而设计的。Dune 的灵感，很大程度上来自我们在 Cursor Agent 窗口里遇到的大量性能问题。那次探索让我们学到了很多东西，但最终确定的关键原则是：Agent 非常喜欢走捷径。

那么，能不能设计这样一套框架，让捷径，也就是最容易走的路，恰好就是 Agent 应该走的正确道路？它甚至可能是一个让人类工程师觉得很烦的代码库，因为能做什么、不能做什么，都被限制得很死。但对于 Agent，尤其是上下文信息非常少的 Agent，这反而构成了理想环境。

因为今后参与代码库开发的人，不会全是工程师了。设计师、产品经理、CEO 都可能进入代码库并交付功能。所以，我们需要认真思考，该怎样投入和组织代码库，让那些由忙碌、又没有太多上下文的人操作的 Agent，也能默认把事情做好。

### 20:31 反模式会扩散

正如前面所说，代码库对 Agent 而言就是一种记忆，因为它们喜欢沿用看到的现有模式。反过来也一样。你可以投入时间，把代码库设计成坏模式从根本上不可能出现的样子，或者用 lint 规则阻止它们。但如果代码库中已经存在反模式，你也会发现，这些东西会像病毒一样传播。

也许只是一个小小的临时绕行方案，或者一条解释这个方案的注释，你很快就会发现，Agent 特别喜欢照着复制。几天或几周之后，这种绕行方案就扩散得到处都是，成了所有 Agent 实际遵循的默认模式。这是非常糟糕的状态。因此，我才一直强调，每当你纠正 Agent 时，都应该花时间考虑代码库层面的修改和静态分析，再叠加好的规则、Bugbot 和技能。

除了米其林厨房，我还喜欢另一个比喻：代码库就像一座花园。有些临时绕行方案最初看起来无伤大雅，但由于 Agent 的特性，这种模式会被一遍遍复制。很快，你就会得到一个充满 vibe coding 痕迹的代码库，维护起来非常痛苦，而且还有大量性能问题。

### 22:32 为什么 Dune 禁止代码注释

所以，在我看来，理想的 Agent 代码库，应该有非常严格的限制。就像刚才说的，人类在里面写代码可能会觉得很烦，但它的约定足够统一、足够标准化，以至于连一些看似无害的模式也被禁止。

我能举出的最好例子，是一件乍看非常无害、仔细想却很糟糕的事情：Agent 在代码里留下注释。最初看到 Agent 这么做时，我也没有立刻反对。好吧，我确实觉得其中很多注释都是低质量的废话，但我同时也觉得，Agent 留注释，似乎不算坏事吧。

毕竟，我们人类遇到边界情况、不得不采取某种临时绕行方案，或者希望针对代码库中特别棘手的部分给自己或同事留个说明时，也会写注释。但当这种情况出现在 Cursor 的代码库里时，我很快发现，Agent 会拿代码旁边的注释当作理由，解释自己为什么不去解决真正的问题，而是贴一块创可贴，用短期方案把它遮住。

因此，在支撑 Grok Bot 的 Dune 框架中，我们选择了禁止代码注释。原因就是不想让 Agent 不断复制这种模式，并把它传播到整个代码库里。

### 24:28 你的团队需要一位「园丁」

所以，我想提出的建议是：每个团队都需要一个角色，我把它叫作「园丁」。就像真正的花园一样，你需要有人一直留意那些悄悄出现、以你不希望的方式生长的东西。比如杂草，或者其他自然长出来的东西。我其实不太懂园艺，但总之，会有不想要的虫害之类的东西，偷偷钻进你的代码库。你要尽早把它们消灭在萌芽状态，别等它们到处扩散。

Dune 背后的很多原则，都围绕这三件事展开。第一，清除已经存在的技术债，原因就是我前面说的那些。第二，为团队认可的大多数模式保留或强制执行一条标准路径。做某件事应该有一种符合约定的方式，这样 Agent 就不必猜测。代码库、CI 和 lint 规则里都应该有足够的引导，让 Agent 沿着这条路走。

最后，每当你看到技术债或坏模式时，本能反应应该是：我要写一条 lint 规则来阻止它。不一定非得立刻清理干净，因为只要先写出 lint 规则，至少就能止血。这并没有彻底解决问题，但至少能阻止问题继续扩大。

所以，我非常建议认真思考，怎样防住这些反模式，避免它们像病毒一样传播。同时，也要花时间让 Agent 真正把它们清理掉，使代码库始终保持在一种状态：如果 Agent 要照着复制，你会对此感到满意。这就是我建议采用的心态。

### 26:41 Dune 的架构与进程边界

接下来，我不会逐一讲解 Dune 的全部细节，只简单介绍几个有意思的部分。再提醒一下，Dune 是我们用来支撑 Grok Bot 的架构，也是一套客户端框架。我们对刚才说的那些方面投入了很多，建立了许多约定：代码应该放在哪里，模块之间应该从哪里、以什么方式导入代码。

比如，Dune 应用中有不同的概念。一个功能的相关代码都集中在同一个文件夹里；React 部分有入口，你可以把它理解成类似路由的东西；有显示在 Grok Bot 应用里的对话记录卡片（transcript cards）；有运行在 Grok Bot 虚拟机上的 host；当然，还有驱动整个 Dune 应用的客户端。

这些部分之间存在很多严格的边界。举个例子，在 Electron 主进程或主线程上运行的东西，不允许跑到渲染线程上。我们非常有意地维持这种隔离，因为我们在 Cursor 的 Agent 窗口里吃过亏：有时会有代码被意外导入渲染线程，而且还是运行很慢的代码。

既然你希望渲染线程上的 UI 足够流畅、性能足够好，就必须确保那里没有长时间占用线程的任务。例如，想达到每秒 60 帧，就不能让任务耗时超过约 16 毫秒；想达到每秒 120 帧，则是约 8 毫秒。因此，渲染器必须能够把工作拆成小块，而不是一次性全部执行。Dune 内部有代码通过导入关系和依赖图来强制执行这些边界。

这只是一个例子：我们曾经看到某种模式导致严重性能问题，于是通过 Dune 的架构，从结构上消除了这种模式。

### 29:17 把团队经验编码进框架

其他这些细节其实没那么重要。这里的核心主题也不是 Dune 本身，而是：建立一套属于你自己的、对 Agent 友好的框架，是非常有力量的做法。它能够把你和团队里最优秀的工程师所掌握的那些口耳相传的经验，编码进去。

我认为真正值得思考的是，怎样把原本留在风格指南和人工代码审查中的知识提取出来。过去，工程师会审查其他工程师的工作、留下评论；现在，能否把这些知识编码到框架里、代码库本身里，让代码库成为记忆？

我一直回到这个想法：代码库就是你希望 Agent 延续下去的那个状态的一份物化快照。你希望它足够干净、足够好，这样下一个 Agent 进来时，就很有可能沿用这些模式，让代码库继续保持很好的状态。

### 30:37 信任工作环境，而不是依赖全程盯梢

只要在这个过程上投入足够时间，就像我前面说的，你真的可以搭建起一座米其林厨房，或者一座软件工厂。你在那些让 Agent 值得信任的组成部分上投入了很多：代码库、lint 规则、诊断信息、规则、Bugbot、技能。这些层次叠加在一起，就会给你很强的信心。

想象一下，你现在在 Grok Bot 的代码库里工作。这里的限制非常严格，几乎不可能写出糟糕的代码。所以，即使是上下文很少的 Agent，甚至没有投入很多推理的 Agent，也能进来写出不错的代码。

回到刚才米其林厨房的比喻，这里面其实有很多对应之处：我们给 Agent 和机器人配备技能和工具，训练它们，以合理的方式布置厨房，让它们默认就能做对事情。

比如，在厨房里，如果我们发现某位厨师或洗碗工总是被同一个东西绊倒，当然就要把问题解决掉，确保其他人也不会绊倒。毕竟厨房是个有危险的地方，你不想让自己受伤。我认为，对代码库也应该抱有同样的心态：怎样布置这个环境，才能让没有太多知识的 Agent 也把事情做好？

### 32:33 Grok Bot、Cursor 与外环

我认为，Grok Bot 和 Cursor 搭配起来，分别承担了很有意思的角色。Grok Bot 很擅长提供我所说的「外环」。因为你可以把它连接到很多不同的服务，比如 Slack、Datadog、Sentry、PlanetScale，或者你使用的其他服务。它可以汇总这些信息，再据此作出很好的决定。

有些人把这叫作「公司大脑」。我个人不认为这里需要那么复杂的东西，因为 Agent 本来就很擅长使用工具。所以，只要把这些工具连接到 Grok Bot，再让 Grok Bot 自动启动云端 Agent 等工作，你就会发现，建设一座软件工厂其实不需要投入那么多基础设施。事实上，我要把「软件工厂」这个词划掉，因为我不喜欢这个说法。

我认为，你可以通过 Grok Bot 为自己搭建一座个人的米其林厨房。比如，Grok Bot 的 routines，也就是例行自动化任务，可以订阅 Slack 讨论串和 Sentry 告警，然后自动启动工作。再把我一直提到的这些东西结合起来，包括代码库、规则和技能，它们的效果就会不断叠加。Grok Bot 能自动响应外环传来的事件，然后启动云端 Agent。

你还可以配置 Cursor Automations，并使用我们的 SDK 创建额外的机器人，复用已经搭建好的 Agent 基础设施，让它们完成复杂得多的任务。做到这些之后，就能达到这样的状态。我这里展示了一些截图，是我们在 Cursor 上工作的自动化任务和 Agent：它们会自动复现 bug 报告、自动创建 PR。由于这些投入的效果不断叠加，我们实际上是在为整个团队创造大量价值。

### 35:15 最后，希望你记住这件事

最后，让我们再把视角拉远，回到这张图。如果你认真思考，要沿着信任曲线上升，究竟需要哪些组成部分，就会逐渐走到这样一个阶段：你可以更信任 Agent，把工作并行起来；整个团队也能够在这些 Agent 基础设施上继续建设，让每一位工程师、每一位构建产品的人都获得极高的生产力，并写出高质量代码。

最后我想留给大家的是这一部分。抱歉，不是这个，是这个。如果这场演讲你只带走一个东西，那应该就是这张幻灯片：这些工作，能够帮助你建立一个高信任度的环境。每当你发现自己又在纠正、介入 Agent 的工作时，都应该从这五个方面来思考：在这条序列里，哪一步最有效，最能让 Agent 更值得信任？

我当然建议按照这个顺序思考。要么投入时间，通过代码库、架构和数据结构，让某种错误模式根本不可能出现；要么开始考虑静态分析，再在上面叠加规则、Bugbot 和技能。

如果你做到了这些，也花时间从技能的角度思考代码质量，就能到达这样一个状态：你对环境足够信任，可以让 Agent 自由地工作。拿 Grok Bot 的代码库来说，我个人确实在这方面投入了很多时间，而这就是真正的秘诀。好吧，也算不上秘诀，就是大量扎实的工作。

希望这场演讲对你有帮助。欢迎在 X 上联系我，我的账号是 poteto，里面是字母 E。也希望大家在自己的米其林厨房里，能获得很多乐趣和成功。谢谢观看！

---

## 补充校注与转录边界

- **五个层次**：视频幻灯片依次列出代码库、静态分析（lint / compiler / CI）、rules / Bugbot、skills、style guide。口述有时把规则与技能并列讲解，译文没有凭空增加第六层。
- **帧预算**：讲者使用约 16 毫秒和约 8 毫秒说明 60 FPS 与 120 FPS 的帧预算。这里保留其近似表达，不把这段口语解释成 Web 性能 API 中「Long Task」的正式定义。
- **内部实践与观点**：Control Glass、Dune、公司关系、交付数量和工程效果按讲者当时的陈述翻译；本文没有把它们当作独立调查结论，也没有声称复现过其内部工作流。
- **识别质量**：第一轮在约 09:17–10:17、11:17–12:17 出现重复幻觉，第二轮关闭前文条件化后恢复相应内容；关键数字、否定词及部分术语结合视频字幕和画面交叉核对。英文清洗稿保留完整论述，但不是保留每个语气词的法庭式速记。SRT 保留机器识别的分段与时间轴，未逐帧人工对齐，也不等同于清洗定稿。

## 英文清洗逐字稿

完整英文稿如下，可用于对照；小标题与时间戳为编辑辅助。

### 00:00 Trust and the Michelin kitchen

Hi, my name is Lauren. You might know me as poteto on X, and I work on Grok Bot at SpaceXAI. So last month, I did something pretty crazy. I shipped 2,000 pull requests to production. A lot of how I'm able to do this is through trust. And I think a lot about trust in terms of how I can trust my agents to produce high-quality work even when I'm not there.

And my argument and thesis for this talk today is that if you set up your environment for your agents really, really well, you can end up with something that looks more like a personal or even team software factory, where you're producing very high-quality code at much greater rates than before.

But I'm not a fan of the term software factory. I like the analogy of a Michelin kitchen better, where, as technologists, we're not mass-producing a product on an assembly line. But the work that we do looks very creative. It's the act of building a product, and it's art in some sense. So even though with agents we're not cooking the individual components that go into the product anymore, we're still responsible for the final outcome and thinking about our kitchen setup.

Because depending on how you set up your line cooks, your sous chefs, the kind of equipment they have, the kind of training they have, dishwashers and the ratio, I guess, of line cooks to dishwashers, all of these ingredients go into making the final product. And I think this analogy is really apt.

### 02:03 From manual performance work to verification

So I wanted to talk a little bit about a story before we begin, where six months ago, when I first joined Cursor, before we were a part of SpaceXAI, I obviously had no agent skills to use. I just joined the company. It was a fresh codebase and a fresh product that I was working on. So at the time, Cursor was building the replacement for the Cursor IDE, which is the new agents window.

And before I joined, the Cursor agent window had quite a lot of performance issues, and my manager at the time asked if I was able to help them. And since I had spent some time on the React team before I joined Cursor, it seemed like a good fit. But when I first started, I quickly realized how manual this process was. Obviously, I have done performance work before, but at the rate at which pull requests were being landed, it felt almost an insurmountable wall of pull requests that just kept coming in. And I had no idea whether or not the performance of the app would be regressing.

So a lot of my early time on the Cursor team was spent looking at Chrome DevTools and the performance, and doing performance traces and taking heap snapshots. And it was extremely, extremely manual. It was so manual, it got to the point where I just got really frustrated and started to think about, wait, we have agents. What am I doing?

And so I started thinking about verification skills, where, what if my agent could actually run the application itself and take the traces for me, understand the traces and find the hotspots, and basically hill-climb to better performance in our application automatically?

### 04:13 I am the bottleneck

And throughout the last six months of being at Cursor and SpaceXAI, you can really see that my productivity has skyrocketed. And I never set out to ship 2,000 pull requests a month. That was not a goal of mine at all. But I realized that all of the skills, all the tools and codebase changes I was making laddered up to this idea of trust.

I didn't know it at the time, but I had this thought in the back of my head, which was: I am the bottleneck. And I need to be able to take all of the knowledge that I have as an engineer and impart them into my team of agents so that I don't need to be the blocker for everything. And you can clearly see that it's paid off.

### 05:13 From one agent to a hundred

So I think it really comes down to trust. But how exactly do you build that trust? And where do you start, wherever you are in your journey of using agents?

So when I started, obviously I was in this category, the one to one-to-five range, where you still feel like you have to babysit every chat and conversation. And you're just constantly course-correcting. You're intervening, you're correcting your agent so that it does the right thing. And if you're not there, basically nothing happens, and the agents do the wrong thing.

And I would actually argue that this part, this phase of using agents, is actually the hardest to get out of. Because it's not always very clear how exactly you get out of it. And again, it just comes down to trust. The reason you're unable to go from one or one-to-five agents to something more, like a hundred, is because you don't have trust in your agents' work yet.

So if you don't have trust and you try to spawn a hundred sub-agents or cloud agents, you're going to quickly find that you're just going to get a ton of slop pull requests and a bunch of regressions and a bunch of bugs shipped, and no one's going to be very happy with them. So that begs the question: how do you trust your agents more?

### 06:50 Verification has different levels

So for me, it really started when, like I said, I joined the Cursor team and I was starting to work on performance, where I realized the need for verification. So when I say verification, there are sort of levels to that. Because on the lower end of the scale for verification, you have things like the verification skills that I talk about, where you teach your agent how to run your application and use things like the Chrome DevTools Protocol, or whatever other protocol that you have for debugging, and teach them how to debug the application, take performance traces, take heap snapshots, and so on.

And then on the opposite end of the spectrum, which is much, much harder and still very much an open question, is more formal verification, where maybe you rely on formal methods or languages like Lean or TLA+ to do verification so that you can check that your business-level or business-logic invariants are always true, and that you can formally verify that your application is always in a correct state. But I would say that even if you don't have the ability to run formal methods, and very few people really do, with verification skills, you can get very far.

### 08:37 Control Glass: a reusable CLI

So when I joined Cursor and started to work on the Cursor agent window, the first skill that I built was a skill called Control Glass, which is a verification skill that teaches the agent how to run the application and take traces, like I mentioned. And it does that through the Chrome DevTools Protocol.

Something interesting about that skill is, and I kind of iterated my way to this, it didn't start out this way, but the control or verification skill really has two components to it. The first part is obviously a CLI. So you want your agents to be able to reproducibly run the application and collect traces, and collect empirical evidence that code is working, that your performance bar is being met.

And rather than have your agents create scripts every time that can differ between agent sessions, you can actually create a CLI that's within the skill directory, and then your agents will just use that every time. And then of course you need to actually invest in it and make it good so that it can handle all sorts of different use cases and be able to run the application correctly.

### 10:16 Feature Map: context as well as control

Another thing that's also really important is this idea of a feature map. So a feature map really is something that I kind of coined, I guess, where we started using these control skills within Cursor. Then we quickly realized that a Slack report would come in and a user would post a very vague screenshot, like a very small slice of the UI and just three question marks. And the agents using our control skills had no idea. It could run the application, but it was just guessing at what exactly the user meant.

And so I had this idea to create something called a feature map, which is, I guess, kind of inspired by a site map. It essentially is a form of materialized memory. How exactly does your application work? What features does it have? How does a user reach it, in terms of keyboard shortcuts or what DOM elements to click on, things like that? And what all the different features do.

And this feature map is stored in the skill itself in the codebase as part of the skill directory. And we have an automation that maintains this feature map as well. But when we combined the CLI and the feature map, we quickly realized that this combination was very, very powerful, because now agents can not only reproducibly control the application and take traces, but it could also understand requests that came in from internal users as well as external users.

And so we very quickly realized that the control verification skills were so useful that they've become more or less critical infrastructure for our team, and we constantly maintain it. But the ability for an agent to verify its own work is extremely powerful. And we have spent a lot of time on this skill, and it's very, very powerful for building that trust.

### 12:33 Correctness, quality, and pstack

In addition to verification, of course, you want, because verification is really about correctness. Correctness to me is really about: does the feature or code do the thing that you want it to do? Like, does the checkout button actually check out the cart? Verification is really important for that because you can get empirical evidence that this feature actually works. But it doesn't tell you much about the performance or the code quality of that feature. And that's where you start thinking about skills that teach agents to work like real software engineers.

So I've built a plugin called pstack. I'm not going to talk about the plugin too much today, but a lot of the inspiration for that plugin, which is a collection of skills that I've created, is inspired by the kind of workflows that I personally have used in my time doing software engineering for all sorts of different types of tasks. So debugging, feature development, prototyping. There's a whole bunch of different playbooks and skills that ship in pstack that teach your agents how to write code the way that you want them to.

And this is where the more experienced engineers on your team can really contribute to set up a team repository of skills that just make your agents a lot smarter. And when you combine those skills with verification skills, then you're able to get to a point where your agents are able to not just verify that the work that they're doing is correct, but that it's also high quality. And again, because of verification, you can collect real performance metrics. You can get real numbers and statistics and telemetry on the performance of the application. So I think that's a really important part to invest in.

### 14:53 The codebase is memory

Another thing I think is really important is refactoring and rewriting your architecture to be more agent-friendly. And I almost want to say that this is one of the most important things you can do as a software engineering team. Because if you really truly believe that agents are going to be writing all the code in the future, then we need to design our codebases so that they do the right thing by default.

And you'll find that there's this, I almost want to say, scale or continuum between these different pieces of building trust in your agents, where I have five of these points here. The codebase is really the best form of memory because agents love to extend existing patterns that they see. And I think this is just the nature of how LLMs work, where they're more likely to use whatever it is in their context window to make changes.

And of course, the files that the agents read and open are part of its context window. And therefore, the codebase is a really important part of that. Because agents aren't going to just refactor your code in every single PR. They're going to just look at what's already there and extend.

### 16:27 Static analysis, rules, skills, and style guides

The next level, I think, is about static analysis, where you have linters, you have compiler diagnostics, you have continuous integration. And these are guidelines and constraints that you can enforce in your codebase, so that whenever you correct your agent, you find that they just keep making the same mistake, you can add those as lint rules. Or even better, you can refactor your codebase so that the mistake that the agent is making becomes categorically impossible.

And then a step above that, and this is where we're starting to get more into less of a hard constraint and enforcement and more into the realm of guidance, you have things like rules, you have Bugbot, you have skills, which your agents will obviously sometimes and mostly use when they're doing their work. But there's also a chance that it might, for various reasons, forget to read a rule, or maybe the user that is piloting the agent ignores them. So these aren't quite as enforceable, but also an important part of setting up your environment so that you can really trust what your agents are doing.

And then finally you have a style guide, which is really only enforceable by humans in a code review. I guess you could put these in your rules and Bugbot and skills as well. But if you don't, then you have this big glaring hole in your review process, where now humans have to look at every single line that's being changed and remember to comment. And with the rate of pull requests that are coming in, it just becomes impossible.

So I definitely wouldn't recommend relying only on the style guide. I think the style guide, or looking at human reviews, is a good place to start in terms of what's missing. But you should really invest the time to think about the other four parts: your codebase, making things categorically impossible through better data structures or algorithms, static analysis, and then of course you layer that with rules and Bugbot and skills.

### 18:58 Dune: make the easy path the right path

On the codebase front, in the Grok Bot codebase, we actually have invested into setting something up that we call Dune, which is our agent-friendly framework. So the inspiration for Dune really came about from a lot of performance issues we were seeing in the Cursor agent window, and a lot of lessons came out of that exploration. But the key principle that we landed on is really that agents love taking shortcuts.

So what if we designed a framework such that the shortcut, the easy path, is the right path for agents? And also one that would be a codebase that is maybe pretty annoying for humans to work in because it's so locked down in terms of what you can do and what you can't do. But it actually creates the perfect environment for agents, especially ones that have very minimal context.

Because not every contributor to your codebase is going to be an engineer anymore. You can have designers, you can have product managers, you can have CEOs going into the codebase and shipping features. So we want to really think a lot about how we invest and set up our codebases so that even agents that are piloted by busy people with not a lot of context can do a good job by default.

### 20:31 Anti-patterns spread

And like I mentioned before, your codebase is really a form of memory for agents because they love to extend the existing patterns that they see. And the reverse is actually also true. You can invest the time to set up your codebase in a way that bad patterns are categorically impossible, or you have lint rules that prevent them. But the reverse is also true in the sense that if you have existing anti-patterns, you will actually find that these will spread kind of like a virus.

You have one small workaround, or a comment that explains a workaround, and you'll quickly find that agents just love to copy that. And then in a matter of a few days or a few weeks, you'll find that that workaround has spread everywhere, and it has become a de facto pattern for all agents. And that's a really, really bad place to be in. And that goes back to what I was saying about why it's really important, whenever you're correcting your agents, that you invest the time into thinking about codebase changes and static analysis, and of course layering them with good rules and Bugbot and skills, because of that reason.

And another analogy that I like in addition to the Michelin kitchen is this idea that your codebase is kind of like a garden, where you have workarounds that seem kind of innocent at first, but then because of the nature of agents, you just copy that pattern over and over again. And you quickly end up with a very vibe-coded codebase that is a pain in the butt to maintain and has a lot of performance issues.

### 22:32 Why Dune bans comments

So in my opinion, the perfect agent codebase is one that's so locked down that, again, it's really annoying for humans to write code in, but it's so conventional, it's so standardized, that even innocent-looking patterns are just forbidden.

And the best example of this I have is actually something that seems very, very innocent when you look at it, but when you think about it, it's actually really bad. And that pattern is agents leaving comments in the code. Now, when I first saw agents starting to do this, I initially wasn't, well, I did think that a lot of them were slop, but I also thought that it's not a bad thing, I guess, if agents are leaving comments in the code.

Because as humans we left comments in the code whenever we saw edge cases, or we needed to actually make a workaround, or leave a note to ourselves or a colleague on a particularly tricky part of the codebase. But what I quickly realized when we saw this happening in the Cursor codebase was that agents were just using the comments around the code as justification for why it wasn't going to solve the actual problem and instead paper over it with a Band-Aid or a short-term solution.

So in Dune, which is again the framework that powers Grok Bot, we made the choice to actually ban comments for that reason, so that agents would not just copy that pattern and propagate it everywhere in the codebase.

### 24:28 Your team needs a gardener

So my pitch here is that every team really needs a role that I'm calling a gardener. In the same way that with a real garden, you need someone who is thinking a lot about the things that can kind of creep in and grow in ways that you don't want. You have weeds, you have just other types of organic growth. I don't really know gardening that well. But you have unwanted pests and stuff like that that kind of creep into your codebase. And so you want to nip them in the bud as soon as possible before they start propagating everywhere.

A lot of the principles behind Dune are really centered around these three things. First of all, we want to delete tech debt that we already have, for reasons I just mentioned. We want to keep or enforce a single paved path for most blessed patterns. There should be one conventional way to do some things so that agents don't really need to guess. And there should be enough guidance in the codebase, in CI, in lint rules, so that the agents are guided to follow that path.

And then finally, whenever you see tech debt or bad patterns, your instinct should be: I need to write a lint rule against it. You don't always have to clean it up immediately, because if you write a lint rule, you can at least stop the bleeding, which doesn't solve the problem entirely, but it at least prevents it from growing.

So I definitely recommend really thinking a lot about how you can guard against anti-patterns so that they don't spread like a virus. And then also spend time to actually get your agents to clean them up so that your codebase is just constantly kept in a state where you would be happy if an agent were to copy it. That's the kind of mindset that I would recommend having.

### 26:41 Dune's architecture and process boundaries

And then I won't actually go through all the details of Dune itself, but I'll just kind of gloss through some interesting parts. So again, as a reminder, Dune is the architecture, the client framework that we built to power Grok Bot. We've invested a lot into all the things I was saying, where we have conventions. We have a lot of conventions about where code should live, and where and how code should be imported between them.

So in Dune applications, there's different concepts where, for example, features are all co-located in a single folder. You have an entry point that's in the React part of the code that determines, you can kind of think of it like a route. You have transcript cards that show up in the Grok Bot application. You have a host that runs on the Grok Bot virtual machine. And then of course you have your client, which powers the overall Dune application.

And we have a lot of strict boundaries between these things where, just as an example, things that run on the main process or the main thread in Electron aren't allowed to be run on the renderer thread. And we keep that separation very intentionally, because of lessons we learned from Cursor's agent window, where we would sometimes see code accidentally get imported into the renderer thread, slow code.

And since on the renderer thread you want your UI to be very smooth and performant, you need to make sure that you don't have any long tasks or things that take longer than 16 milliseconds if you want 60 frames per second, or 8 milliseconds if you want 120 frames per second. And so your renderer has to be constantly in a state where it can really kind of chunk up the work and not do them all at once. And so we have code within Dune that enforces these boundaries through the import and dependency graph.

But that's just an example of a pattern that we saw lead to really bad performance that we categorically eliminated through the architecture of Dune.

### 29:17 Encode the team's knowledge in the framework

And then all of these other pieces aren't that interesting. But again, the core theme here, it's not about Dune, but the idea that an agent-friendly framework of your own is actually very, very powerful. And it can encode all of the learnings that you and your best engineers on your team have tribal knowledge of.

And I think the lesson here is that, how do you take that away from what used to be in the style-guide process of reviewing code and engineers reviewing other engineers' work and leaving comments, almost like extracting that knowledge and encoding that into the framework, into the codebase itself, so that the codebase acts as the memory?

I keep coming back to this idea that the codebase is the materialized snapshot of the state in which you want your agents to extend. And you want that codebase to be so pristine, so great, that the next agent that comes along is just very likely to continue that pattern and keep it really, really good.

### 30:37 Trust the environment, not constant supervision

And if you spend enough time on this process, like I mentioned, you can really set up a Michelin kitchen or a software factory, where because you've spent so much time on all of these pieces that allow you to trust your agents, whether it's in the codebase, whether it's lint rules, whether it is diagnostics or rules or Bugbot or skills, these layers come together and provide you a lot of trust.

Because now, just imagine for a moment you're working in the Grok Bot codebase. It's super locked down. It's almost impossible to write bad code. So even an agent with very little context, even an agent with not a lot of reasoning, can come in and actually write code that's good.

And going back to my example about the Michelin factory, I think there's a lot here, where we're setting up our agents, our bots, with skills and tools. We're training them. We're setting up our kitchen in a way that makes sense for the agents and bots to do the right thing by default.

Whenever we see, for example, in a kitchen example, if we notice that one of our cooks or dishwashers is constantly tripping over something, of course we need to fix that. We need to problem-solve and ensure that others don't trip as well, because in a kitchen it's a very dangerous place and you don't want to hurt yourself. It's the same mindset, I think, that we should have with our codebases. How do we set it up so that even agents without a lot of knowledge can do a good job?

### 32:33 Grok Bot, Cursor, and the outer loop

And I think Grok Bot and Cursor play an interesting role together, where Grok Bot is really great at providing what I call the outer loop. Because you can connect Grok Bot to lots of different connectors, like Slack, Datadog, Sentry, PlanetScale, whatever services that you use, and you can aggregate all of that information together and use that to make really good decisions for itself.

Some people call this a company brain. I personally don't think you need anything that sophisticated here, because agents are really good at using tools. And so if you connect these tools to Grok Bot and you start having your Grok Bots auto-kick off things like cloud agents, you can actually find that you don't really have to invest in a lot of infrastructure to build a software factory. In fact, I'm going to cross out this term because I don't like this term.

I think you can set up this personal Michelin kitchen for yourself through Grok Bot, things like Grok Bot routines, which let you subscribe to Slack threads, to Sentry alerts that let you kick off things automatically. And when you combine all of these things that I've been mentioning, your codebase, your rules, your skills, they all compound. And Grok Bot will be able to automatically respond to events that come from the outer loop and then kick off cloud agents.

And you can also set up Cursor automations and use our SDK to set up additional bots as well that reuse a lot of these pieces of agent infrastructure that you've set up and allow them to do much more complicated tasks. So if you've done all this, then I think you can get to a point where, I have some screenshots here of some of our automations and our agents that work on Cursor, where we are automatically reproducing bug reports. We're automatically opening pull requests. We are essentially adding a lot of value to the entire team because all of these things compound.

### 35:15 The takeaway

So if we kind of zoom out again and go back to this graph, I think that to close off the talk, if you spend a lot of time thinking about all of the pieces that you need to be able to ascend the trust graph, you start getting to a place where you can really trust your agents more and parallelize your work, and also empower your entire team to build on top of these pieces of infrastructure for your agents, and empower everyone, every engineer on your team, every builder, to be extremely productive and be able to write high-quality code.

So the last thing I want to leave you with is actually this piece. Sorry, not that piece, but this piece. I think if there's only one thing you take away from my talk, it should be this slide here, which is: these are the activities that will help you build up towards a high-trust environment. Whenever you find yourself correcting and intervening with your agent, you really want to think about it from these five pieces, and where is the most effective step in this sequence in order to make your agent much more trustworthy.

And of course, I definitely recommend thinking about it in this order, where you either invest the time to make that pattern categorically impossible through your codebase and architecture and data structures, or you start looking at things like static analysis, and then you layer that on with rules and Bugbot and skills.

If you do all of that, and you also spend some time thinking about your code quality in terms of skills, you get to a place where you trust the environment so much that your agents can just be free. And personally, I have spent a lot of time on this for Grok Bot's codebase, for example, and this is really the secret. Well, it's not really a secret. It's a lot of hard work.

But I hope you found this talk useful, and please reach out to me on X. My handle is poteto, with an E. And I hope that you'll have a lot of fun and success in your own Michelin kitchen. Thanks for watching!
