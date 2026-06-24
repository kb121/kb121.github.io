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
    slug: "ai-infra-llm-radar-2026-06-22",
    title: {
      zh: "AI Infra 与大模型趋势雷达: 2026-06-22",
      en: "AI Infra & LLM Trend Radar: 2026-06-22",
    },
    summary: {
      zh: "统计 AI Infra / 大模型当天、一周、1个月、半年、一年热点信号,整理 Top 10 信息源,并用多组动图分析历史、当下与未来趋势。",
      en: "Snapshot of AI Infra / LLM signals across day, week, month, half-year, and year windows, with Top 10 hot items and animated trend analysis.",
    },
    date: "2026-06-22",
    tags: ["AI Infra", "LLM", "Inference", "Agents", "Trend Analysis"],
  },
  {
    slug: "ai-infra-llm-radar-2026-06-21",
    title: {
      zh: "AI Infra 与大模型趋势雷达: 2026-06-21",
      en: "AI Infra & LLM Trend Radar: 2026-06-21",
    },
    summary: {
      zh: "统计 AI Infra / 大模型当天、一周、1个月、半年、一年热点信号,整理 Top 10 信息源,并用多组动图分析历史、当下与未来趋势。",
      en: "Snapshot of AI Infra / LLM signals across day, week, month, half-year, and year windows, with Top 10 hot items and animated trend analysis.",
    },
    date: "2026-06-21",
    tags: ["AI Infra", "LLM", "Inference", "Agents", "Trend Analysis"],
  },
  {
    slug: "ai-infra-llm-radar-2026-06-16",
    title: {
      zh: "AI Infra 与大模型趋势雷达（更新日期：2026-06-16）",
      en: "AI Infra & LLM Trend Radar (Updated: 2026-06-16)",
    },
    summary: {
      zh: "统计 AI Infra / 大模型当天、一周、1个月、半年、一年热点信号,整理 Top 10 信息源,并用多组动图分析历史、当下与未来趋势。",
      en: "Snapshot of AI Infra / LLM signals across day, week, month, half-year, and year windows, with Top 10 hot items and animated trend analysis.",
    },
    date: "2026-06-16",
    tags: ["AI Infra", "LLM", "Inference", "Trend Analysis"],
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
      zh: "滚动记录 GitHub 当天/一周/一月/半年/一年各窗口前 5 stars,图文介绍仓库,并对近一年前 10 做方向归类与带证据的趋势分析(历史/当下/未来)。历史全部保留。",
      en: "A rolling log of the top 5 stars across day/week/month/half-year/year windows, with illustrated repo cards plus a direction breakdown and evidence-based trend analysis (history/present/future) of the past-year Top 10. History preserved.",
    },
    date: "2026-06-19",
    tags: ["GitHub", "Trending", "Agent Skills", "Trend Analysis"],
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
