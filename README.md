# hzhuang.org — Hong Zhuang's personal site

Personal website / online resume for **Hong Zhuang** — Machine Learning Engineer, focused on multimodal LLM training, distributed systems, and model acceleration. Live at [https://www.hzhuang.org](https://www.hzhuang.org).

## Preview

![Preview](images/Preview.png)

## Stack

- Pure static HTML / CSS / JS — no build step required for the site itself.
- [MDB (Material Design for Bootstrap)](https://mdbootstrap.com/) 5 for layout and components.
- [AOS](https://michalsnik.github.io/aos/) for scroll-triggered animations.
- [Font Awesome](https://fontawesome.com/) for icons.
- Hosted on **GitHub Pages** with a custom domain (`CNAME` → `www.hzhuang.org`).

## Local preview

The site has no build step; just open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing styles

`css/main.css` is compiled from `styles/*.scss`. To re-compile after editing the SCSS sources:

```bash
sass styles/main.scss css/main.css
```

## Reference

Original template: [TemplateFlip](https://templateflip.com)
