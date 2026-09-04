---
title: 如何把你的 AI 变成世界级设计师
date: '2026-09-04T13:12:24.395Z'
sourceUrl: 'https://www.lennysnewsletter.com/p/how-to-turn-your-ai-into-a-world'
lang: zh
---
*一套端到端流程，释放 AI 潜藏的创造力*

作者：Anshu Chimala · 2026 年 9 月 1 日

我一直以为 AI 不擅长设计。但读完 [Anshu Chimala](https://www.linkedin.com/in/achimala/) 这篇令人震撼的文章后，我才意识到，只是我用错了方法。Anshu 曾在 Apple 领导软件工程和设计团队长达 12 年，专注于未来 AI 产品的研究与原型设计。他经常在 [X](https://x.com/anshuc) 上分享设计教程和演示（也是我最喜欢关注的人之一）。如果你想深入了解如何用 AI 打造独特体验，可以看看他的 [Substack](https://substack.com/@anshuc)，或在 [LinkedIn](https://www.linkedin.com/in/achimala/) 上与他联系。

进入正题。

* * *

**用 Claude Fable 5、三条提示词构建的对话式卡路里追踪器：**

[![](https://substackcdn.com/image/fetch/$s_!4xxl!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff7135ec6-882d-462e-9935-308206a97182_900x900.gif)](https://substackcdn.com/image/fetch/$s_!4xxl!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff7135ec6-882d-462e-9935-308206a97182_900x900.gif)

**用 Claude Opus 5、两条提示词构建的太空探索游戏：**

[![](https://substackcdn.com/image/fetch/$s_!Gt3V!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc1445c00-4834-4a86-ab85-5e53ae87a652_900x528.gif)](https://substackcdn.com/image/fetch/$s_!Gt3V!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc1445c00-4834-4a86-ab85-5e53ae87a652_900x528.gif)

**用 Claude Opus 5 + GPT-5.6 Sol、三条提示词构建的动态落地页：**

[![](https://substackcdn.com/image/fetch/$s_!o3aj!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa3d78ad3-3100-4bf0-b6be-0fc4cfa07987_640x360.gif)](https://substackcdn.com/image/fetch/$s_!o3aj!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa3d78ad3-3100-4bf0-b6be-0fc4cfa07987_640x360.gif)

我经常在 X 上发布这样的 AI 设计演示。每次发布，总有人问：“为什么模型能为你做出这么惊艳的东西，我试的时候却只能得到千篇一律的垃圾？感觉你用的完全是另一个模型。”

我并没有使用不同的模型，但我的确从这些模型身上挖出了*更多*东西。大多数人只看到了 AI 创造力的 1%。我想告诉你，如何调动剩下的 99%。

AI 模型拥有惊人的创造潜力，但训练方式压抑了这种创造力。大型语言模型本质上是下一个词元预测器：每一步，它都会查看一段文本，并根据数百万个样本预测接下来最可能出现什么。结果可能由人类评分，再把评分反馈给模型。这会教会模型做出一致、安全、符合所有人偏好的选择。

这让典型的 LLM 能胜任大多数任务，却在设计上表现拙劣。为了完成设计，LLM 必须一个词元接一个词元地把它构建出来。每当需要做设计决策，比如使用什么颜色、如何排列元素，模型都会填入它认为最可能取悦所有人的词元。结果往往重复而乏味，堪称“委员会式设计”的终极形态。

而优秀设计从感受出发，目标是唤起情绪反应。它敢于突破常规，用令人难忘、出乎意料的选择让用户惊喜。优秀设计恰好与 LLM 的本能相反：后者总是在每一步选择最可预测的方案。

不过，只要能引导模型突破那些最可预测的选择，我们就能进入一片绝大多数人都会错过的广阔创意空间。

[![](https://substackcdn.com/image/fetch/$s_!ATUP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbc7e732b-64b8-4538-8b17-82290d34d032_1774x887.png)](https://substackcdn.com/image/fetch/$s_!ATUP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbc7e732b-64b8-4538-8b17-82290d34d032_1774x887.png)

这是我在管理 AI 设计师之前，从管理人类设计师中学到的一课。我在 Apple 职业生涯的大部分时间里，都在带领一个研发团队，为未来的 AI 产品进行探索性设计。早期，我们对用户界面应该如何运作的固有认知限制了创造力，让我们不断回到那些陈旧想法上。通过严格的方法和新的流程，我们学会不再重复熟悉、舒服的东西，而是望向可能性的边缘，创造真正的新事物。我们也成了打磨细节的专家，把品质推到 Apple 的水准。

离开 Apple 后，我一直尝试把同一套流程应用到 AI 工作中。过去几年，AI 智能体已经变得极其强大。过去我的团队需要数周完成的工作，现在它们几小时就能做完。只要引导得当，它们还能创造出与现有作品截然不同的设计。

受到[双钻设计流程](https://en.wikipedia.org/wiki/Double_Diamond_\(design_process_model\))的启发，我重新设想了一套面向 AI 智能体团队，而不是人类设计师的设计流程：

1. **发现（Discover）**：探索多种方向、制定大胆而有野心的设计简报，找出超越平庸 AI 垃圾的新想法。
2. **定义（Define）**：推动 AI 突破熟悉的套路，并把多个模型串联起来，充分释放设计潜力，确立鲜明独特的设计风格。
3. **交付（Deliver）**：清理粗糙边角、聚焦关键元素，交付惊艳的最终成果。

只要遵循这三个阶段并运用每个阶段中的技巧，你就能以惊人的速度做出卓越设计，让人忍不住问：“为什么 AI 能为你创造魔法，却不能为我？”

# 发现：探索可能性空间

设计过程中最困难的时刻，就是面对一块充满无限可能的空白屏幕。应对它的最好方法，是先拓宽，再深入。AI 非常适合探索大量潜在方向。

不过，我们知道模型往往过度依赖熟悉的模式，做出保守选择。为了充分探索设计空间中的所有可能，我们要引导模型反其道而行：大胆、多变、敢于冒险。下面是两种把它推出舒适区的方法。

## 技巧 1：用种子字符串注入多样性

这里的思路，是让模型找到新的设计灵感来源，而不是依赖它从训练中学到的默认选项。如果你曾让模型设计网站或 App，大概已经见过那些默认答案长什么样。

举个简单例子，我给四个 Claude Code 实例发了同一条提示词：

**Prompt (English):**

> *Build me a landing page for my productivity app.*
>
> **中文：** 为我的效率 App 构建一个落地页。

**Claude Opus 5：**

[![](https://substackcdn.com/image/fetch/$s_!lTyI!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7b59bdf3-8a82-46d1-94c2-4a1e60ea7cbf_1456x894.png)](https://substackcdn.com/image/fetch/$s_!lTyI!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7b59bdf3-8a82-46d1-94c2-4a1e60ea7cbf_1456x894.png)

几乎每次，得到的都是紫色调渐变、左侧文字、右侧图形，以及完全相同的结构。看起来就像你见过的每一个 AI 设计网站。

我们没有要求模型做出独特或多变的东西，它不断退回自己熟悉的模式也很合理。但只要求“多样化”并不起作用：

**Prompt (English):**

> *Build me a landing page for my productivity app. Give me something totally unique. Make every design decision completely at random.*
>
> **中文：** 为我的效率 App 构建一个落地页。给我一个完全独特的方案。每一项设计决策都要彻底随机。

**Claude Opus 5：**

[![](https://substackcdn.com/image/fetch/$s_!cBfL!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff37064a7-2853-4314-b175-aa65b8a13f43_1456x876.png)](https://substackcdn.com/image/fetch/$s_!cBfL!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff37064a7-2853-4314-b175-aa65b8a13f43_1456x876.png)

结果与之前不同，却仍然不够多样。模型总是使用相同的配色、结构，甚至重复同样尴尬的陶艺比喻。它预测出的词元*听起来*随机，实际上却一点也不随机。

**问题在于，模型天生无法真正随机行事。** 它只能预测最可能出现的词元。如果想要多样性，就必须从模型外部引入。Sakana AI [发布的](https://pub.sakana.ai/ssot/)“字符串思维种子”（String Seed of Thought）就是一种方法。我们让 AI 生成随机字符串，再以它作为设计灵感。这样，模型每一次才会真正做出不同选择。

**Prompt (English):**

> *I want you to build me a landing page for my productivity app.*
>
> *Follow this procedure:*
>
> 1. *Generate a long, random alphanumeric string using a shell script.*
> 2. *Define the creative direction (color scheme, layout, typography, etc.) based on the string. Look beyond the surface for subpatterns, special numbers, anything that inspires you.*
> 3. *Use your judgment to bring this direction to life and make it look great.*
>
> *Don’t reveal the string in the design. It’s only for your inspiration.*

**中文翻译：**

> *我希望你为我的效率 App 构建一个落地页。*
>
> *请遵循以下流程：*
>
> 1. *使用 shell 脚本生成一个很长的随机字母数字字符串。*
> 2. *根据这个字符串定义创意方向（配色、布局、字体等）。不要只看表面，寻找其中的子模式、特殊数字，以及任何能给你灵感的东西。*
> 3. *运用你的判断力把这个方向实现出来，并让它看起来很棒。*
>
> *不要在设计中透露这个字符串，它只用于启发你。*

**Claude Opus 5：**

[![](https://substackcdn.com/image/fetch/$s_!nrWZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbcda7156-dbbd-4d18-a7fb-4cfc124563bf_1456x876.png)](https://substackcdn.com/image/fetch/$s_!nrWZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbcda7156-dbbd-4d18-a7fb-4cfc124563bf_1456x876.png)

输出突然丰富多了！现在我们看到了不同的配色、字体和新点子。之前那些设计，任何 Claude 用户都可能得到；现在的设计却独一无二，任何两次运行都不会产生相同结果。

## 技巧 2：让提示词更有野心

另一种强力推动模型的方法，是把提示词写得更具体、更天马行空。这样模型就有一个清晰愿景作为决策依据，而不是临场随意编造。找到独特想法的最好方式，是把你自己的品味加入其中。先想象一个灵感来源，比如电子游戏、室内设计潮流或艺术装置，再描述你希望它如何影响 AI 的输出。下面是一些例子：

> *“Build me a landing page for my productivity app, with a bold pixel art theme and stunning graphics. Each section should feel like a still from a video game, yet somehow it should all function as a landing page.”*
>
> **中文：** “为我的效率 App 构建一个落地页，采用大胆的像素艺术主题和惊艳图形。每个区块都应该像电子游戏中的一帧画面，但整体又必须真的能作为落地页使用。”

[![](https://substackcdn.com/image/fetch/$s_!KhUV!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3d880aa5-5e31-45f5-99c4-8055dcb87f4a_640x360.webp)](https://substackcdn.com/image/fetch/$s_!KhUV!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3d880aa5-5e31-45f5-99c4-8055dcb87f4a_640x360.webp)

> *“Build me a landing page for my productivity app, set in an isometric living 3D city, where different features are somehow represented by neighborhoods or buildings.”*
>
> **中文：** “为我的效率 App 构建一个落地页，把它放进一座鲜活的等距 3D 城市中，用不同的街区或建筑表现各项功能。”

[![](https://substackcdn.com/image/fetch/$s_!OSVS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa7245156-8c71-4ecc-9897-5ce76e561faf_640x360.gif)](https://substackcdn.com/image/fetch/$s_!OSVS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa7245156-8c71-4ecc-9897-5ce76e561faf_640x360.gif)

> *“Build me a landing page for my productivity app, with a radically asymmetric layout, dissonant colors and typography, and uncomfortable negative space. Break all the rules but still make it look good.”*
>
> **中文：** “为我的效率 App 构建一个落地页，使用极度不对称的布局、不协调的色彩和字体，以及令人不安的负空间。打破所有规则，但仍然要让它看起来很棒。”

[![](https://substackcdn.com/image/fetch/$s_!ycYL!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F220747d1-f561-405f-a95c-7b05fd64731b_640x360.gif)](https://substackcdn.com/image/fetch/$s_!ycYL!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F220747d1-f561-405f-a95c-7b05fd64731b_640x360.gif)

当然，真正困难的是想出值得尝试的原创点子。AI 也能帮忙，但如果你只是让它“给些创意”，得到的还是人人都能得到的平均答案。下面是我用 AI 寻找独特提示词创意的流程：

#### 1\. 让 AI 列出大量创意，刻意不写细节，目标只是启发你的想象力

> *I want to come up with a bold, unique design language for my product. Can you list as many ideas as you can, with short, high-level descriptions? Go broad, not deep.*
>
> **中文：** 我想为自己的产品创造一种大胆、独特的设计语言。请尽可能多地列出创意，每个只给出简短、高层次的描述。要广，不要深。

[![](https://substackcdn.com/image/fetch/$s_!fvto!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e1d6d22-1828-47d5-b2f6-0d88fef90ae2_1456x571.webp)](https://substackcdn.com/image/fetch/$s_!fvto!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e1d6d22-1828-47d5-b2f6-0d88fef90ae2_1456x571.webp)

#### 2\. 把最喜欢的方向可视化，记录你对不同方向的反应，再让 AI 继续细化

> *Industrial Control Panel:*
>
> *- I’m imagining something tactile. Clicky, satisfying buttons, nice sounds.*
> *- Initially I pictured something cartoony or skeuomorphic, but this feels tacky to me. Avoid that.*
> *- Instead, want consistent components and little touches that land this look without going overboard.*
> *- Gray gradients would look boring. Need more texture. Maybe we can incorporate some color, while retaining the control panel feel?*
>
> *Can you sharpen this one based on my tastes?*

**中文翻译：**

> *工业控制面板：*
>
> *- 我想要某种可以触摸的质感。按键手感要清脆利落、富有反馈感，还要有悦耳的声音。*
> *- 一开始我想象的是卡通或拟物风格，但现在觉得有些俗气，请避开它。*
> *- 我希望改用一致的组件，再加一些恰到好处的小细节，既能做出这种感觉，又不过火。*
> *- 灰色渐变会很无聊，需要更多纹理。也许可以加入一些颜色，同时保留控制面板的感觉？*
>
> *你能根据我的品味，把这个方向打磨得更鲜明吗？*

[![](https://substackcdn.com/image/fetch/$s_!Pppd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e7340b1-9a93-4d94-abc6-c6b386f3a36c_1456x449.png)](https://substackcdn.com/image/fetch/$s_!Pppd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e7340b1-9a93-4d94-abc6-c6b386f3a36c_1456x449.png)

#### 3\. 持续迭代到满意为止，再让 AI 写出用于构建的提示词

> *Can you write a concise prompt that an AI agent could use to build an initial POC page with this?*
>
> **中文：** 你能写一条简洁的提示词，让 AI 智能体据此构建一个初步的 POC 页面吗？

[![](https://substackcdn.com/image/fetch/$s_!AVWS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4ca0ce7c-c730-443a-bde3-f62996b43c7d_1456x692.png)](https://substackcdn.com/image/fetch/$s_!AVWS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4ca0ce7c-c730-443a-bde3-f62996b43c7d_1456x692.png)

如果只是把 AI 生成的想法原封不动地喂回 AI，很难得到独特结果，毕竟其他任何人也能这么做。但当你主动引导设计方向时，最后得到的东西才只可能由你创造。

不要害怕尝试那些听起来很糟糕的点子。如果你心里想：“这绝对不可能成功”，那反而说明方向对了。智能体经常会给你惊喜，让你意识到自己低估了它。即便失败，也只需丢掉结果，换个方向再试。不过，请保存那些*没有*奏效的提示词，等新模型发布后再重新测试。这样，你才能确认自己真正充分发挥了最新模型的能力。

# 定义：深化你的设计方向

到目前为止，我们讨论了如何广泛探索想法，并希望从中找到一个有潜力的初始设计。但无论提示词怎么写，AI 生成的第一版设计通常还是会显得很普通。

例如，看看前面用种子字符串得到的设计：

[![](https://substackcdn.com/image/fetch/$s_!JTgO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F25c296a8-ce8c-4633-ac96-2dcbad6d9430_1456x876.png)](https://substackcdn.com/image/fetch/$s_!JTgO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F25c296a8-ce8c-4633-ac96-2dcbad6d9430_1456x876.png)

它们很有潜力，却依然严重依赖陈旧套路：左边是文字和下方的 CTA 按钮，顶部是导航栏，右边是图形。

接下来，我们要通过鲜明的设计选择，让每个方案拥有自己的个性。下面是我最喜欢的几种方法。

## 技巧 3：用子智能体建立正向反馈循环

要改善设计，我们必须不断迭代。但只是让智能体自己查看并改进设计通常行不通，因为它无法做到客观：它审视的是自己编写的代码、过去的决策，以及先前给出的理由。AI 很难后退一步、纵观全局，然后“换个角度思考”。

解决办法是，不要让编码智能体自己判断设计何时足够好，而是让它去询问*另一个*智能体，也就是“设计评审员”（Design Critic）。评审员的工作，是查看当前设计的截图并给出反馈。它不在意设计如何实现，也不关心已经投入了多少精力，只判断作品是否真的达到了质量标准。

这种方法还有一个额外好处：我们可以用一个强大、昂贵的模型担任评审员，却不至于成本失控，因为它只负责关键决策。便宜、快速的模型承担苦活，强大的评审模型负责提供品味。

让我们回到之前的设计，用 Claude Fable 5 作为评审员试试看：

**Prompt (English):**

> *I want you to improve this design. To figure out what to focus on, use a Fable 5 subagent as a design critic.*
>
> *Follow this procedure at each iteration:*
>
> *- Capture a screenshot of the current design.*
> *- Invoke the critic in a fresh context, with just the screenshot, not the code, implementation details, or earlier iterations/critiques.*
> *- Ask it to evaluate the aesthetic that the design is going for, imagine how a top design studio would execute this aesthetic, then outline the biggest gaps.*
> *- Lastly, it should provide a score out of 10 indicating how close the current design is to that studio-level quality bar.*
>
> *Provide this guidance to the critic in its prompt:*
>
> *- It should think high-level about the overall structure and composition as well as look at the fine details.*
> *- It should watch out for patterns that feel overdone, excessive, or otherwise obviously AI-generated, and penalize them.*
> *- It should provide tight, specific feedback, not vague prose.*
> *- It should be bold and opinionated, not rely on what’s safe or easy.*
>
> *Your work is only complete when the critic independently deems it 9/10 or higher. Do not put that criterion in the critic prompt; keep it objective in its scoring. Use the same critic prompt each time.*

**中文翻译：**

> *我希望你改进这个设计。为了确定改进重点，请使用一个 Fable 5 子智能体担任设计评审员。*
>
> *每一轮迭代都遵循以下流程：*
>
> *- 截取当前设计的屏幕截图。*
> *- 在全新的上下文中调用评审员，只提供截图，不要提供代码、实现细节，也不要提供之前的迭代或评审。*
> *- 让它评估设计试图呈现的美学风格，想象顶级设计工作室会如何执行这种风格，然后列出当前最大的差距。*
> *- 最后，让它给出 10 分制评分，说明当前设计距离工作室级质量标准还有多远。*
>
> *在评审员的提示词中加入以下指导：*
>
> *- 它既要从高层思考整体结构和构图，也要观察细节。*
> *- 它应留意那些用滥了、过度了，或明显带有 AI 生成痕迹的模式，并为此扣分。*
> *- 它应给出紧凑、具体的反馈，而不是含糊的空话。*
> *- 它应大胆、有主见，不要依赖安全或省事的选择。*
>
> *只有当评审员独立判断作品达到 9/10 或更高时，你的工作才算完成。不要把这个通过标准写进评审员的提示词，要让它保持客观评分。每次都使用完全相同的评审员提示词。*

**Claude Opus 5：**

[![](https://substackcdn.com/image/fetch/$s_!nik4!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5e045d71-d5f7-436a-be1f-eb870df24062_1456x1861.png)](https://substackcdn.com/image/fetch/$s_!nik4!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5e045d71-d5f7-436a-be1f-eb870df24062_1456x1861.png)

现在，每个设计都有了自己的鲜明个性，不再反复套用同一种模板，同时又保留了最初的高层美学方向。

值得注意的是，每个案例中 Fable 使用的输出词元都不到 10%。如果直接让 Fable 重新设计整个页面，成本会翻倍，耗时也会长得多。

这类循环如何设置非常重要。下面是一些建议：

* **让批评标准尽可能清晰、客观。**
  * 差：英文：“Judge if our design looks beautiful, not AI-generated.” 中文：“判断我们的设计是否漂亮、是否不像 AI 生成。”这太主观了，每次运行得到的结果都可能天差地别。
  * 尚可：英文：“Review the aesthetic we’re going for, visualize how a top design studio would execute it, then judge our design’s quality against that bar.” 中文：“评估我们追求的美学风格，想象顶级设计工作室会如何实现它，再按照这一标准判断我们的设计质量。”提示词仍然有些模糊，但至少提供了一致的框架和质量标准。
  * 好：英文：“Here are 5 designs: 4 professional examples and 1 screenshot of our product. Rank them by polish and taste level.” 中文：“这里有 5 个设计：4 个专业案例，以及 1 张我们产品的截图。请按完成度和品味水平给它们排序。”这条指令具体、客观，也为判断提供了视觉基准。
* **提供示例图片，展示目标质量标准。** 你可以使用可比的截图、自己喜欢的设计，甚至 AI 生成的概念图。告诉评审员把它们当作基准或情绪板，而不是需要复制的目标。你并不希望它直接照抄别人的设计。
* **谨慎设置停止条件。** 否则，评审员可能永远觉得设计不够好，智能体只能无助地燃烧词元来讨好它。先让它迭代一两轮，观察结果是否正在收敛，再决定要不要增加轮次。
* **为每项工作选择合适的模型。** 评审员可以考虑更大的模型，因为更多参数通常意味着更好的设计感，以及更广阔的创意分布。小模型可以有效承担实现工作，但不要小得过头，你仍然需要一个有能力把设计方向执行到位的模型。

## 技巧 4：用图像生成丰富设计

编码智能体很喜欢写代码，却通常不会主动使用图片。它们倾向于选择更省事的代码方案：渐变、形状和基础图案。这些都是暴露设计出自 AI 之手的典型破绽。

有些智能体内置了图像工具，却很少充分使用；另一些默认没有图像工具，但只要提供 API 密钥，就能轻松调用 OpenAI 或 Gemini API 生成图片。

让我们把这个方法用到上一步的设计中：

**Prompt (English):**

> *The design is pretty plain. Add more personality using image generation. Consider shaders or 3D effects in combination with images to create more interesting visuals.*
>
> *For image generation, use this OpenAI API key (only use it locally, do not store it in the code or product): sk-a1b2c3d4…*
>
> *Verify that your work looks right frame-by-frame in the browser.*

**中文翻译：**

> *这个设计相当平淡。使用图像生成赋予它更多个性。考虑把着色器或 3D 效果与图片结合起来，创造更有趣的视觉效果。*
>
> *生成图片时，请使用这个 OpenAI API 密钥（仅限本地使用，不要把它存进代码或产品）：sk-a1b2c3d4…*
>
> *在浏览器中逐帧验证结果是否正确。*

**Claude Opus 5（前后对比）：**

[![](https://substackcdn.com/image/fetch/$s_!kEu8!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7e2a6925-7451-4abe-aaa8-bc92823dd69a_1456x399.gif)](https://substackcdn.com/image/fetch/$s_!kEu8!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7e2a6925-7451-4abe-aaa8-bc92823dd69a_1456x399.gif)

[![](https://substackcdn.com/image/fetch/$s_!gj_X!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff4ae7b09-1555-4ade-850c-212cb0d089b2_1456x399.gif)](https://substackcdn.com/image/fetch/$s_!gj_X!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff4ae7b09-1555-4ade-850c-212cb0d089b2_1456x399.gif)

[![](https://substackcdn.com/image/fetch/$s_!h8ZM!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7cd81d80-09c1-4244-9651-43bba85771a4_1456x399.gif)](https://substackcdn.com/image/fetch/$s_!h8ZM!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7cd81d80-09c1-4244-9651-43bba85771a4_1456x399.gif)

[![](https://substackcdn.com/image/fetch/$s_!kBom!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc02123f6-00f8-4063-8463-5050d2649647_1456x399.gif)](https://substackcdn.com/image/fetch/$s_!kBom!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc02123f6-00f8-4063-8463-5050d2649647_1456x399.gif)

这类图片和特效能迅速为设计增加大量个性，让它不再那么明显地像 AI 生成，因为它们展现出的投入不只停留在表面。

根据你的工具组合，可以用不同方式让智能体接入图像生成工具：

* **如果你使用 Codex、Antigravity 或 Grok Build：** 告诉智能体使用内置的图像生成功能。它本来就知道怎么做，只是除非明确要求，否则很少主动使用。
* **如果你使用 Claude Code 或其他智能体，同时订阅了 ChatGPT：** 告诉智能体：“Use the Codex CLI to generate images. Help me install it if it isn’t already present. Make sure it’s billing my subscription, not an API key.” 中文：“使用 Codex CLI 生成图片。如果尚未安装，请帮我安装。确保扣除的是我的订阅额度，而不是通过 API 密钥按量计费。”这样就能使用 ChatGPT 订阅来生成图片，无需额外付费。
* **如果你只使用 Claude 或其他工具：** 最简单的方式，是向智能体提供 OpenAI 或 Gemini API 密钥来生成图片。我建议专门为智能体创建一个严格限制消费额度的独立密钥。即使密钥泄露或智能体误用，成本也能受到控制；撤销它时，也不会影响其他工作。
* **如果你经常把密钥粘贴进聊天：** 最好改为把密钥放在文件里，再让项目中的智能体读取。可以这样告诉它：“Create a gitignored file called `.env.agents`, store this API key in it, and note to yourself in `AGENTS.md`/`CLAUDE.md` that these keys are for you to use during development (but must not ship with the product).” 中文：“创建一个被 Git 忽略的 `.env.agents` 文件，把这个 API 密钥存进去，并在 `AGENTS.md`/`CLAUDE.md` 中给自己留下注释：这些密钥可以在开发期间使用，但绝不能随产品发布。”

## 技巧 5：需要更高级的动效时，使用视频生成

如今的视频生成模型极其强大，但大多数人仍然把它们当成生成 UGC 广告，或生成 Will Smith 吃意大利面的短片工具。其实，它们在日常设计工作中同样能创造奇效。

市面上有很多视频模型，最佳选择也经常变化，所以我喜欢使用 [fal.ai](http://fal.ai/) 这样的聚合平台。这样，只需给智能体一个 API 密钥，它就能评估不同选项并挑出最合适的模型，不必接入多套服务。

下面是我最喜欢的两种视频模型用法。

#### 创造惊艳的动态图形

诀窍是生成一段纯色背景的循环视频，再通过色度键抠像去除背景（类似绿幕抠像）；在更复杂的情况下，也可以使用视频抠像模型移除背景。这样得到的动画可以叠加在 UI 的任何位置，却不会让人觉得它只是一段视频。

例如，我拿前面的一个设计运行了下面这条提示词：

**Prompt (English):**

> *Can you replace the image on this page with a looping video clip that does something more interesting? Have the crystal splinter apart and slowly spin around. It should have awesome glassy effects that refract the page background and cast shadows and light around it.*
>
> *To get convincing glass refraction effects, render the video of the glass over the page background colors first (so it bakes in the refraction effects), then remove the background with a video matting model.*
>
> *Use this fal.ai API key: sk-a1b2c3d4…*
>
> *Find appropriate recent models for video generation and background removal.*

**中文翻译：**

> *你能把页面上的图片替换成一段循环视频，让它做一些更有趣的事情吗？让水晶裂成碎片，并缓慢旋转。它应该拥有惊艳的玻璃质感：折射页面背景，并在周围投射阴影和光线。*
>
> *为了获得可信的玻璃折射效果，先在页面的背景颜色之上渲染玻璃视频，把折射效果烘焙进视频，然后使用视频抠像模型移除背景。*
>
> *使用这个 fal.ai API 密钥：sk-a1b2c3d4…*
>
> *寻找适合的视频生成和背景移除新模型。*

**GPT-5.6 Sol（前后对比）：**

[![](https://substackcdn.com/image/fetch/$s_!SAf-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Faa994e2f-caec-40bf-8cc5-8a1ef101dd21_1456x399.gif)](https://substackcdn.com/image/fetch/$s_!SAf-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Faa994e2f-caec-40bf-8cc5-8a1ef101dd21_1456x399.gif)

这比纯代码能做出的效果丰富得多：趣味十足的焦散反射、玻璃折射，以及复杂逼真的物理动态效果。

#### 在不同状态之间创造流畅过渡

这是视频模型一个严重被低估的用例。许多视频模型除了能从文本生成视频，还能在关键帧图像之间插值。因此，你可以拿两张产品静态图，生成一段连接它们的过渡视频。当用户执行某个操作时，比如导航到 App 的另一个页面，就播放视频；也可以响应滚动、滑动等手势，逐帧拖动视频进度。

下面是一个展示滚动效果的演示页。我在 Codex 中用 GPT-5.6 Sol，只用一条提示词就构建了它：

**Prompt (English):**

> *Build a demo page for a suitcase that uses a video model to create interactive transitions between a couple of screens. Each screen should show the suitcase in a different state, with vertical motion that feels appropriate for scrolling:*
>
> *- Initially, have the suitcase floating high up in the air.*
> *- Then have it land on the floor and pop open.*
> *- Finally, have its contents neatly land into it from the top.*
>
> *Generate the initial frame using your image generation skill. Then, generate a video clip that starts from that frame and animates to the next state. Use the final frame of that video to seed the next transition so that it continues seamlessly. Scrub through the transitions one by one as the user scrolls.*
>
> *Use this fal.ai API key: sk-a1b2c3d4…*
>
> *Use a video model with strong physics and consistency, like Seedance 2.5.*

**中文翻译：**

> *为一只行李箱构建一个演示页面，使用视频模型在几个屏幕画面之间创造交互式过渡。每一屏应展示不同状态下的行李箱，并配合滚动使用合适的垂直运动：*
>
> *- 开始时，让行李箱高高悬浮在空中。*
> *- 然后，让它落到地面并弹开。*
> *- 最后，让里面的物品从上方整齐落进行李箱。*
>
> *使用图像生成技能制作初始帧。然后生成一段从这一帧开始、运动到下一个状态的视频。把该视频的最后一帧作为下一段过渡的种子，让动画无缝延续。随着用户滚动，依次拖动这些过渡动画。*
>
> *使用这个 fal.ai API 密钥：sk-a1b2c3d4…*
>
> *使用 Seedance 2.5 这类物理效果和一致性都很强的视频模型。*

**GPT-5.6 Sol：**

[![](https://substackcdn.com/image/fetch/$s_!E1CZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2f3bb583-375b-4a12-aa57-64a10bf2d9e7_960x540.gif)](https://substackcdn.com/image/fetch/$s_!E1CZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2f3bb583-375b-4a12-aa57-64a10bf2d9e7_960x540.gif)

各屏画面之间的过渡会跟随用户滚动流畅推进，交互起来也很有趣。这样的设计会让用户*想要*继续滚动，阅读更多产品内容。而它只用了一条提示词！

# 交付：把设计打磨成用户喜爱的作品

有了独特出众的设计后，最后一步就是打磨细节，使其达到可正式上线的生产级标准。AI 可以构建惊艳、醒目的视觉效果，但要确保设计合理、流程顺畅，并真正服务于用户的实际目的，你的判断力才是关键。

## 技巧 6：删掉没有价值的元素

AI 喜欢不断添加，却很少主动删减。设计由 AI 生成的最大迹象之一，就是它会把所有事情解释得过头，或塞进一些毫无实际用途的元素。相反，懂得克制的设计会立刻显得高级而有品味。

打磨 AI 设计时，我的大部分精力都用在删除上。比如，我构建卡路里追踪 App 时，下面是 Claude 给出的初始设计：

[![](https://substackcdn.com/image/fetch/$s_!G64j!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdc9186ef-2b04-42a0-a460-8898b0590797_1456x964.png)](https://substackcdn.com/image/fetch/$s_!G64j!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdc9186ef-2b04-42a0-a460-8898b0590797_1456x964.png)

我描述了 App 的功能，还明确要求“clean, minimalist design”（中文：“干净、极简的设计”）。结果并不差，作为完全由 AI 生成的作品，当然也很令人印象深刻。但即使我要求了极简，设计里仍有大量没有贡献价值的东西：

* 背景和进度条上的粉色发光效果
* 文字上随意出现的颜色与高亮
* 展示一天全部食物时使用了多余标签和留白，而图片本身已经表达清楚
* 自定义按钮和文本框，反而不如 iOS 内置组件好看

于是，我让 Claude 收敛一些：

* “Simplify the layout into an image-centric grid”（中文：把布局简化为以图片为中心的网格）
* “Get rid of gradients, glows, and unnecessary containers”（中文：去掉渐变、发光和不必要的容器）
* “Aim for a truly minimalist aesthetic that feels Apple-native”（中文：追求真正极简、具有 Apple 原生感的美学）

结果如下：

[![](https://substackcdn.com/image/fetch/$s_!iD6y!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffdf80ee5-9f43-44e9-93cf-c477a9e49128_1456x964.png)](https://substackcdn.com/image/fetch/$s_!iD6y!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffdf80ee5-9f43-44e9-93cf-c477a9e49128_1456x964.png)

以我受过训练的眼光看，结果*好得多*。它有明确主张，也让视觉本身说话。它使用原生 iOS 组件，过多的色彩和渐变消失了，文字更小、更简单、更紧凑。这才是好设计。

今天的 AI 模型绝不会自行想到这些选择。记住，AI 不喜欢冒险，而精简设计、删除代码本身就是冒险。模型需要你推它一把。仔细审视你的设计，问问自己哪些东西真的必须存在。屏幕上放得更少，往往反而能表达*更多*，因为你可以抓住用户注意力，而不是用杂乱信息压垮他们。

## 技巧 7：消除 AI 痕迹

每个 AI 模型都有自己特别爱滥用的模式。这些模式本身未必糟糕，但当用户在每个设计中反复看到它们时，它们就会成为“AI 垃圾”的显著痕迹。

识别这些模式并了解替代方案，是让设计更精致、更高级的简单方法。你不必把每一种模式都列为禁区，但每次使用它们都应该是有意识的选择。

下面是常见的 AI 设计痕迹：

[![](https://substackcdn.com/image/fetch/$s_!JrnJ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F65ceb75e-aeb7-411d-99fa-eacaad0dbdae_1456x2424.png)](https://substackcdn.com/image/fetch/$s_!JrnJ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F65ceb75e-aeb7-411d-99fa-eacaad0dbdae_1456x2424.png)

你可以从一开始就在提示词中禁止这些模式，但我不建议这样做。不是每一种渐变、卡片或标签都天然糟糕，强迫 AI 避开它们，反而可能让模型过度思考，引入更加奇怪的模式。更好的做法，是在细化设计时打开这张清单，逐项检查。然后让 AI 尝试替代方案，看看你是否更喜欢新的结果。

## 技巧 8：亲手重写文案

模型填进设计的文案不会改变视觉形式，却可能最能影响用户对设计的判断：它究竟有品味，还是一堆垃圾。我们每天都被 AI 生成的文字轰炸，读起来令人疲倦，也缺乏自然感。

把 AI 生成的文案当成设计师眼中的“Lorem ipsum”占位文本：它能帮助你看清结构，但最终必须重写。确保由真人逐行审读文案，并用统一的语气重新润色。

这个过程能带来下面这样的差异：

[![](https://substackcdn.com/image/fetch/$s_!sB3J!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3174cc8a-c197-4be5-991d-0834d05cfc42_1456x1949.png)](https://substackcdn.com/image/fetch/$s_!sB3J!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3174cc8a-c197-4be5-991d-0834d05cfc42_1456x1949.png)

人工版本几乎总是更精简明了，也没那么容易让人翻白眼。用户看到一堵 AI 生成的文字墙时，会本能地想要跳过。花点心思写出清晰、言之有物的文案，用户才真的会读你想说的话。

# 充分释放 AI 的设计潜力

当今大多数 AI 生成设计都是垃圾，但只要引导得当，AI 完全可以成为优秀的设计师。随着 AI 持续进步，新模型将开启人类设计师梦寐以求的全新设计可能，前提是我们有能力引导它们。当 AI 成为每一套设计流程的一部分，真正的优势将来自你是否知道如何从中挖出更多潜力。

无论面对今天还是明天的 AI 模型，下面这套三阶段流程都能帮助你引导 AI 智能体，从一张白纸走向真正独特、充分发挥 AI 潜力的设计：

1. **发现（Discover）**：找到超越 AI 垃圾默认选项的新想法。
2. **定义（Define）**：确立专属于你和产品的独特设计风格。
3. **交付（Deliver）**：清除 AI 设计留下的粗糙边角，交付令人愉悦的最终成果。

归根结底，究竟是“有品味”还是“垃圾”，往往见仁见智。优秀设计会把字体、颜色、布局等元素组合起来，唤起某种感受，而不只是拼出一幅视觉画面。如果你的产品用起来令人愉悦，用户不会在意它究竟是 Claude 一天设计出来的，还是一群人花几个月完成的。专注于感受，你的设计就永远能够脱颖而出，无论它是否由 AI 生成。

*谢谢你，Anshu！*

*祝你度过充实、高效的一周 🙏*

* * *

**如果你觉得这份 Newsletter 有价值，请分享给朋友；还没有订阅的话，也可以考虑订阅。目前提供[团体折扣](https://www.lennysnewsletter.com/subscribe?group=true)和[赠礼选项](https://www.lennysnewsletter.com/subscribe?gift=true)。**

诚挚问候，

Lenny 👋
