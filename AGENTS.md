# AGENTS.md

## Cursor Cloud specific instructions

This repo is the personal website `hzhuang.org` — a 100% static, vanilla **HTML / CSS / JavaScript** site with **no build step and no package manager** (no `package.json`, no `requirements.txt`). Do not look for a bundler or install step for the site itself.

### Run the site (development)
Serve the repo root with any static file server, e.g. the one documented in `README.md`:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

- Entry pages: `index.html` (single-page site) and `notes.html` (knowledge-notes index).
- The notes index and individual notes render dynamically from `notes/notes.js` via `scripts/notes-list.js`, so they must be loaded over HTTP (opening the file directly with `file://` will break the fetch-based rendering).
- Core interactions live in `scripts/app.js`: dark/light theme toggle and EN/中文 language toggle (both persisted to `localStorage`; language is also reflected in the URL as `?lang=en`). Site defaults to Chinese + dark theme.

### Lint (mirrors CI)
CI (`.github/workflows/link-check.yml`) runs the **lychee** link checker over `./**/*.html`. `lychee` is installed to `~/.local/bin/lychee` by the startup update script (it is not a repo dependency and not available by default).

- Fast local-only check (recommended while developing — no network, checks internal links/anchors/assets):
  ```bash
  lychee --offline --no-progress './**/*.html'
  ```
- Full check like CI also validates external URLs and is slow / can hit rate limits or egress restrictions in the cloud VM, so prefer `--offline` unless you specifically need to validate external links.

### Tests
There is no automated test suite in this repo.

### Adding a knowledge note
No build required — see `README.md` ("Adding a knowledge note"): copy `notes/_template.html` and register the entry in `notes/notes.js`.
