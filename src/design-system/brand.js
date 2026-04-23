/**
 * Brand module — single source of truth for logo paths, brand strings,
 * and colour tokens used from JS/Vue (SCSS equivalents live in
 * `tokens.scss`).
 *
 * All components should import from here — never reference raw asset
 * paths or hex codes elsewhere.
 */

// Vite resolves this URL-import at build time and fingerprints the asset.
// (The earlier `require()` call was a webpack-era pattern and doesn't work
// in ESM/Vite — it crashed the app at module load with "require is not defined".)
import logoFull from 'src/assets/brand/logo-full.jpg'

export const LOGO = {
  /** Full-colour lockup — default header usage. */
  full: logoFull,
  /**
   * Mark / icon only. TODO (Phase 2): swap to a real SVG mark once the
   * client delivers an SVG master. Falls back to the full lockup today.
   */
  mark: logoFull,
  /**
   * Arabic wordmark. TODO (Phase 2): dedicated SVG variant. Falls back
   * to the full lockup today.
   */
  wordmarkAr: logoFull,
};

export const BRAND = {
  nameAr: 'مركز د. صبري أبوقرون للتدريب',
  nameEn: 'Dr. Sabri Abugroon Training Center',
  acronym: 'STC',
};

/**
 * Canonical colour palette. Keep in lockstep with `tokens.scss`.
 * Changing a value here without updating tokens.scss (and vice-versa)
 * will produce visual drift — treat them as one unit.
 */
export const COLORS = {
  indigo:     '#322873',
  indigoDeep: '#1F1847',
  cream:      '#F6F1EA',
  ivory:      '#FBF7F0',
  ink:        '#1B1410',
  terracotta: '#C1623C',
  taupe:      '#8A7A6A',
};

export default { LOGO, BRAND, COLORS };
