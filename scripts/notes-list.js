/* =========================================================================
   notes-list.js — renders the knowledge-notes index from window.NOTES.
   Handles: bilingual cards (zh/en spans so the global lang toggle works),
   date sorting, tag filter chips, live text search, and splitting the list
   into topic sections (see `category` in notes/notes.js).
   Loaded after notes/notes.js (the data) and works with the shared app.js
   for theme + language toggles.
   ========================================================================= */

(function () {
  'use strict';

  const root = document.getElementById('notes-groups');
  if (!root) return;

  // Section order is deliberate: the evergreen technical topics come first so
  // the rolling industry snapshots don't bury them at the top of the page.
  const GROUPS = [
    { key: 'inference', zh: '推理引擎', en: 'Inference Engines', descZh: 'vLLM 内部机制、KV cache 与显存', descEn: 'vLLM internals, KV cache, and GPU memory' },
    { key: 'parallel', zh: '分布式与并行', en: 'Distributed & Parallelism', descZh: '切分方式、通信量与卡间编排', descEn: 'Sharding schemes, communication cost, and inter-GPU choreography' },
    { key: 'model', zh: '模型与算子', en: 'Models & Kernels', descZh: '模型结构剖析与 kernel 编写', descEn: 'Model anatomy and kernel authoring' },
    { key: 'industry', zh: '行业分析', en: 'Industry Analysis', descZh: '榜单与趋势,带时间戳的快照', descEn: 'Leaderboards and trends — timestamped snapshots' },
  ];
  const KNOWN = GROUPS.map((g) => g.key);
  // Anything with a missing or unrecognised category still gets rendered here,
  // so a typo in the manifest can never make a note silently disappear.
  const OTHER = { key: '__other', zh: '其他', en: 'Other', descZh: '未归类', descEn: 'Uncategorised' };

  const notes = Array.isArray(window.NOTES) ? window.NOTES.slice() : [];
  const searchInput = document.getElementById('notes-search');
  const tagBar = document.getElementById('tag-filters');
  const countEl = document.getElementById('notes-count');

  // Sort newest first.
  notes.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  // i18n helper: a field may be { zh, en } or a plain string.
  function field(value, lang) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[lang] != null ? value[lang] : value.en || value.zh || '';
  }

  // Build a <span> pair so the existing CSS lang-swap drives display.
  function bilingual(value, cls) {
    const zh = field(value, 'zh');
    const en = field(value, 'en');
    if (zh === en) {
      return `<span class="${cls}">${escapeHtml(zh)}</span>`;
    }
    return (
      `<span class="${cls}"><span lang="zh-CN" class="i18n-zh">${escapeHtml(zh)}</span>` +
      `<span lang="en" class="i18n-en">${escapeHtml(en)}</span></span>`
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toISOString().slice(0, 10);
  }

  // Collect tags for the filter bar.
  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))].sort();
  let activeTag = null;
  let query = '';

  function renderTagBar() {
    if (!tagBar) return;
    const chips = [`<button class="tag-filter${activeTag === null ? ' active' : ''}" data-tag="">`
      + `<span lang="zh-CN" class="i18n-zh">全部</span><span lang="en" class="i18n-en">All</span></button>`];
    allTags.forEach((t) => {
      chips.push(
        `<button class="tag-filter${activeTag === t ? ' active' : ''}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`
      );
    });
    tagBar.innerHTML = chips.join('');
  }

  function matches(note) {
    if (activeTag && !(note.tags || []).includes(activeTag)) return false;
    if (query) {
      const hay = [
        field(note.title, 'zh'), field(note.title, 'en'),
        field(note.summary, 'zh'), field(note.summary, 'en'),
        (note.tags || []).join(' '),
      ].join(' ').toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  }

  function card(note) {
    const tags = (note.tags || [])
      .map((t) => `<li>${escapeHtml(t)}</li>`)
      .join('');
    return (
      `<a class="note-card" href="notes/${encodeURIComponent(note.slug)}.html">` +
      `<span class="note-date">${escapeHtml(fmtDate(note.date))}</span>` +
      bilingual(note.title, 'note-title') +
      bilingual(note.summary, 'note-summary') +
      `<ul class="note-tags">${tags}</ul>` +
      `<span class="note-read">` +
      `<span lang="zh-CN" class="i18n-zh">阅读</span><span lang="en" class="i18n-en">Read</span>` +
      ` <span class="arrow">→</span></span>` +
      `</a>`
    );
  }

  function section(group, items) {
    return (
      `<section class="notes-group" data-group="${group.key}">` +
      `<div class="notes-group-head">` +
      `<h2 class="notes-group-title">` +
      `<span lang="zh-CN" class="i18n-zh">${group.zh}</span><span lang="en" class="i18n-en">${group.en}</span>` +
      `</h2>` +
      `<span class="notes-group-note">` +
      `<span lang="zh-CN" class="i18n-zh">${group.descZh}</span><span lang="en" class="i18n-en">${group.descEn}</span>` +
      `</span>` +
      `<span class="notes-group-rule" aria-hidden="true"></span>` +
      `<span class="notes-group-count">${items.length}</span>` +
      `</div>` +
      `<div class="notes-grid">${items.map(card).join('')}</div>` +
      `</section>`
    );
  }

  function render() {
    const visible = notes.filter(matches);

    if (countEl) {
      countEl.innerHTML =
        `<span lang="zh-CN" class="i18n-zh">${visible.length} 篇笔记</span>` +
        `<span lang="en" class="i18n-en">${visible.length} note${visible.length === 1 ? '' : 's'}</span>`;
    }

    const empty = document.getElementById('notes-empty');
    if (!visible.length) {
      root.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    // Only render a section that still has matches, so filtering never
    // leaves a stranded heading behind.
    const html = GROUPS.map((g) => {
      const items = visible.filter((n) => n.category === g.key);
      return items.length ? section(g, items) : '';
    });
    const stray = visible.filter((n) => !KNOWN.includes(n.category));
    if (stray.length) html.push(section(OTHER, stray));
    root.innerHTML = html.join('');
  }

  if (tagBar) {
    tagBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-filter');
      if (!btn) return;
      const tag = btn.getAttribute('data-tag');
      activeTag = tag ? tag : null;
      renderTagBar();
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      query = searchInput.value.trim().toLowerCase();
      render();
    });
  }

  renderTagBar();
  render();
})();
