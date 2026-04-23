# Fonts

Three Arabic-first families, three weights each. All licensed under the
**SIL Open Font License 1.1** (see per-family `OFL.txt`).

| Family                 | Weights                       | Role (per DESIGN.md) |
| ---------------------- | ----------------------------- | -------------------- |
| Tajawal                | 400 / 500 / 700               | Display + headings   |
| IBM Plex Sans Arabic   | 400 / 500 / 600               | Body + UI            |
| Cairo                  | 400 / 500 / 600               | Accent / numerics    |

## Source

Files were downloaded from the Fontsource CDN (`cdn.jsdelivr.net/fontsource`),
which repackages the original Google Fonts releases as WOFF2 with stable URLs:

```
tajawal/arabic-{400,500,700}-normal.woff2
ibm-plex-sans-arabic/arabic-{400,500,600}-normal.woff2
cairo/arabic-{400,500,600}-normal.woff2
```

If you need to refresh:

```sh
curl -sSL -o tajawal/Tajawal-Regular.woff2 \
  https://cdn.jsdelivr.net/fontsource/fonts/tajawal@latest/arabic-400-normal.woff2
# ... etc — see this file's git history for the full list.
```

## Consumption

`@font-face` rules live in `src/design-system/tokens.scss` (Agent 1A). Paths
resolve through Quasar's asset pipeline via `~src/assets/fonts/...`.

## Alternative (future)

Consider replacing these checked-in files with:

```sh
npm i -D @fontsource/tajawal @fontsource/ibm-plex-sans-arabic @fontsource/cairo
```

and importing the CSS from a boot file. That gives automatic weight subsetting
and is easier to update — but couples us to npm availability at build time and
adds ~150 KB to `node_modules`. Keep the vendored approach unless tree-shake
proves lossy.
