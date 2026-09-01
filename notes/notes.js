/* =========================================================================
   notes/notes.js — the knowledge-notes manifest.

   THIS IS THE ONE FILE YOU EDIT TO ADD A NOTE.

   To add a note:
     1. Copy notes/_template.html to notes/<your-slug>.html and write it.
     2. Add an entry to the TOP of the NOTES array below.

   Entry shape:
     {
       slug:     "your-file-name-without-.html",  // -> notes/your-file-name.html
       title:    { zh: "中文标题", en: "English title" },
       summary:  { zh: "一句话摘要", en: "One-line summary" },
       date:     "2026-05-29",                     // ISO date, used for sorting
       tags:     ["LLM", "Training"],              // free-form, also build the filter bar
       category: "inference"                       // see the four values below
     }

   `category` decides which section of the index page a note lands in:
     "inference" — 推理引擎.  vLLM internals, KV cache, GPU memory.
     "parallel"  — 分布式与并行.  Sharding schemes, communication cost,
                   inter-GPU choreography.
     "model"     — 模型与算子.  Model anatomy, kernel authoring.
     "industry"  — 行业分析.  Time-stamped snapshots that go stale:
                   leaderboards, hardware rankings, trend radars.

   Section order is fixed in scripts/notes-list.js, with 行业分析 last so the
   rolling snapshots don't bury the evergreen notes. A note whose category is
   missing or misspelled is not dropped — it shows up under 其他 / Other.

   Notes are sorted by `date` descending automatically — order here doesn't
   matter, but keeping newest on top is tidy.

   `title` / `summary` may also be a plain string instead of a {zh, en}
   object if you don't want a translation; it will show for both languages.
   ========================================================================= */

