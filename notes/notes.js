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
       category: "tech"                            // "tech" | "industry" (see below)
     }

   `category` splits the index page into two sections:
     "tech"     — 技术笔记 / Technical Notes.  Long-lived explainers: how a
                  system works, why a design is the way it is. This is the
                  default when `category` is omitted.
     "industry" — 行业分析 / Industry Analysis.  Time-stamped snapshots that
                  go stale: leaderboards, hardware rankings, trend radars.
   Keeping them apart stops the rolling snapshots from burying the
   evergreen technical notes at the top of the list.

   Notes are sorted by `date` descending automatically — order here doesn't
   matter, but keeping newest on top is tidy.

   `title` / `summary` may also be a plain string instead of a {zh, en}
   object if you don't want a translation; it will show for both languages.
   ========================================================================= */

window.NOTES = [
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
    category: "tech",
  },
  {
    slug: "ai-accelerator-ranking-2026-07-27",
    title: {
      zh: "商用 AI 加速卡统计与排名:以 NVIDIA H20 为基线",
      en: "Commercial AI Accelerator Board & Ranking, with NVIDIA H20 as the Baseline",
    },
    summary: {
      zh: "滚动更新的商用加速卡榜:NVIDIA / AMD / 昇腾 / TPU / Trainium / Maia / MTIA / 阿里平头哥真武 / Tesla / SambaNova / d-Matrix / Etched / FuriosaAI / Rebellions / Qualcomm / Cerebras / Tenstorrent / Intel / 昆仑芯 / 寒武纪 / 摩尔线程 / 沐曦 / 海光 / 壁仞 / 燧原 / 天数智芯 / 东方算芯 / 曦望 / 奕行智能 共 29 家厂商最新各 3 款卡,按显存、算力、算力带宽比(roofline 山脊点)、数值格式原生支持、Scale-up 超节点域、片上 SRAM/L2、TDP 与液冷、软件栈成熟度与实测 MFU 十维加权排名,H20 = 100 基线,含 38 张动图与全部来源链接。2026-08-02 复核:审查「带宽」这个词本身 —— 这份榜里出现过的「带宽」其实是五种不同的量(主存物理 / 机架聚合 / 片上 SRAM / 近存「等效」/ 卡间互联),数值跨五个数量级。以高通 2026-06-24 投资者日新公开的路线图为切口:AI250 那个「每卡 133 TB/s 有效带宽」的分母被三条互不相关的路径同时锁定在 7.39 TB/s ——「133÷18」(官方脚注写明 18× 是每卡对每卡)、「414÷56」(机架聚合值除以芯片数)、「6720 bit × 8.8 Gbps」(The Register 按 LPDDR5X 反推的位宽);也就是说 AI200 的「有效」= 物理聚合,AI250 的「有效」= 物理 × 18 的近存复用系数。把五种口径依次代进打分公式,同一维可取 0 到 120 分,而榜首总分才 417。d-Matrix Corsair 是最干净的反例:同一张 datasheet 上印着 2 GB @ 150 TB/s 与 ≤256 GB @ 400 GB/s,差 375 倍,山脊点在 16 与 6000 FLOP/B 之间跳。自查结论是干净的:榜上 32 张卡的带宽输入全部属于物理口径,本次改分 0;Scale-up 维的双向/单向之争在对数比值模型里也精确抵消为 0.00。另落地高通 AI300 的完整定位(HBC Gen 2、54×、UALink + ESUN、三代机架容量都是 43 TB、三代都是风冷 + 直液冷),并更正本文此前「唯一用 PCIe 做 scale-up」「160 kW 强制液冷」两处旧表述。2026-08-01 复核:昇腾 950DT 本月提前上云,而官方《昇腾 950 NPU 架构白皮书》的规格表揭出这张榜自己填错了一代 —— 榜上给 950DT 的 FP8 2 PFLOPS / FP4 4 PFLOPS 其实是下一代昇腾 960 的规格,白皮书、HC 路线图、Atlas 950 整机口径、单计算柜口径四个独立来源都指向每卡 ~1 PF / ~2 PF。更值得读的是那张规格表本身:同一颗 Die 印着 3 个冗余档位(低档只有顶档的 78%)、2 种算力口径(Cube+Vector 总算力 vs 仅 Cube,向量核那 60 TFLOPS 不随精度翻倍)、2 种显存容量(144/96 GB 客户选配),六种组合下这张卡的指数在 210–232 分之间,与 07-30 发现的 peak/delivered 27 分同一量级。综合指数 258 → 232、第 10 → 第 12;同一份白皮书首次公开的 L2 128 MB 又让 950PR 从 197 涨到 205(名次不变)。另澄清 Atlas 950 的 8192 卡是理论上限、可交付的是 1024 卡 —— 而本模型的域规模维恰好在 1024 卡封顶,故不改分。2026-07-30 复核:审查这份榜自己的分母 —— 十维里有九维填的是 datasheet 峰值,而 AMD MI350P 第一次把 delivered 与 peak 两列印在同一张规格页上(折扣随数值格式在 39%–67% 之间),AMD 官方另给出 Peak / MAF / Delivered 三层定义并建议 MFU 换分母,第三方实测则把达成率拆成算力 44%–93%、显存带宽 81%–90%、Scale-up 互联 70%–85% 三条互不相关的曲线。同一张 MI350P 用 peak 打 219 分列第 13、用 delivered 打 192 分列第 16。另新增曦望启望 S3(国内首款 LPDDR6 GPGPU)与奕行智能 Epoch(国内首颗量产 RISC-V 云端大算力芯片)。",
      en: "A rolling board of the latest three accelerators from each of 29 vendors (NVIDIA, AMD, Ascend, TPU, Trainium, Microsoft Maia, Meta MTIA, Alibaba T-Head Zhenwu, Tesla, SambaNova, d-Matrix, Etched, FuriosaAI, Rebellions, Qualcomm, Cerebras, Tenstorrent, Intel, Kunlunxin, Cambricon, Moore Threads, MetaX, Hygon, Biren, Enflame, Iluvatar, DFSX, Sunrise, Yixing), ranked on ten weighted dimensions — memory, compute, FLOP/byte ridge point, native numeric formats, scale-up superpod domain, on-chip SRAM/L2, TDP and liquid cooling, plus software-stack maturity and measured MFU — normalized to H20 = 100, with a section on non-HBM routes (SRAM, 3D near-memory DRAM, LPDDR6, wafer-scale, RISC-V), 38 animated figures, and every source linked. Re-checked 2026-08-02, auditing the word “bandwidth” itself: the numbers this board calls bandwidth are actually five different quantities (physical main-memory, its rack-level aggregate, on-chip SRAM, near-memory “effective”, and card-to-card scale-up) spanning five orders of magnitude. Using Qualcomm's 2026-06-24 investor-day roadmap as the entry point, the denominator behind AI250’s “133 TB/s effective per card” is pinned at 7.39 TB/s by three unrelated paths — 133/18 (the footnote defines 18x as per-card vs AI200), 414/56 (the rack aggregate divided by chip count), and 6720 bit x 8.8 Gbps (The Register's reverse-engineered bus width). So AI200’s “effective” is a physical aggregate while AI250’s is physical x an 18x near-memory reuse factor. Feeding all five conventions through the scoring formula, one dimension can take any value from 0 to 120 points while the top card's total is 417. d-Matrix Corsair is the cleanest counterexample: one datasheet prints 2 GB @ 150 TB/s next to up to 256 GB @ 400 GB/s, a 375x gap that moves the ridge point between 16 and 6000 FLOP/B. The audit came back clean: all 32 ranked cards use the physical convention, so nothing was re-scored, and the bidirectional-vs-unidirectional question on the scale-up axis cancels to exactly 0.00 in a log-ratio model. Also lands Qualcomm AI300 (HBC Gen 2, 54x, UALink + ESUN, 43 TB rack capacity unchanged across three generations, air and direct-liquid cooling throughout) and corrects two earlier claims in this note. Re-checked 2026-08-01: Ascend 950DT lands on Huawei Cloud a quarter early, and Huawei's official Ascend 950 NPU architecture white paper shows this board had filled in the wrong generation — the 2 PFLOPS FP8 / 4 PFLOPS FP4 credited to the 950DT are actually the next-gen Ascend 960's numbers, while four independent sources (the white paper, the HC roadmap, the Atlas 950 SuperPoD system figure, and the per-rack figure) all point to ~1 PF / ~2 PF per card. The spec table itself is the more interesting find: one die is printed with three redundancy bins (the low bin is 78% of the top), two compute conventions (Cube+Vector total vs Cube only, where the vector core's flat 60 TFLOPS does not double with precision), and two memory capacities (144/96 GB, customer-selectable) — six combinations spanning 210 to 232 index points, the same magnitude as the 27-point peak/delivered gap found on 07-30. Index 258 → 232, rank 10 → 12; the same white paper's first-ever L2 disclosure (128 MB) lifts the 950PR from 197 to 205 with no rank change. Also clarified: Atlas 950's 8192 cards is a theoretical ceiling and 1024 is what ships — which moves zero points, because the domain axis saturates at exactly 1024. Re-checked 2026-07-30, this time auditing the board's own denominator: nine of the ten dimensions are fed datasheet peak numbers, and AMD's Instinct MI350P is the first card to print delivered next to peak on the same spec page (the discount ranges from 39% to 67% depending on the numeric format). AMD also published a Peak / MAF / Delivered taxonomy recommending MFU switch denominators, while third-party measurements split achieved-vs-peak into three uncorrelated curves — compute 44-93%, memory bandwidth 81-90%, scale-up all-reduce 70-85%. Scored on peak the MI350P lands at 219 and rank 13; on delivered, 192 and rank 16.",
    },
    date: "2026-08-02",
    tags: ["GPU", "NPU", "Hardware", "Ranking", "Roofline", "MFU", "Interconnect", "Trend Analysis"],
    category: "industry",
  },
  {
    slug: "ai-infra-llm-radar-2026-06-22",
    title: {
      zh: "AI Infra / 大模型雷达:多窗口热点与趋势",
      en: "AI Infra / LLM Radar: Multi-window Signals and Trends",
    },
    summary: {
      zh: "稳定 URL 滚动更新:统计 AI Infra 和大模型相关的当天、一周、一个月、半年、一年热点,结合 GitHub release、新闻和官方博客证据分析历史、当下与未来趋势。2026-07-27:推理栈收敛到 vLLM 0.26 / SGLang 0.5.16 / FlashInfer / LMCache,同时数据中心融资与电力成为新瓶颈。",
      en: "Stable-URL rolling update: AI Infra and LLM signals across day/week/month/half-year/year windows, with GitHub releases, news, and official-blog evidence for historical, current, and future trends. 2026-07-27: serving converges around vLLM 0.26 / SGLang 0.5.16 / FlashInfer / LMCache while data-center financing and power become the new bottleneck.",
    },
    date: "2026-07-27",
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
    category: "tech",
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
    category: "tech",
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
    category: "tech",
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
    category: "tech",
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
    category: "tech",
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
    category: "tech",
  },
];
