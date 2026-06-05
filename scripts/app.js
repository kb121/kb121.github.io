/* =========================================================================
   app.js — hzhuang.org redesign
   Vanilla JS for: theme toggle, scroll progress, top-nav state,
   side-nav active section, hero char reveal, reveal-on-scroll,
   count-up, marquee duplication, magnetic buttons, 3D tilt,
   portrait parallax, custom cursor.
   ========================================================================= */

(function () {
  'use strict';

  const supportsReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer =
    window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rAF = window.requestAnimationFrame || ((cb) => setTimeout(cb, 16));

  // ----- 1. Footer year -----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- 2. Theme toggle (persisted) -----
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const stored = localStorage.getItem('theme');
  if (stored === 'light') document.documentElement.setAttribute('data-theme', 'light');

  function syncThemeIcon() {
    if (!themeBtn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    themeBtn.innerHTML = isLight
      ? '<i class="fas fa-moon" aria-hidden="true"></i>'
      : '<i class="fas fa-sun" aria-hidden="true"></i>';
    themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }
  syncThemeIcon();
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      syncThemeIcon();
    });
  }

  // ----- 3. Scroll progress bar -----
  const progressEl = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progressEl) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    progressEl.style.width = pct + '%';
  }

  // ----- 4. Top-nav scrolled state -----
  const topnav = document.querySelector('.topnav');
  function updateTopnav() {
    if (!topnav) return;
    topnav.classList.toggle('scrolled', window.scrollY > 16);
  }

  // ----- 5. Section spy (top nav + side nav active) -----
  const navLinks = document.querySelectorAll('.topnav a[data-section]');
  const sideLinks = document.querySelectorAll('.sidenav a[data-section]');
  const sections = [...document.querySelectorAll('section[id]')];

  function setActive(id) {
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('data-section') === id));
    sideLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('data-section') === id));
  }

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to top of viewport that is visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ----- 6. Reveal-on-scroll (with optional stagger) -----
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            // assign incremental --i to children for stagger
            if (entry.target.classList.contains('reveal-stagger')) {
              [...entry.target.children].forEach((c, i) => c.style.setProperty('--i', i));
            }
            reveal.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => reveal.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.classList.add('is-in'));
  }

  // ----- 7. Hero h1 character stagger -----
  // Split each language span individually so the i18n wrapper structure
  // is preserved (both ZH and EN spans need their own .char children
  // because they're swapped by CSS based on <html lang>).
  const heroH1 = document.querySelector('.hero h1[data-split]');
  if (heroH1) {
    const langSpans = heroH1.querySelectorAll('.i18n-zh, .i18n-en');
    const targets = langSpans.length ? langSpans : [heroH1];
    targets.forEach((target) => {
      const text = target.textContent;
      target.textContent = '';
      [...text].forEach((ch, i) => {
        const c = document.createElement('span');
        c.className = 'char';
        c.style.transitionDelay = i * 40 + 'ms';
        c.textContent = ch === ' ' ? '\u00A0' : ch;
        target.appendChild(c);
      });
    });
    rAF(() => rAF(() => heroH1.classList.add('is-in')));
  }

  // ----- 8. Count-up numbers -----
  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = parseInt(el.getAttribute('data-duration') || '1400', 10);
    if (Number.isNaN(target)) return;
    if (supportsReducedMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) rAF(step);
      else el.textContent = target.toFixed(decimals);
    }
    rAF(step);
  }

  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            countIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));
  } else {
    document.querySelectorAll('[data-count]').forEach(animateCount);
  }

  // ----- 9. Marquee duplication (seamless loop) -----
  // Duplicate inner content so translateX(-50%) loops seamlessly.
  document.querySelectorAll('.marquee-track').forEach((track) => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  // ----- 10. Magnetic buttons -----
  if (!supportsReducedMotion && isFinePointer) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 18;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ----- 11. 3D Tilt -----
  if (!supportsReducedMotion && isFinePointer) {
    const MAX = 9; // degrees
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      let rect = null;
      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg)`;
      }
      function onEnter() { rect = card.getBoundingClientRect(); card.style.transition = 'transform 60ms linear'; }
      function onLeave() { rect = null; card.style.transition = 'transform 400ms cubic-bezier(0.22,1,0.36,1)'; card.style.transform = ''; }
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ----- 12. Portrait parallax (subtle) -----
  if (!supportsReducedMotion && isFinePointer) {
    const portrait = document.querySelector('[data-parallax]');
    if (portrait) {
      window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        portrait.style.transform = `translate(${x * -16}px, ${y * -10}px) rotate(${x * 1.4}deg)`;
      });
    }
  }

  // ----- 13. Custom cursor -----
  if (!supportsReducedMotion && isFinePointer) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      let dx = 0, dy = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', (e) => { dx = e.clientX; dy = e.clientY; });
      function tick() {
        rx += (dx - rx) * 0.18;
        ry += (dy - ry) * 0.18;
        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        rAF(tick);
      }
      tick();
      // Hover state when over interactive elements
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, [data-tilt], [data-magnetic], input, textarea')) {
          document.body.setAttribute('data-cursor', 'hover');
        }
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, [data-tilt], [data-magnetic], input, textarea')) {
          document.body.removeAttribute('data-cursor');
        }
      });
    }
  }

  // ----- 13b. i18n (zh / en) toggle, persistence, attribute swap -----
  // The default lang is zh-CN, resolved by the early inline script in <head>
  // from ?lang= -> localStorage.lang -> navigator.language. Here we wire up
  // the toggle button, persist user choice, sync the URL, swap attribute-only
  // strings (title, meta description/og/twitter), and re-trigger the hero
  // character stagger animation so it plays in the newly-active language.

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'zh';
  }

  function syncAttrI18n(lang) {
    // Elements that need attribute swaps (data-zh / data-en) — title, meta
    // description, OG and Twitter tags. Pure CSS can't reach attributes.
    document.querySelectorAll('[data-zh][data-en]').forEach((el) => {
      const value = el.getAttribute('data-' + lang);
      if (value == null) return;
      if (el.tagName === 'TITLE') {
        el.textContent = value;
      } else if (el.tagName === 'META') {
        el.setAttribute('content', value);
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', value);
      } else {
        // Generic fallback: set textContent
        el.textContent = value;
      }
    });
  }

  function retriggerHero() {
    const h1 = document.querySelector('.hero h1[data-split]');
    if (!h1) return;
    h1.classList.remove('is-in');
    // Force reflow so the transition restarts cleanly.
    void h1.offsetWidth;
    h1.classList.add('is-in');
  }

  function setLang(lang, opts) {
    const next = lang === 'en' ? 'en' : 'zh';
    const htmlLang = next === 'en' ? 'en' : 'zh-CN';
    document.documentElement.lang = htmlLang;
    try { localStorage.setItem('lang', next); } catch (_) {}
    syncAttrI18n(next);
    if (opts && opts.syncUrl) {
      try {
        const u = new URL(location.href);
        if (next === 'zh') u.searchParams.delete('lang');
        else u.searchParams.set('lang', 'en');
        history.replaceState(null, '', u);
      } catch (_) {}
    }
    if (opts && opts.retrigger) retriggerHero();
  }

  // Initial sync at load — make attribute-only strings match what the
  // early <head> script decided. (CSS already handled the visible spans.)
  syncAttrI18n(currentLang());

  const langBtn = document.querySelector('[data-lang-toggle]');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const next = currentLang() === 'en' ? 'zh' : 'en';
      setLang(next, { syncUrl: true, retrigger: true });
    });
  }

  // ----- 13c. Note TOC (右侧总览 / right-side overview) -----
  // On a note reading page, auto-build a table-of-contents from the section
  // headings (.prose > h2 / h3), pin it to the right, and highlight the
  // heading nearest the top of the viewport as you scroll. Works for every
  // current and future note without editing the note HTML.
  let updateTOC = function () {};
  if (document.body.classList.contains('note-page')) {
    const prose = document.querySelector('.note-article .prose');
    if (prose) {
      const headings = [...prose.children].filter(
        (el) => el.tagName === 'H2' || el.tagName === 'H3'
      );

      if (headings.length >= 2) {
        const slugify = (text) =>
          (text || '')
            .trim()
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        const usedIds = Object.create(null);
        const items = headings.map((el, i) => {
          if (!el.id) {
            let base = slugify(el.textContent) || 'section-' + i;
            let id = base;
            let n = 1;
            while (usedIds[id] || document.getElementById(id)) id = base + '-' + n++;
            el.id = id;
          }
          usedIds[el.id] = true;
          return { el, id: el.id, level: el.tagName === 'H3' ? 3 : 2 };
        });

        const nav = document.createElement('nav');
        nav.className = 'note-toc';
        nav.setAttribute('aria-label', 'Overview / 总览');

        const title = document.createElement('div');
        title.className = 'note-toc-title';
        title.innerHTML =
          '<span lang="zh-CN" class="i18n-zh">总览</span><span lang="en" class="i18n-en">Overview</span>';
        nav.appendChild(title);

        const list = document.createElement('ul');
        const links = [];
        items.forEach((it) => {
          const li = document.createElement('li');
          li.className = 'lvl-' + it.level;
          const a = document.createElement('a');
          a.href = '#' + it.id;
          // Clone the heading's inner HTML so bilingual <span> wrappers survive
          // and follow the site-wide language toggle automatically.
          a.innerHTML = it.el.innerHTML;
          a.querySelectorAll('i, [aria-hidden="true"]').forEach((n) => n.remove());
          a.removeAttribute('id');
          a.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
          a.addEventListener('click', (e) => {
            e.preventDefault();
            it.el.scrollIntoView({
              behavior: supportsReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
            try {
              history.replaceState(null, '', '#' + it.id);
            } catch (_) {}
          });
          li.appendChild(a);
          list.appendChild(li);
          links.push(a);
        });
        nav.appendChild(list);
        document.body.appendChild(nav);

        let activeIdx = -1;
        updateTOC = function () {
          const offset = 130;
          let idx = 0;
          for (let i = 0; i < items.length; i++) {
            if (items[i].el.getBoundingClientRect().top - offset <= 0) idx = i;
            else break;
          }
          // Snap to the last heading once we've scrolled near the bottom.
          const h = document.documentElement;
          if (h.scrollTop + h.clientHeight >= h.scrollHeight - 4) idx = items.length - 1;
          if (idx === activeIdx) return;
          activeIdx = idx;
          links.forEach((a, i) => a.classList.toggle('active', i === idx));
          // Keep the active entry visible within the (scrollable) TOC panel.
          const active = links[idx];
          if (active && nav.scrollHeight > nav.clientHeight) {
            const aTop = active.offsetTop;
            const aBot = aTop + active.offsetHeight;
            if (aTop < nav.scrollTop) nav.scrollTop = aTop - 8;
            else if (aBot > nav.scrollTop + nav.clientHeight)
              nav.scrollTop = aBot - nav.clientHeight + 8;
          }
        };
        updateTOC();
      }
    }
  }

  // ----- 14. Bind scroll listeners -----
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      rAF(() => {
        updateProgress();
        updateTopnav();
        updateTOC();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', () => {
    rAF(() => {
      updateProgress();
      updateTOC();
    });
  }, { passive: true });
  window.addEventListener('load', () => {
    updateProgress();
    updateTOC();
  });
  updateProgress();
  updateTopnav();
  updateTOC();
})();