window.NOTES = [
  {
    slug: "hpc-node-programming-models",
    title: {
      zh: "节点级编程模型:OpenMP GPU、SIMD、同步、OpenCL、SYCL 与 CUDA",
      en: "Node-Level Programming Models: OpenMP GPU, SIMD, Sync, OpenCL, SYCL, CUDA",
    },
    summary: {
      zh: "写给 LRZ BEAST 实验课上课前的自己:大纲里的六件事收成一层执行层次 + 四个 API + 两个横切机制。含 team/block/work-group 对照表、同一份 SAXPY 的四种写法,以及 Intel / AMD / NVIDIA / Marvell / Fujitsu 上分别能跑什么。",
      en: "A pre-lab map for the LRZ BEAST course: the six syllabus names collapse into one execution hierarchy, four APIs, and two cross-cutting mechanisms. Includes a team/block/work-group Rosetta table, the same SAXPY in four models, and which stacks actually run on Intel / AMD / NVIDIA / Marvell / Fujitsu nodes.",
    },
    date: "2026-09-01",
    tags: ["HPC", "OpenMP", "SIMD", "CUDA", "OpenCL", "SYCL"],
    category: "parallel",
  },
  {
    slug: "parallelism-interaction",
    title: {
      zh: "卡间怎么对话:五种并行的交互编排",
      en: "How GPUs Talk: The Choreography of Five Parallelism Schemes",
    },
    summary: {
      zh: "不算字节,只看编排:DP / TP / PP / EP / SP·CP 各自是谁跟谁通信、在前向反向的哪个时刻通信、挡不挡住计算。先把拓扑归成三类(副本组规约 / 全组交换 / 邻居传递),再逐个拆:DP 的 ring all-reduce 两个半程与分桶重叠、TP 每层两次不可重叠的硬同步、真实排出的 1F1B 流水线时间线(气泡率与公式逐一核对)、EP 运行时才确定收发关系带来的形状不确定与长尾,以及 Megatron-SP / Ulysses / Ring 三种切序列方式的卡间动作对比。",
      en: "Not bytes but choreography: for DP / TP / PP / EP / SP·CP, who talks to whom, at which point in the forward and backward pass, and whether compute stalls while it happens. Topologies reduce to three families (replica reduction, all-to-all exchange, neighbour passing), then each scheme is unpacked: the two halves of DP's ring all-reduce and its bucketed overlap, TP's two non-overlappable hard syncs per layer, a genuinely scheduled 1F1B pipeline timeline whose bubble ratio is checked against the formula, EP's runtime-determined peers with the resulting shape uncertainty and tail latency, and a side-by-side of what Megatron-SP, Ulysses and Ring actually make the GPUs do.",
    },
    date: "2026-08-19",
    tags: ["Distributed", "Parallelism", "Communication", "Pipeline", "MoE"],
    category: "parallel",
  },
  {
    slug: "parallelism-comm-cost",
    title: {
      zh: "并行策略的通信量账本:DP / TP / PP / EP / CP",
      en: "The Communication Bill of Parallelism: DP / TP / PP / EP / CP",
    },
    summary: {
      zh: "把五种并行策略放进同一套符号里各算一遍通信量:各自用什么原语、每卡每步传多少字节、与 B/S/H/L 和并行度成什么比例。含五种通信原语的数据流动图、可交互的通信量对比计算器、Ulysses 与 Ring 在 N≈4–8 处交叉的定量分析、按通信量决定谁进 NVLink 域的排布原则,以及训练与推理的最小卡数公式和并行组合合法性检查。",
      en: "Puts five parallelism strategies under one set of symbols and works out the communication cost of each: which primitive it uses, how many bytes per GPU per step, and how that scales with B/S/H/L and the degree. Includes animated data flows for the five collectives, an interactive cost comparator, a quantitative look at why Ulysses and Ring cross over around N≈4–8, the placement rule for deciding what goes inside the NVLink domain, and minimum-GPU formulas for training and inference with a legality check on the parallel decomposition.",
    },
    date: "2026-08-18",
    tags: ["Distributed", "Parallelism", "Communication", "Training", "LLM"],
    category: "parallel",
  },
  {
    slug: "hy3-anatomy",
    title: {
      zh: "混元3模型结构分析",
      en: "Hunyuan 3 Model Architecture Analysis",
    },
    summary: {
      zh: "不下载一个权重字节,只凭 tencent/Hy3 的 config.json 与 model.safetensors.index.json 把这个 295B-A21B MoE 还原到字节级,并独立复现模型卡上的 295B / 3.8B / 21B 三个官方数字:参数量逐项推算、从 30720 字节的差值反推出 expert_bias 存成了 fp32(规格表未写)、81 个层号里藏着的 MTP 模块、14.5 倍稀疏度与 97.8% 的专家张量占比,以及 8 卡 H100 在 BF16 下连一条满上下文请求都服务不了 —— 这正是官方推荐 H20-3e 的原因。含可交互的显存预算图。",
      en: "Without downloading a single weight byte, tencent/Hy3's config.json and model.safetensors.index.json are enough to reconstruct this 295B-A21B MoE down to a byte-exact parameter count, independently reproducing the model card's 295B / 3.8B / 21B figures: a term-by-term budget, a 30,720-byte discrepancy that reveals expert_bias is stored in fp32 (absent from the spec table), an MTP module hiding among the 81 layer indices, 14.5x sparsity with 97.8% of tensors being experts, and the hard limit that eight H100s in BF16 cannot serve even one full-context request — which is exactly why the card recommends H20-3e. Includes an interactive memory-budget figure.",
    },
    date: "2026-08-14",
    tags: ["MoE", "Model Anatomy", "KV Cache", "Memory", "Inference"],
    category: "model",
  },
  {
    slug: "hy3-parallelism-tp-pp-ep",
    title: {
      zh: "从一份 config 读懂并行切分:TP=4 / PP=4 / EP=4",
      en: "Reading Parallelism off a config.json: TP=4 / PP=4 / EP=4",
    },
    summary: {
      zh: "拿 tencent/Hy3 的 config.json 当底稿,把三种并行落到每个张量的 shape 上:为什么 TP 切的是 head 个数而 head_dim=128 谁都不许切、PP 怎么把 80 层切成 4 段又为何首尾偏重、EP 怎么把 192 个专家分成每卡 48 个并换来两次 All-to-All;含 3 张动图,并算清 16 卡布局下单卡 34.7 GiB 权重与 20 KiB/token 的 KV 账。DP / Attention-DP / SP / CP / ZeRO / EPLB 等其余维度放在 Extra。",
      en: "Uses tencent/Hy3's config.json to ground three parallelism schemes in actual tensor shapes: why TP splits the head count while head_dim=128 can never be cut, how PP slices 80 layers into 4 stages and why the ends are heavier, and how EP shards 192 experts into 48 per GPU at the cost of two All-to-Alls. Three animated figures, plus the memory math for a 16-GPU layout (34.7 GiB of weights per GPU, 20 KiB/token of KV). DP / Attention-DP / SP / CP / ZeRO / EPLB are covered in Extra.",
    },
    date: "2026-08-13",
    tags: ["Distributed", "Parallelism", "MoE", "LLM", "Inference"],
    category: "parallel",
  },
  {
    slug: "triton-gemm-step-by-step",
    title: {
      zh: "从 0 到 1 写一个 Triton GEMM,再一步步调快",
      en: "A Triton GEMM from Scratch, Then Tuned Step by Step",
    },
    summary: {
      zh: "按真实调优顺序走一遍:先建立「program 是 tile 不是 thread」的心智模型,写出能跑的最简分块 GEMM,再每次只改一件事 —— 边界 mask 与 fp32 累加、L2 友好的分组发射顺序、num_stages 软件流水、autotune,最后到 persistent kernel / TMA / warp 专业化。含 5 张动图,其中发射顺序那张可交互,能复现官方 9×9 分块下 90 → 54 块的加载量差异。",
      en: "Walks the real tuning path: first the mental shift that a Triton program owns a tile rather than a thread, then a minimal blocked GEMM that runs, then one change at a time — boundary masks and fp32 accumulation, an L2-friendly grouped launch order, num_stages software pipelining, autotune, and finally persistent kernels / TMA / warp specialization. Five animated figures, including an interactive launch-order demo that reproduces the official 90 → 54 block-load reduction on a 9×9 tiling.",
    },
    date: "2026-08-11",
    tags: ["Triton", "GEMM", "CUDA", "Performance", "Kernel"],
    category: "model",
  },
  {
    slug: "kv-pooling-kv-connector",
    title: {
      zh: "KV 池化与 KVConnector:让 KV cache 从私有变成共享资源",
      en: "KV Pooling & the KVConnector API: Turning KV Cache into a Shared Resource",
    },
    summary: {
      zh: "图文 + 4 张动图拆解 KV 池化:为什么问题不是「KV 太大」而是「同一份 KV 被反复算了又丢」;vLLM v1 的 KVConnectorBase_V1 如何按进程切成 Scheduler(决策)与 Worker(搬运)两侧;一次请求经过的 8 个回调及其逐层流水;分层卸载 / PD 分离 / 全局共享池三种形态的取舍;以及「全层连续布局把卸载吞吐拉高一个数量级」这类决定成败的工程细节。",
      en: "Four animated figures unpack KV pooling: the real problem is not that KV cache is large but that the same KV gets recomputed and thrown away repeatedly. Covers how vLLM v1's KVConnectorBase_V1 splits along process boundaries into a scheduler side (decisions) and a worker side (transfers), the eight callbacks a request passes through and their per-layer pipelining, the trade-offs between tiered offloading / PD disaggregation / a global shared pool, and why an all-layer contiguous KV layout raises offloading throughput by an order of magnitude.",
    },
    date: "2026-08-11",
    tags: ["KV Cache", "vLLM", "Inference", "Distributed", "PD Disaggregation"],
    category: "inference",
  },
  {
    slug: "qkv-lifecycle-256k",
    title: {
      zh: "Q / K / V 在 256K 对话窗口中的一生",
      en: "The Life of Q / K / V in a 256K Chat Window",
    },
    summary: {
      zh: "以 HYV3(80 层 / 64 Q 头 / 8 KV 头 / head_dim 128 / bf16 / 262144 上下文)为例,用三段可交互动画拆解 Q、K、V 各自的生命周期:Q 每步重建即弃、与序列长度无关,K/V 只增不减一路堆到 80 GiB;并给出 GQA 分组、prefill 与 decode 的形状差异、前缀缓存,以及由访存带宽推出的 decode 吞吐衰减曲线。",
      en: "Using HYV3 (80 layers / 64 Q heads / 8 KV heads / head_dim 128 / bf16 / 262144 context), three interactive animations trace what happens to Q, K, and V: Q is rebuilt and discarded every step and never grows with sequence length, while K/V only accumulate — all the way to 80 GiB. Covers GQA grouping, prefill vs decode shapes, prefix caching, and the bandwidth-bound decode throughput decay curve.",
    },
    date: "2026-07-31",
    tags: ["Attention", "KV Cache", "GQA", "Long Context", "Inference"],
    category: "inference",
  },
  {
    slug: "ai-infra-llm-radar-2026-06-22",
    title: {
      zh: "AI Infra / 大模型雷达:多窗口热点与趋势",
      en: "AI Infra / LLM Radar: Multi-window Signals and Trends",
    },
    summary: {
      zh: "稳定 URL 滚动更新:统计 AI Infra 和大模型相关的当天、一周、一个月、半年、一年热点,结合 GitHub release、issue、新闻和官方博客证据分析历史、当下与未来趋势。2026-08-05:当天关注 vLLM KV offload 生产兼容性与 OpenAI/Georgia Power 3.2GW 电力合同,一周内聚焦 LiteLLM 1.95、llama.cpp、FlashInfer nightly、Kimi K3、MCP stateless core、KV 数据层与 GW 级算力供给。",
      en: "Stable-URL rolling update: AI Infra and LLM signals across day/week/month/half-year/year windows, with GitHub releases, issues, news, and official-blog evidence for historical, current, and future trends. 2026-08-05: today focuses on vLLM KV offload production compatibility and the OpenAI/Georgia Power 3.2GW power contract, while the week highlights LiteLLM 1.95, llama.cpp, FlashInfer nightly, Kimi K3, MCP stateless core, the KV data layer, and gigawatt-scale compute supply.",
    },
    date: "2026-08-05",
    tags: ["AI Infra", "LLM", "Inference", "KV Cache", "Agents", "Trend Analysis"],
    category: "industry",
  },
  {
    slug: "vllm-gpu-memory-utilization",
    title: {
      zh: "vLLM 的 gpu-memory-utilization 到底管什么(v0.24)",
      en: "What gpu-memory-utilization Actually Controls in vLLM (v0.24)",
    },
    summary: {
      zh: "基于 vLLM v0.24.0 源码图文拆解:gpu-memory-utilization 是什么、这笔显存预算给谁、怎么算出 KV cache 与 block 数,并给出起服务→发请求各阶段 OOM 到底该升还是降 util 的对照表。",
      en: "An illustrated walkthrough of vLLM v0.24.0 source: what gpu-memory-utilization is, who the memory budget is for, how KV cache size and block count are computed, plus a stage-by-stage table on whether to raise or lower util when OOM hits from startup to serving.",
    },
    date: "2026-07-03",
    tags: ["vLLM", "KV Cache", "Memory", "Inference"],
    category: "inference",
  },
  {
    slug: "llm-leaderboard-2026-06-30",
    title: {
      zh: "全球大模型榜单:综合 / 知识 / 代码 三维排名",
      en: "Global LLM Leaderboards: Overall / Knowledge / Code",
    },
    summary: {
      zh: "全球前十大模型按综合对话、综合知识、代码能力三类分别排名并标注来源(LMArena / Artificial Analysis / SWE-bench / LiveCodeBench),含十年「前十名次」变迁动图。2026-07-13 复核:GPT-5.6 Sol/Terra 上线,智力榜重排、代码分叉赛道。",
      en: "The world's top LLMs ranked across overall conversation, knowledge, and code — each with cited sources (LMArena / Artificial Analysis / SWE-bench / LiveCodeBench) — plus a 10-year rank-change animation. Re-checked 2026-07-13: GPT-5.6 Sol/Terra land, re-ranking the intelligence board and forking the code race.",
    },
    date: "2026-07-13",
    tags: ["LLM", "Leaderboard", "Benchmarks", "Coding", "Trend Analysis"],
    category: "industry",
  },
  {
    slug: "sequence-parallel-and-comms",
    title: {
      zh: "主流序列并行(SP)方案对比 & 大模型通信原语",
      en: "Sequence Parallelism Schemes Compared & LLM Communication Primitives",
    },
    summary: {
      zh: "图文 + 动图对比 Megatron-SP / Ulysses / Ring·CP / USP 的机制与优缺点,并讲清主流大模型(含 DeepSeek MoE)用的通信原语。",
      en: "Illustrated + animated comparison of Megatron-SP / Ulysses / Ring·CP / USP, with the communication primitives mainstream LLMs (incl. DeepSeek MoE) rely on.",
    },
    date: "2026-06-11",
    tags: ["Distributed", "Sequence Parallel", "LLM", "Communication"],
    category: "parallel",
  },
  {
    slug: "github-daily-trending",
    title: {
      zh: "GitHub 每日 Top 10 Stars 与技术趋势",
      en: "GitHub Daily Top 10 Stars & Tech Trends",
    },
    summary: {
      zh: "滚动记录 GitHub 当天/一周/一月/半年/一年多窗口热门仓库(图文卡片 + 多动图),分析当日前十的技术方向与趋势(历史/当下/未来,带证据)。2026-07-13:agent 长出「手」,运行时安全护栏(断路器)成为新前线。历史全部保留。",
      en: "A rolling log of GitHub hot repos across day/week/month/6mo/year windows (illustrated cards + animated charts), analyzing the daily top 10's directions and trend (history/present/future, with evidence). 2026-07-13: agents grow “hands,” and runtime safety guardrails (circuit-breakers) become the new frontier. History preserved.",
    },
    date: "2026-07-13",
    tags: ["GitHub", "Trending", "Multi-window", "Agent Safety", "Runtime Guardrails", "Trend Analysis"],
    category: "industry",
  },
  {
    slug: "cuda-graph-vllm",
    title: {
      zh: "CUDA Graph 详解 & vLLM 里的 CUDA Graph 与精度",
      en: "CUDA Graph Explained & CUDA Graph in vLLM + Precision",
    },
    summary: {
      zh: "图文 + 动图讲清 CUDA Graph 原理、vLLM 里的 piecewise/full CUDA Graph,以及 CUDA Graph vs Eager 对精度的影响。",
      en: "Illustrated + animated: how CUDA Graph works, piecewise/full CUDA Graph in vLLM, and how CUDA Graph vs Eager affects numerical precision.",
    },
    date: "2026-06-05",
    tags: ["CUDA", "vLLM", "Inference", "Performance"],
    category: "inference",
  },
  {
    slug: "vllm-architecture",
    title: {
      zh: "vLLM 完整调用链路拆解",
      en: "vLLM End-to-End Call Chain",
    },
    summary: {
      zh: "从 vllm serve 拉起服务,到 curl 请求、模型加载、KV cache、连续批处理、PagedAttention、调度器的完整链路图文拆解。",
      en: "From vllm serve to a curl request: the full call chain through model loading, KV cache, continuous batching, PagedAttention, and the scheduler — illustrated.",
    },
    date: "2026-05-29",
    tags: ["vLLM", "LLM", "Inference", "System"],
    category: "inference",
  },
  {
    slug: "example-sequence-parallel",
    title: {
      zh: "DeepSpeed-Ulysses 序列并行入门",
      en: "A Primer on DeepSpeed-Ulysses Sequence Parallelism",
    },
    summary: {
      zh: "为什么长序列训练会爆显存,序列并行如何把 32K 训练从 32 卡降到 8 卡。",
      en: "Why long-sequence training blows up memory, and how sequence parallelism cut 32K training from 32 GPUs to 8.",
    },
    date: "2026-05-20",
    tags: ["LLM", "Distributed", "Training"],
    category: "parallel",
  },
  {
    slug: "example-deblurgan",
    title: {
      zh: "Enhanced DeblurGAN:低光去模糊笔记",
      en: "Enhanced DeblurGAN: Low-light Deblurring Notes",
    },
    summary: {
      zh: "把低光增强和运动去模糊组合进一个 GAN 的设计取舍与训练心得。",
      en: "Design trade-offs and training notes from combining low-light enhancement with motion deblurring in one GAN.",
    },
    date: "2026-04-08",
    tags: ["Computer Vision", "GAN", "Research"],
    category: "model",
  },
];
