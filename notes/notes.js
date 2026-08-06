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
      zh: "滚动更新的商用加速卡榜:NVIDIA / AMD / 昇腾 / TPU / Trainium / Maia / MTIA / 阿里平头哥真武 / Tesla / SambaNova / d-Matrix / Etched / FuriosaAI / Rebellions / Qualcomm / Cerebras / Tenstorrent / Intel / 昆仑芯 / 寒武纪 / 摩尔线程 / 沐曦 / 海光 / 壁仞 / 燧原 / 天数智芯 / 东方算芯 / 曦望 / 奕行智能 共 29 家厂商最新各 3 款卡,按显存、算力、算力带宽比(roofline 山脊点)、数值格式原生支持、Scale-up 超节点域、片上 SRAM/L2、TDP 与液冷、软件栈成熟度与实测 MFU 十维加权排名,H20 = 100 基线,含 52 张动图与全部来源链接。2026-08-05 复核:审查的是这份榜标题里的两个字 ——「商用」,也就是「这个数什么时候能买到」。把可得性按能不能拿到算力分成五档(① 能买到卡 16 张、② 只能租 5 张、③ 厂商自用 1 张、④ 已发布未开卖 8 张、⑤ 受阻或已取消 1 张),这套分法不是自创的 —— MLPerf 的提交规则本身就把 available 拆成 in cloud 与 on premise 两档,并给 preview 定了「下一轮或 140 天内必须变成可买可租」的硬期限。结果是:榜上 31 张卡今天真能拿到的是 21 张,而<b>前五名一张都拿不到</b> —— MI455X 首批出货在 Q3 末、R200 只向指定客户发了货、TPU 8i/8t 仍是 preview 且从不外售(官方说今年内 GA,第三方按 2nm 产能给的是 2027 年底,两者差 365 天)、Maia 200 只服务微软与 OpenAI 自己的负载。今日可得榜的顶端因此是第 6 名 B300 的 328 分,与榜首差 89 分(本榜误差量级的三到四倍);中国大陆能买到的最强单卡是昇腾 950PR / Atlas 350 的 205 分,正好是榜首的一半。对照第三方语料更刺眼:MLPerf Inference v6.0 的 520 条结果里 preview 只有 9 条(1.7%),而且全部出自同一台 4 卡 Intel Arc Pro B70 —— 审计语料几乎全部由当时买得到的机器组成,而本榜前五名 100% 拿不到;这也补上了 08-03 那轮的后半句:唯二有审计成绩的 B300 与 MI355X,恰好也是唯二有第三方可得性声明的卡,因为能被第三方复跑的前提就是第三方拿得到机器。本轮最难看的一件事是排第 10 的 Rubin CPX:它早在 2026-03 的 GTC 上就被 NVIDIA 从路线图移除(转向以 200 亿美元拿到的 Groq LPU,VP Ian Buck 确认重心从压低首 token 时延转向提高 token 吐出速度;到 5 月底供应链已无 GDDR7 与基板订单),而本榜从首发到 08-03 的五轮复核每次都在核它那格数字对不对,没有一轮问过这个产品还在不在 —— 因为 datasheet 不会因为产品取消而下线,它的 NVIDIA 官方技术博客至今仍然在线、一字未改。本轮将其移出排名:进榜卡 32 → 31,原第 11 至第 32 名整体上移一位,没有任何一张卡的指数变化,规格与来源保留在其余章节并标注「已取消」。可得性本身不做成维度而只做筛子,理由有三条(写进口径声明 (18)):它不是程度问题而是有无问题;它会随日历漂移而硬件不变;而且实测它作为权重 10 的第 11 维时前 12 名 0 次换位、全榜 31 张只有 7 张动且最大位移 2 位(仍在误差带内)—— 同一个事实当维度值 10 分、当筛子值 89 分,差 8.9 倍。<b>有些事实的正确用法是筛子,不是维度。</b>另有一次干净的输入自查:AMD 在 07-23 同一天的两个官方页面给 MI455X 写了 19.6 与 23.3 TB/s 两个显存带宽,用它自家的机架聚合口径 1.7 PB/s ÷ 72 卡 = 23.6 判定 23.3 自洽(19.6 × 72 只有 1.41 PB/s),容量侧 31 TB ÷ 72 = 430 GB 同样自洽,故维持 23.3、本次改分 0 —— 「机架 ÷ 卡数」这招连续三轮生效。2026-08-03 复核:审查每一格数字的出处 ——「这个数是谁测的」。本模型 100 分权重里,90 分抄的是厂商自报规格、10 分是本文给的软件栈星级、经过第三方审计的是 0 分。逐行数了 MLPerf 两轮 v6.0 的官方结果仓库:Inference v6.0 的 520 条结果来自 29 种加速器字符串,归并到硅厂只有 NVIDIA / AMD / Intel 三家;Training v6.0 官方口径的 13 种加速器归并后只剩 NVIDIA 与 AMD 两家 —— 连 Google 自己两轮提交的都是 GB200 / DGX B200,TPU 一条成绩都没有,而 TPU 在本榜占了前七名里的三席。榜上 32 张卡只有 B300(第 6)与 MI355X(第 8)能查到审计成绩,基线 H20 一条都没有;520 行结果的实测功耗为 0 条,所以「能效」这一维在全行业范围内没有审计对照物。拿这 2 张卡回头检验:本榜说 B300 比 MI355X 高 1.139 倍,八个共同测试项的每卡吞吐比落在 0.961–1.347(Llama 2 70B Interactive 上 MI355X 反超),区间比它想分辨的差距还宽,而这两张卡恰好相差 2 位 —— 成为「名次相差 2 位以内不分高下」的第三个独立佐证。审计数据自己揭出的最大一件事是:同一颗 B300、同一个测试项、同为 8 卡单节点,换个提交方每卡吞吐差 1.705 倍,折成本模型的尺度是 7.70 分,恰好等于一张 ★★★★ 卡软件维的全部得分 —— 而软件栈的全部权重只有 10 分,占榜首 417 分的 2.4%。反方向的样本同样清楚:MI300X 与 MI325X 的官方稠密 FP8 同为 2614.9 TFLOPS,而 v6.0 上后一代的每卡吞吐低 33%,原因是两次提交的节点规模与工程投入不同 —— 审计过的数字也不能直接当芯片能力用。敏感度实测:把软件维换成「v6.0 覆盖项数 ÷ 11」,前 12 名全部掉 4.59–10.00 分而名次一位不动,故本次改分 0,并新增口径声明 (17) 与一张五级证据等级表(L4 第三方审计 / L3 给了跑法 / L2 只给结论 / L1 datasheet 规格 / L0 本文估计)。2026-08-02 复核:审查「带宽」这个词本身 —— 这份榜里出现过的「带宽」其实是五种不同的量(主存物理 / 机架聚合 / 片上 SRAM / 近存「等效」/ 卡间互联),数值跨五个数量级。以高通 2026-06-24 投资者日新公开的路线图为切口:AI250 那个「每卡 133 TB/s 有效带宽」的分母被三条互不相关的路径同时锁定在 7.39 TB/s ——「133÷18」(官方脚注写明 18× 是每卡对每卡)、「414÷56」(机架聚合值除以芯片数)、「6720 bit × 8.8 Gbps」(The Register 按 LPDDR5X 反推的位宽);也就是说 AI200 的「有效」= 物理聚合,AI250 的「有效」= 物理 × 18 的近存复用系数。把五种口径依次代进打分公式,同一维可取 0 到 120 分,而榜首总分才 417。d-Matrix Corsair 是最干净的反例:同一张 datasheet 上印着 2 GB @ 150 TB/s 与 ≤256 GB @ 400 GB/s,差 375 倍,山脊点在 16 与 6000 FLOP/B 之间跳。自查结论是干净的:榜上 32 张卡的带宽输入全部属于物理口径,本次改分 0;Scale-up 维的双向/单向之争在对数比值模型里也精确抵消为 0.00。另落地高通 AI300 的完整定位(HBC Gen 2、54×、UALink + ESUN、三代机架容量都是 43 TB、三代都是风冷 + 直液冷),并更正本文此前「唯一用 PCIe 做 scale-up」「160 kW 强制液冷」两处旧表述。2026-08-01 复核:昇腾 950DT 本月提前上云,而官方《昇腾 950 NPU 架构白皮书》的规格表揭出这张榜自己填错了一代 —— 榜上给 950DT 的 FP8 2 PFLOPS / FP4 4 PFLOPS 其实是下一代昇腾 960 的规格,白皮书、HC 路线图、Atlas 950 整机口径、单计算柜口径四个独立来源都指向每卡 ~1 PF / ~2 PF。更值得读的是那张规格表本身:同一颗 Die 印着 3 个冗余档位(低档只有顶档的 78%)、2 种算力口径(Cube+Vector 总算力 vs 仅 Cube,向量核那 60 TFLOPS 不随精度翻倍)、2 种显存容量(144/96 GB 客户选配),六种组合下这张卡的指数在 210–232 分之间,与 07-30 发现的 peak/delivered 27 分同一量级。综合指数 258 → 232、第 10 → 第 12;同一份白皮书首次公开的 L2 128 MB 又让 950PR 从 197 涨到 205(名次不变)。另澄清 Atlas 950 的 8192 卡是理论上限、可交付的是 1024 卡 —— 而本模型的域规模维恰好在 1024 卡封顶,故不改分。2026-07-30 复核:审查这份榜自己的分母 —— 十维里有九维填的是 datasheet 峰值,而 AMD MI350P 第一次把 delivered 与 peak 两列印在同一张规格页上(折扣随数值格式在 39%–67% 之间),AMD 官方另给出 Peak / MAF / Delivered 三层定义并建议 MFU 换分母,第三方实测则把达成率拆成算力 44%–93%、显存带宽 81%–90%、Scale-up 互联 70%–85% 三条互不相关的曲线。同一张 MI350P 用 peak 打 219 分列第 13、用 delivered 打 192 分列第 16。另新增曦望启望 S3(国内首款 LPDDR6 GPGPU)与奕行智能 Epoch(国内首颗量产 RISC-V 云端大算力芯片)。",
      en: "A rolling board of the latest three accelerators from each of 29 vendors (NVIDIA, AMD, Ascend, TPU, Trainium, Microsoft Maia, Meta MTIA, Alibaba T-Head Zhenwu, Tesla, SambaNova, d-Matrix, Etched, FuriosaAI, Rebellions, Qualcomm, Cerebras, Tenstorrent, Intel, Kunlunxin, Cambricon, Moore Threads, MetaX, Hygon, Biren, Enflame, Iluvatar, DFSX, Sunrise, Yixing), ranked on ten weighted dimensions — memory, compute, FLOP/byte ridge point, native numeric formats, scale-up superpod domain, on-chip SRAM/L2, TDP and liquid cooling, plus software-stack maturity and measured MFU — normalized to H20 = 100, with a section on non-HBM routes (SRAM, 3D near-memory DRAM, LPDDR6, wafer-scale, RISC-V), 52 animated figures, and every source linked. Re-checked 2026-08-05, auditing the word in this note’s own title — commercial — i.e. when can you actually buy the thing this number describes. Sorting every card by whether you can get compute from it today yields five tiers (16 buyable, 5 rentable-only, 1 vendor-internal, 8 announced-but-not-selling, 1 blocked-or-cancelled); the taxonomy is not invented here, because MLPerf’s submission rules already split available into in-cloud and on-premise and give preview a hard deadline of the next round or 140 days, whichever is longer. The result: 21 of the 31 ranked cards can be had today, and <b>none of the top five can</b> — MI455X ships to first customers at the end of Q3, R200 has only gone to named customers, TPU 8i/8t are still preview and are never sold at all (Google says GA later this year; third parties reading TSMC 2nm capacity say late 2027, a 365-day spread), and Maia 200 serves only Microsoft’s and OpenAI’s own workloads. So the top of the buy-it-today board is rank 6, B300 at 328 points, 89 below the overall leader — three to four times this board’s own error scale; the strongest card a mainland-China buyer can purchase is Ascend 950PR / Atlas 350 at 205, exactly half the leader. The third-party corpus makes the contrast sharper: of MLPerf Inference v6.0’s 520 results only 9 (1.7%) are preview, and all nine come from one 4-card Intel Arc Pro B70 machine — the audit corpus is almost entirely hardware you could buy at the time, while 100% of this board’s top five cannot be had. That also completes the other half of the 08-03 finding: the only two audited cards (B300, MI355X) are also the only two with a third-party availability declaration, because being re-run by a third party presupposes that the third party can get the machine. The ugliest finding: Rubin CPX, ranked 10th here, was removed from NVIDIA’s roadmap back at GTC 2026 in March (pivoting to the Groq LPU acquired for $20B; VP Ian Buck confirmed the shift from cutting time-to-first-token to raising token output rate, and by late May no GDDR7 or substrate orders existed), yet five straight re-checks audited its numbers and not one asked whether the product still existed — because a datasheet does not go offline when a product is cancelled, and NVIDIA’s official CPX technical blog is still live today, unchanged. It is now removed from the ranking: 32 → 31 cards, former ranks 11 through 32 all move up one, no card’s index changes, and its specs and sources stay in the other sections marked cancelled. Availability itself is published as a filter, never as a dimension, for three reasons (convention note 18): it is a binary, not a degree; it drifts with the calendar while the hardware does not; and measured as an 11th axis at weight 10 it changes zero ranks in the top 12 and moves only 7 of 31 cards by at most 2 places, still inside this board’s stated error band — the same fact is worth 10 points as a dimension and 89 as a filter, an 8.9x gap. <b>Some facts belong in a filter, not in a weighted sum.</b> Also one clean input audit: AMD’s two official pages published the same day give MI455X two different memory bandwidths, 19.6 and 23.3 TB/s; AMD’s own rack aggregate of 1.7 PB/s over 72 GPUs (23.6 TB/s each) confirms 23.3, since 19.6 x 72 would be only 1.41 PB/s, and 31 TB / 72 = 430 GB corroborates the capacity side — so 23.3 stands and nothing was re-scored. Re-checked 2026-08-03, auditing where every number comes from — who measured it. Of this model’s 100 weight points, 90 are copied from vendor-published specs, 10 are my own software-stack star rating, and 0 have been through third-party audit. I counted both 2026 MLPerf v6.0 result repositories line by line: Inference v6.0’s 520 results span 29 accelerator strings that collapse to just three silicon vendors (NVIDIA, AMD, Intel), and Training v6.0’s officially reported 13 accelerators collapse to two (NVIDIA, AMD) — even Google submitted GB200 and DGX B200 in both rounds, with not a single TPU result, while TPUs hold three of this board’s top seven slots. Only 2 of the 32 ranked cards have an audited number at all (B300 at rank 6, MI355X at rank 8) and the H20 baseline has none; all 520 rows report no measured power, so the efficiency axis has no audited counterpart anywhere in the industry. Checking the board against those two cards: it predicts B300 ahead of MI355X by 1.139x, while the per-card throughput ratio across the eight shared tests spans 0.961-1.347 (MI355X actually wins Llama 2 70B Interactive) — a range wider than the gap it claims to resolve, and these two cards sit exactly 2 ranks apart, making this the third independent confirmation of the “two ranks apart is not a difference” rule. The biggest finding is what the audited data says about itself: the same B300 silicon, the same test, the same 8-card single node, and per-card throughput varies 1.705x by submitter — worth 7.70 points on this model’s scale, which happens to equal the entire software-axis score of a four-star card, while software carries only 10 of the top card’s 417 points (2.4%). The reverse case is just as clear: MI300X and MI325X share an identical 2614.9 TFLOPS dense FP8 peak, yet the later generation’s audited per-card throughput is 33% lower, because the two submissions differ in node scale and engineering effort — an audited number is not a chip number either. Sensitivity test: swapping the software axis from stars to “v6.0 tests submitted / 11” drops all top-12 cards by 4.59-10.00 points and changes not one rank, so nothing was re-scored; convention note (17) and a five-level evidence table (L4 audited / L3 reproducible recipe / L2 conclusion only / L1 datasheet spec / L0 my estimate) were added. Re-checked 2026-08-02, auditing the word “bandwidth” itself: the numbers this board calls bandwidth are actually five different quantities (physical main-memory, its rack-level aggregate, on-chip SRAM, near-memory “effective”, and card-to-card scale-up) spanning five orders of magnitude. Using Qualcomm's 2026-06-24 investor-day roadmap as the entry point, the denominator behind AI250’s “133 TB/s effective per card” is pinned at 7.39 TB/s by three unrelated paths — 133/18 (the footnote defines 18x as per-card vs AI200), 414/56 (the rack aggregate divided by chip count), and 6720 bit x 8.8 Gbps (The Register's reverse-engineered bus width). So AI200’s “effective” is a physical aggregate while AI250’s is physical x an 18x near-memory reuse factor. Feeding all five conventions through the scoring formula, one dimension can take any value from 0 to 120 points while the top card's total is 417. d-Matrix Corsair is the cleanest counterexample: one datasheet prints 2 GB @ 150 TB/s next to up to 256 GB @ 400 GB/s, a 375x gap that moves the ridge point between 16 and 6000 FLOP/B. The audit came back clean: all 32 ranked cards use the physical convention, so nothing was re-scored, and the bidirectional-vs-unidirectional question on the scale-up axis cancels to exactly 0.00 in a log-ratio model. Also lands Qualcomm AI300 (HBC Gen 2, 54x, UALink + ESUN, 43 TB rack capacity unchanged across three generations, air and direct-liquid cooling throughout) and corrects two earlier claims in this note. Re-checked 2026-08-01: Ascend 950DT lands on Huawei Cloud a quarter early, and Huawei's official Ascend 950 NPU architecture white paper shows this board had filled in the wrong generation — the 2 PFLOPS FP8 / 4 PFLOPS FP4 credited to the 950DT are actually the next-gen Ascend 960's numbers, while four independent sources (the white paper, the HC roadmap, the Atlas 950 SuperPoD system figure, and the per-rack figure) all point to ~1 PF / ~2 PF per card. The spec table itself is the more interesting find: one die is printed with three redundancy bins (the low bin is 78% of the top), two compute conventions (Cube+Vector total vs Cube only, where the vector core's flat 60 TFLOPS does not double with precision), and two memory capacities (144/96 GB, customer-selectable) — six combinations spanning 210 to 232 index points, the same magnitude as the 27-point peak/delivered gap found on 07-30. Index 258 → 232, rank 10 → 12; the same white paper's first-ever L2 disclosure (128 MB) lifts the 950PR from 197 to 205 with no rank change. Also clarified: Atlas 950's 8192 cards is a theoretical ceiling and 1024 is what ships — which moves zero points, because the domain axis saturates at exactly 1024. Re-checked 2026-07-30, this time auditing the board's own denominator: nine of the ten dimensions are fed datasheet peak numbers, and AMD's Instinct MI350P is the first card to print delivered next to peak on the same spec page (the discount ranges from 39% to 67% depending on the numeric format). AMD also published a Peak / MAF / Delivered taxonomy recommending MFU switch denominators, while third-party measurements split achieved-vs-peak into three uncorrelated curves — compute 44-93%, memory bandwidth 81-90%, scale-up all-reduce 70-85%. Scored on peak the MI350P lands at 219 and rank 13; on delivered, 192 and rank 16.",
    },
    date: "2026-08-05",
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
      zh: "稳定 URL 滚动更新:统计 AI Infra 和大模型相关的当天、一周、一个月、半年、一年热点,结合 GitHub release、新闻和官方博客证据分析历史、当下与未来趋势。2026-08-02:当天关注 llama.cpp / LiteLLM / FlashInfer 高频工程信号,一周内聚焦 vLLM 0.26、Kimi K3 day-0 serving、MCP stateless core、KV 数据层与 GW 级算力供给。",
      en: "Stable-URL rolling update: AI Infra and LLM signals across day/week/month/half-year/year windows, with GitHub releases, news, and official-blog evidence for historical, current, and future trends. 2026-08-02: today focuses on llama.cpp / LiteLLM / FlashInfer engineering signals, while the week highlights vLLM 0.26, Kimi K3 day-0 serving, MCP stateless core, the KV data layer, and gigawatt-scale compute supply.",
    },
    date: "2026-08-02",
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
