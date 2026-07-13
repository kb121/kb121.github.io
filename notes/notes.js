/* =========================================================================
   notes/notes.js — the knowledge-notes manifest.

   THIS IS THE ONE FILE YOU EDIT TO ADD A NOTE.

   To add a note:
     1. Copy notes/_template.html to notes/<your-slug>.html and write it.
     2. Add an entry to the TOP of the NOTES array below.

   Entry shape:
     {
       slug:    "your-file-name-without-.html",   // -> notes/your-file-name.html
       title:   { zh: "中文标题", en: "English title" },
       summary: { zh: "一句话摘要", en: "One-line summary" },
       date:    "2026-05-29",                      // ISO date, used for sorting
       tags:    ["LLM", "Training"]                // free-form, also build the filter bar
     }

   Notes are sorted by `date` descending automatically — order here doesn't
   matter, but keeping newest on top is tidy.

   `title` / `summary` may also be a plain string instead of a {zh, en}
   object if you don't want a translation; it will show for both languages.
   ========================================================================= */

window.NOTES = [
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
  },
];
