# ViralHook Studio — Frontend Architecture (Day 1)

**Lead:** Samina (Frontend UI Architecture & State Store Lead)  
**Stack:** React 18 / 19, Vite, Tailwind CSS v4, Zustand, Lucide React, Recharts  

---

## 🎨 Dark Studio SaaS Design System

Configured in `src/index.css` according to PRD Section 5.2 specifications:

| Token | Hex Value | Usage |
|---|---|---|
| `--color-studio-bg` | `#11121B` | Deep obsidian canvas background |
| `--color-studio-panel` | `#202238` | Card and modal surface panels |
| `--color-studio-panel-elevated` | `#282a45` | Hovered and elevated panel surfaces |
| `--color-studio-border` | `#2e3152` | Subtle panel and divider borders |
| `--color-studio-accent` | `#A78BFA` | Primary studio violet accent |
| `--color-studio-accent-hover` | `#9065f7` | Active / hover button violet |
| `--color-studio-text` | `#F1F5F9` | High-contrast WCAG 2.1 AA body text |
| `--color-studio-muted` | `#94A3B8` | Secondary labels and metadata |
| `--color-studio-success` | `#10B981` | Green pacing zone (≤ 3.0s) & low clickbait risk |
| `--color-studio-warning` | `#F59E0B` | Yellow moderate zone & Dead-Heat margin guard |
| `--color-studio-danger` | `#EF4444` | Red warning zone (> 4.5s) & linter clichés |

---

## 🧩 Shared UI Primitives (`src/components/ui/`)

Pre-built components ready for Meenmoy (Battle Arena) and team integration:

* **`<Button variant="..." size="..." icon={...}>`**:
  * Variants: `primary`, `secondary`, `outline`, `danger`, `ghost`
  * Sizes: `sm`, `md`, `lg`
* **`<Card>`**, **`<CardHeader>`**, **`<CardBody>`**:
  * Dark studio panel with `#202238` background and `#2e3152` borders. Supports `borderAccent` for highlighting battle winners.
* **`<Badge variant="..." size="...">`**:
  * Status badges (`default`, `accent`, `success`, `warning`, `danger`).
* **`<Tooltip text="...">`**:
  * Accessible hovering tooltips with positioned popovers.

---

## 🏗️ Folder Structure

```
frontend/
├── src/
│   ├── assets/              # Static branding and SVG icons
│   ├── components/
│   │   ├── ui/              # Samina: Shared primitives (Button, Card, Badge, Tooltip)
│   │   ├── layout/          # Samina: Studio App Shell (Header, Footer, Onboarding)
│   │   ├── arena/           # Meenmoy: Battle Arena, Pace Barometer, Linter Popovers
│   │   └── history/         # Samina: Saved Battle Library Drawer
│   ├── store/               # Samina: Zustand Global State Store (useHookStore.js)
│   ├── services/            # Samina: Backend API service client & offline heuristics
│   ├── utils/               # Pacing tempo calculator (2.75 wps) & linter regexes
│   ├── App.jsx              # Studio workspace container
│   ├── index.css            # Tailwind v4 dark studio tokens
│   └── main.jsx             # React entrypoint
├── package.json
└── vite.config.js
```

---

## 🚀 Running Locally

```bash
cd frontend
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
*(Verified: compiles in <1.5s with zero errors).*
