---
title: 我们如何打造 Devin 的 Mac
date: '2026-09-20T15:16:45.719Z'
sourceUrl: 'https://x.com/jkelleyrtp/status/2101364551296143772'
lang: zh
---
上周，我们为 Devin 推出了 macOS 支持，把 Devin 在云端自主开发的工作流扩展到了 iOS App、原生 macOS 应用，以及所有依赖 Apple 开发工具的项目。

<video autoplay loop muted playsinline preload="metadata" poster="https://pbs.twimg.com/tweet_video_thumb/HSh6ULObMAAwje6.jpg" style="display:block;width:100%;height:auto;margin:1.5rem auto">
  <source src="https://video.twimg.com/tweet_video/HSh6ULObMAAwje6.mp4" type="video/mp4">
</video>

大家非常喜欢！现在，Devin 已经成为首个同时支持 Linux、Windows 和 macOS 三个平台的云端智能体。本文将深入拆解我们如何大规模部署 macOS 虚拟机：磁盘、网络、环境预配置、桌面串流和 computer use（计算机操作）等能力，几乎都由我们从零实现。

## 为什么 Devin 需要一台 Mac

在本地，大多数编程智能体都能编写 Swift 文件、编译代码，并不断迭代，直到消除所有错误。但确认一个面向用户的 iOS App 能够编译，与验证它实际运行是否正常，是两回事。在云端完成这个闭环则更加困难。

假设你要开发一款 iPhone 游戏：即使 App 已经关闭，下次打开时也应该从玩家暂停的位置继续。游戏能够编译、能够启动，但它真的恢复了正确的状态吗？要验证这一点，智能体必须亲自游玩、暂停、退出、重新启动，再确认游戏是否正确续接。现在，有了自己的 Mac，Devin 就能完成这一整套验证。

<video controls playsinline preload="metadata" poster="https://pbs.twimg.com/amplify_video_thumb/2101071668349460480/img/myENFXUpaVmG5wUb.jpg" style="display:block;width:100%;height:auto;margin:1.5rem auto">
  <source src="https://video.twimg.com/amplify_video/2101071668349460480/vid/avc1/856x720/LDI9O-yI0ZFDzg22.mp4?tag=29" type="video/mp4">
</video>

## 打造 Devin 的 Mac

Devin 是一名自主软件工程师。把它带到 macOS，意味着必须保留它走完整个闭环的能力：在运行中的应用里复现问题，调查原因，修改代码，再验证修复是否有效。

在虚拟机中运行 macOS 并非难事。但要把这台虚拟机变成 Devin 的工作区，还要完成大量额外工作：磁盘必须保留会话中的工作成果；网络必须执行该会话的访问规则；开发环境必须在 Devin 启动前准备就绪。随后，用户和 Devin 都要能看到并操作正在运行的软件。

这些工作要从应用层以下很远的地方开始，也就是虚拟机的磁盘。

## 磁盘快照

AWS EC2 Mac 提供裸金属 Mac 主机。在这些主机上，我们的虚拟机管理器使用 Apple 的 Virtualization.framework 运行 macOS 客户机。客户机镜像由我们自行制作，并在每次会话期间持续管理。

第一步，是把这些客户机接入 Devin 的快照系统。用户在 Devin Cloud 上完成的许多工作都是异步的：用户不必盯着每一步操作，空闲会话也不必让虚拟机一直运行。快照系统会保存会话的依赖项、文件和代码改动，让用户回到同一个环境后可以迅速继续工作，而不必在一台新虚拟机上从头配置。

无论在 Linux 还是 macOS 上，我们的快照系统都会作为独立进程运行，负责处理虚拟机的磁盘读写。客户机操作系统看到的只是普通虚拟磁盘，无须知道磁盘背后实际上由快照支撑。

