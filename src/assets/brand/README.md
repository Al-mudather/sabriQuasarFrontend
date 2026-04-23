# Brand assets

Master: `logo-full.jpg` — a copy of `public/icons/STC_logo_hight_quality.jpg`.

## Variants required (Phase 2)

The current master is a JPG, which has **no transparency** and cannot be recoloured
cleanly. Phase 2 should request a proper **SVG master** from the client, from which
we derive:

| Variant            | Use case                                           |
| ------------------ | -------------------------------------------------- |
| `logo-full.svg`    | Full-colour lockup — default header usage          |
| `logo-mark.svg`    | Mark/icon only — favicons, tight nav, loaders      |
| `logo-wordmark-ar.svg` | Arabic wordmark only — hero mastheads          |
| `logo-wordmark-en.svg` | Latin wordmark only — footer + credits         |
| `logo-cream-on-indigo.svg` | Reverse-lockup on indigo (`#322873`)       |
| `logo-dark-on-cream.svg`   | Default on cream (`#F6F1EA`)               |

Also request: PNG exports at `@1x`, `@2x`, `@3x` for email / legacy Android
embedding, and an ICO/favicon pack.

## Usage

Import via `@/design-system/brand.js` — never reference raw paths from components.
The brand module is the single source of truth.

```js
import { LOGO, BRAND, COLORS } from '@/design-system/brand';
```
