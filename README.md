# hzhuang.org — Hong Zhuang's personal site

Personal website / online resume for **Hong Zhuang** — Machine Learning Engineer, focused on multimodal LLM training, distributed systems, and model acceleration. Live at [https://www.hzhuang.org](https://www.hzhuang.org).

## Stack

- 100% **vanilla HTML / CSS / JS** — no framework, no build step.
- Dark / Aurora / Glassmorphism design with full light-mode swap.
- All interactions hand-written: scroll-driven section spy, `IntersectionObserver` reveals, count-up, magnetic buttons, 3D tilt, portrait parallax, custom cursor, marquee.
- Type: **Space Grotesk** (display) + **Inter** (body) + **IBM Plex Mono** (code) via Google Fonts.
- Icons: [Font Awesome](https://fontawesome.com/) (self-hosted under `css/font-awesome/`).
- Form: [Formspree](https://formspree.io/) (honeypot field included).
- Hosted on **GitHub Pages** with a custom domain (`CNAME` → `www.hzhuang.org`).

## Local preview

No build step. Just serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

```
index.html          single-page site
css/design.css      the entire design system (tokens, layout, components, animations, print)
scripts/app.js      all interactions (theme toggle, spy, reveal, tilt, count-up, cursor, magnetic)
css/font-awesome/   icon font, self-hosted
images/             portraits + project visuals
.github/workflows/  link-check CI
```

## Accessibility & motion

- `prefers-reduced-motion: reduce` disables every non-essential animation (aurora, marquee, tilt, custom cursor, char-by-char reveal).
- All `<img>` have `alt`; decorative elements are `aria-hidden`.
- Color contrast tuned to AA in both themes.
- Skip-to-content link at the top.

## Reference

Original starter template (now fully replaced): [TemplateFlip](https://templateflip.com).
