/* =========================================================================
   notes-list.js — renders the knowledge-notes index from window.NOTES.
   Handles: bilingual cards (zh/en spans so the global lang toggle works),
   date sorting, tag filter chips, and live text search.
   Loaded after notes/notes.js (the data) and works with the shared app.js
   for theme + language toggles.
   ========================================================================= */

(function () {
  'use strict';

  const grid = document.getElementById('notes-grid');
  if (!grid) return;

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

  function render() {
    const visible = notes.filter(matches);

    if (countEl) {
      countEl.innerHTML =
        `<span lang="zh-CN" class="i18n-zh">${visible.length} 篇笔记</span>` +
        `<span lang="en" class="i18n-en">${visible.length} note${visible.length === 1 ? '' : 's'}</span>`;
    }

    if (!visible.length) {
      grid.innerHTML = '';
      const empty = document.getElementById('notes-empty');
      if (empty) empty.hidden = false;
      return;
    }
    const empty = document.getElementById('notes-empty');
    if (empty) empty.hidden = true;

    grid.innerHTML = visible
      .map((note) => {
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
      })
      .join('');
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
