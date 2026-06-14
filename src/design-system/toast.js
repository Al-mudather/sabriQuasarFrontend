// =============================================================
// DsToast — programmatic notification helper.
// Wraps Quasar 2's Notify with STC brand styling.
//
// Usage (programmatic):
//   import { toast } from 'src/design-system/toast';
//   toast({ type: 'success', message: 'Saved.' });
//
// Usage (Quasar 2 plugin, after app.use(DsToastPlugin)):
//   app.config.globalProperties.$toast(...)
//
// Types: success | warning | danger | info | neutral
// =============================================================

import { Notify } from "quasar";

// Per-type style map. Colors resolved from CSS custom properties at
// runtime via `getComputedStyle` so theme overrides still work.
//
// Color strategy per type:
//   success  — saturated green bg (--ds-success) / ivory text
//   warning  — tinted warm bg (--ds-warning-bg) / ink text
//              (dark text is more legible on the light tinted bg)
//   danger   — deep red bg (--ds-danger) / ivory text
//   info     — Royal Indigo bg (--ds-brand-600) / ivory text
//   neutral  — ivory bg (--ds-ivory) / ink text + hairline border
//
// Timeouts:
//   default  — 4000ms
//   danger   — 5000ms (longer; user must read the error)
const TYPE_STYLES = {
  success: {
    bgVar:   "--ds-success",
    textVar: "--ds-ivory",
    icon:    "check_circle",
    timeout: 4000,
  },
  warning: {
    bgVar:   "--ds-warning-bg",
    textVar: "--ds-ink",
    icon:    "warning",
    timeout: 4000,
  },
  danger: {
    bgVar:   "--ds-danger",
    textVar: "--ds-ivory",
    icon:    "error",
    timeout: 5000,
  },
  info: {
    bgVar:   "--ds-brand-600",
    textVar: "--ds-ivory",
    icon:    "info",
    timeout: 4000,
  },
  neutral: {
    bgVar:   "--ds-ivory",
    textVar: "--ds-ink",
    icon:    "notifications",
    border:  true,
    timeout: 4000,
  },
};

function readVar(name) {
  if (typeof window === "undefined") return "";
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(name).trim();
}

function resolveStyle(style) {
  const bg     = readVar(style.bgVar);
  const color  = readVar(style.textVar);
  // neutral gets a hairline border; all other types are full-bleed solid bg
  const border = style.border
    ? `1px solid ${readVar("--ds-border-strong")}`
    : "none";

  // Inline style string applied to the Quasar Notify notification body.
  // Padding uses spacing tokens; no hard-coded hex except through readVar.
  return [
    `background:${bg}`,
    `color:${color}`,
    `border:${border}`,
    `border-radius:var(--ds-radius-md)`,
    `font-family:var(--ds-font-body)`,
    `font-size:var(--ds-text-md)`,
    `line-height:var(--ds-leading-arabic)`,
    `box-shadow:var(--ds-shadow-lg)`,
    `padding:var(--ds-space-3) var(--ds-space-4)`,
  ].join(";");
}

/**
 * Show a branded toast.
 * @param {Object} opts
 * @param {'success'|'warning'|'danger'|'info'|'neutral'} [opts.type='neutral']
 * @param {string}  opts.message
 * @param {number}  [opts.duration]    Override default per-type timeout. Use 0 for sticky.
 * @param {string}  [opts.position='top']  'top'|'bottom'|'top-right' etc.
 * @param {Array}   [opts.actions]         Array of { label, handler, color }
 * @param {string|null} [opts.icon]    Override icon. Pass null to suppress the icon.
 * @param {boolean} [opts.html=false]  Render message as HTML.
 */
export function toast(opts = {}) {
  const {
    type = "neutral",
    message = "",
    duration,
    position = "top",
    actions,
    icon,
    html = false,
  } = opts;

  const style = TYPE_STYLES[type] || TYPE_STYLES.neutral;

  // duration arg wins; otherwise fall back to per-type default
  const timeout = typeof duration === "number" ? duration : style.timeout;

  const config = {
    message,
    position,
    timeout,
    html,
    // progress bar lets users see the dismiss timer visually
    progress: timeout > 0,
    // multiLine handles long Arabic text without truncation
    multiLine: true,
    icon: icon === null ? undefined : icon || style.icon,
    classes: `ds-toast ds-toast--${type}`,
    attrs: { role: type === "danger" ? "alert" : "status" },
    // Inline style so we don't need global CSS for Quasar internals.
    style: resolveStyle(style),
  };

  if (Array.isArray(actions) && actions.length) {
    config.actions = actions.map((a) => ({
      label:     a.label,
      color:     a.color || "white",
      handler:   a.handler,
      noDismiss: a.noDismiss === true,
    }));
  }

  return Notify.create(config);
}

// Convenience shorthands
toast.success = (message, extra = {}) => toast({ type: "success", message, ...extra });
toast.warning = (message, extra = {}) => toast({ type: "warning", message, ...extra });
toast.danger  = (message, extra = {}) => toast({ type: "danger",  message, ...extra });
toast.info    = (message, extra = {}) => toast({ type: "info",    message, ...extra });
toast.neutral = (message, extra = {}) => toast({ type: "neutral", message, ...extra });

// Vue 3 / Quasar 2 plugin — exposes `$toast` on every component instance.
export const DsToastPlugin = {
  install(app) {
    if (app.config.globalProperties.$toast) return;
    app.config.globalProperties.$toast = toast;
  },
};

export default toast;