![](https://pbs.twimg.com/media/HSiFyw0aYAAxQbS.jpg)

在 Linux 上，我们通过 vhost-user 把虚拟机连接到这个存储进程。Apple 的 Virtualization.framework 不支持 vhost-user，但支持网络块设备（Network Block Device，NBD）连接，它提供了另一套读取和写入块设备的协议。我们为现有快照系统增加了 NBD 前端：对外使用 Apple 支持的接口，内部则继续沿用同一套存储架构。

在两个平台上，客户机关机后，存储进程都会继续运行，以写入尚未落盘的数据并上传更新后的快照。虚拟机监控器会等这一步完成，再继续清理。如果两个进程同时停止，就可能打断保存会话所必需的工作。

![](https://pbs.twimg.com/media/HSiLxUybkAAvOhL.jpg)

## 进入以太网世界

客户机接入持久化存储后，下一个边界就是网络。Devin Cloud 已经能够控制 Linux 和 Windows 工作区的网络访问：出站流量遵循会话配置的访问规则，对受保护宿主机基础设施的访问则会被阻止。要把 Mac 工作区带入 Devin，我们必须在 macOS 的网络原语之上保留这些控制能力。

Apple 的 Virtualization.framework 提供三种把客户机接入网络的方式：

1. 桥接网络把以太网帧直接发送到宿主机的物理网络接口。
2. NAT 让客户机共享宿主机的网络连接，由 macOS 负责网络配置。
3. 文件句柄连接通过本地 Unix 数据报套接字交换原始以太网帧。每个数据报携带一个帧，而收到帧之后如何处理，则由我们负责。

NAT 是让虚拟机联网最简单的方式。但 Apple 的实现还会管理 macOS 数据包过滤器 pf 中的规则，并重新加载其配置。我们的网络控制同样依赖 pf。于是，在我们的环境里，这两个彼此独立的系统会争相配置同一个数据包过滤器。

我们需要客户机流量在整个生命周期内始终遵循会话的访问规则，而不能取决于哪个网络管理器最后更新了防火墙。因此，我们没有采用 Apple 托管的 NAT，而是选择了文件句柄连接。

这样一来，我们收到的不再是可以直接路由的 IP 数据包，而是原始以太网帧。例如，客户机在向网关发送流量前，会先通过 ARP 查询网关的以太网地址。现在，回应这项请求成了我们的责任。

我们自行构建了一个用户态以太网网关来处理这道边界。它会响应 ARP 请求，验证以太网寻址，并检查客户机的源 IP 是否与分配给它的地址一致。通过验证的 IP 数据包随后会进入宿主机上的隧道接口，再由数据包过滤规则和代理负责路由，并执行会话的访问策略。返回流量则沿相反路径传输：网关会把 IP 数据包重新封装成以太网帧，再交给客户机。这件事着实不简单！

![](https://pbs.twimg.com/media/HSiMeGjboAANm5i.jpg)

代价是，原本由托管网络提供的链路层处理和验证，现在都要由我们自己负责。作为交换，我们把 Apple 的 NAT 管理移出了这条路径，并让客户机接入了完全由我们掌控的网络控制系统。

## 配置开发环境

存储和网络构成了云端工作区的基础。但一台能够启动、能够联网的 Mac，还不能直接交给 Devin 做开发。

安装 macOS 只能得到一台可启动的机器，不能得到干净可用的开发环境。客户机镜像至少需要：

- 一个用户账户
- 可用的桌面
- Xcode 工具链
- 允许 Devin 观察和控制应用的权限

任何没有预先处理好的设置问题，都可能让 Devin 卡在必须由人点击确认的权限对话框前。

![](https://pbs.twimg.com/media/HSiGZ_XaoAAsPu8.jpg)

我们本可以用 UI 自动化完成这些配置：创建用户、进入桌面、触发权限请求，再逐一批准。但协调这一连串交互既不可靠，成本也很高。

因此，我们选择在宿主机上挂载客户机镜像的磁盘，直接设置系统用户并修改 macOS 的内部配置数据库，为镜像预置好所需状态。换句话说，我们不再逐个点击 UI 对话框，而是在构建客户机镜像时，就把 Devin 需要的环境准备好。

不过，并非所有工作都能离线完成。我们不希望 Devin 与系统初始化争抢资源，因此会启动准备好的镜像，安装剩余的开发工具，验证 Xcode，预热 Simulator，并等待后台初始化和 Spotlight 索引完成。我们还会关闭这些开发会话不需要的后台守护进程。

这些步骤把配置和预热工作从 Devin 的执行路径中移开，让它开始构建并操作 App 时，环境已经完全就绪。

## 桌面串流与控制

工作区准备就绪后，用户还需要一种进入其中的方式。他们应该能通过 Devin 的 VNC 看到自己的 App 正在运行，亲自试用，并在需要时随时接管。除了 Mac 桌面之外，我们还新增了 iOS Simulator 面板，让用户可以直接查看并操作自己的 App。

<video controls playsinline preload="metadata" poster="https://pbs.twimg.com/amplify_video_thumb/2101085349376348160/img/XBX1qVvr_PoyHcev.jpg" style="display:block;width:100%;height:auto;margin:1.5rem auto">
  <source src="https://video.twimg.com/amplify_video/2101085349376348160/vid/avc1/1388x720/F-0gfCS40jwLFvFc.mp4?tag=29" type="video/mp4">
</video>

无论是哪一种视图，把画面显示出来都只是第一步。实时画面必须足够灵敏，用户才能真正操作应用。

<video controls playsinline preload="metadata" poster="https://pbs.twimg.com/amplify_video_thumb/2101362200040603648/img/FWIUtkRZpPF8KF6B.jpg" style="display:block;width:100%;height:auto;margin:1.5rem auto">
  <source src="https://video.twimg.com/amplify_video/2101362200040603648/vid/avc1/1008x720/ghyuOoIabwv2Rdj1.mp4?tag=29" type="video/mp4">
</video>

对于 Mac 桌面，就连保留最近捕获的一帧画面也需要谨慎处理。Apple 的桌面捕获 API ScreenCaptureKit 从一个容量有限、会重复使用的缓冲区池中提供图像。如果屏幕静止时一直占用其中一个缓冲区，下一次画面变化就可能无法及时送达。因此，需要保留某一帧时，我们会自行复制一份，而不是占住捕获系统接下来还要使用的缓冲区。

捕获完成后，桌面和 Simulator 的视频都要经过编码、传输和显示。任何一个阶段跟不上，等待处理的帧就会不断堆积。于是，串流画面看起来可能很流畅，显示的却是过时的应用状态。在前面的游戏示例中，用户按下“暂停”后，可能仍会看到游戏继续运动，尽管 App 早已处理了这次输入，因为客户端播放器还在播放按下按钮之前积压的帧。

我们会限制各阶段之间排队等待的帧数，避免重放一长串过时画面。不过，这需要格外小心，因为压缩视频帧往往依赖之前的帧；随意丢弃一帧，可能导致后续帧都无法解码。当 Simulator 串流落后时，我们会从较近的关键帧恢复，或者请求一个新的关键帧，让解码器获得新的起点，而不必重放此前错过的全部画面。

## 快如闪电的 computer use

现在，用户已经能查看并控制 App。Devin 也需要这种能力，但它还需要一种高效的方法来检查界面，并确认自己的操作产生了什么结果。到这里，基础设施才重新接回开发闭环：Devin 不只是构建 iPhone 游戏，还要亲自游玩、暂停、退出和重启，以验证游戏是否正常工作。

<video controls playsinline preload="metadata" poster="https://pbs.twimg.com/amplify_video_thumb/2101363445568565248/img/BAdixO59BvD65cBI.jpg" style="display:block;width:100%;height:auto;margin:1.5rem auto">
  <source src="https://video.twimg.com/amplify_video/2101363445568565248/vid/avc1/960x720/WBVkBlLIGS7K-_15.mp4?tag=29" type="video/mp4">
</video>

为此，Devin 依靠 computer use 来观察 UI、与之交互，并检查结果。最简单的做法，是截取屏幕画面，识别某个控件，点击它所在的坐标，再截取一张画面查看发生了什么。

这种朴素的截图方案可能非常缓慢，成本也很高。例如，为了检查游戏能否暂停和继续，Devin 必须先截图，把图片交给模型处理以定位“Resume”按钮，确定按钮坐标，执行点击，然后继续截图。要覆盖多条暂停、退出和重启路径，这种做法很快就会变得难以承受。

对 Web 应用来说，浏览器自动化可以大幅提升效率。浏览器会暴露页面结构，因此 Devin 可以直接定位一个有名称的按钮，或读取某个字段的值，无须从像素中重新推断一切。

原生 macOS App 和运行在 Simulator 中的 iOS App 不在浏览器接口之内，但它们也会暴露自己的结构。辅助功能树（Accessibility Tree）原本是为辅助技术而设计的，它通过角色、名称、值、状态和关系来描述控件。Devin 不必再根据外观猜测某个元素是不是写着“Resume”的按钮，而是可以直接从辅助功能树中确认，并了解这个按钮支持哪些操作。

我们把这套结构接入 Devin 的 computer use 工具，使它可以查询和操作原生界面，包括运行在 iOS Simulator 中的 App。Devin 会查询屏幕上的控件，并通过返回的控件引用执行操作。操作完成后，它会再次读取辅助功能树，并报告发生了哪些变化。

![](https://pbs.twimg.com/media/HSiOunVacAADiFP.jpg)

不过，辅助功能并不会暴露所有信息，截图仍然是检查视觉表现的重要工具。在游戏示例中，即使看到暂停菜单消失，也不能证明玩家的位置已经正确恢复，因为游戏画面可能是直接绘制出来的，并不会出现在辅助功能树中。

这些能力建立在 Dioxus 的开源项目 [accessibility-cli](https://github.com/DioxusLabs/accessibility-cli) 之上。Dioxus 现在已经[加入 Cognition](https://cognition.com/blog/welcoming-dioxus?dcid=6bbe6391-b832-4511-9436-fdbaeb3559a6)。`accessibility-cli` 提供辅助功能、输入和画面捕获等基础能力，Devin 则把这些原语组合成前文所述的观察、引用和操作反馈闭环。

有了结构化的控件访问能力，再结合运行中 App 的截图，Devin 就能走完单靠编译无法覆盖的验证闭环。

## 今天就开始构建

为了把 macOS 带到 Devin Cloud，我们完成了从虚拟磁盘到应用界面的整条技术栈：保存会话状态，执行网络访问规则，准备开箱即用的环境，并为用户和 Devin 提供操作运行中 App 的工具。

这些部分组合起来，让 Devin 能在自己的云端工作区里构建并验证 iPhone、iPad 和 Mac App；与此同时，用户可以看到结果，并在需要时随时接管。

我们很期待看到你接下来会构建什么。

[https://devin.ai/](https://devin.ai/)
