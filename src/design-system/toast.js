// =============================================================
// DsToast — programmatic notification helper.
// Wraps Quasar 1's $q.notify with STC brand styling.
//
// Usage (programmatic):
//   import { toast } from 'src/design-system/toast';
//   toast({ type: 'success', message: 'Saved.' });
//
// Usage (plugin, after Vue.use(DsToastPlugin)):
//   this.$toast({ type: 'danger', message: 'Failed.' });
//
// Types: success | warning | danger | info | neutral
// =============================================================

import { Notify } from "quasar";

// Per-type style map. Colors resolved from CSS custom properties at
// runtime via `getComputedStyle` so theme overrides still work.
const TYPE_STYLES = {
  success: {
    bgVar: "--ds-success",
    textVar: "--ds-ivory",
    icon: "check_circle",
  },
  warning: {
    bgVar: "--ds-warning",
    textVar: "--ds-ink",
    icon: "warning",
  },
  danger: {
    bgVar: "--ds-danger",
    textVar: "--ds-ivory",
    icon: "error",
  },
  info: {
    bgVar: "--ds-indigo",
    textVar: "--ds-ivory",
    icon: "info",
  },
  neutral: {
    bgVar: "--ds-ivory",
    textVar: "--ds-ink",
    icon: "notifications",
    border: true,
  },
};

function readVar(name) {
  if (typeof window === "undefined") return "";
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(name).trim();
}

function resolveStyle(style) {
  const bg = readVar(style.bgVar);
  const color = readVar(style.textVar);
  const border = style.border ? `1px solid ${readVar("--ds-border-strong")}` : "none";
  // Notify accepts a `style` string applied to the notification body.
  return [
    `background:${bg}`,
    `color:${color}`,
    `border:${border}`,
    `border-radius:var(--ds-radius-md)`,
    `font-family:var(--ds-font-body)`,
    `line-height:var(--ds-leading-arabic)`,
    `box-shadow:var(--ds-shadow-lg)`,
    `padding:0.75rem 1rem`,
  ].join(";");
}

/**
 * Show a branded toast.
 * @param {Object} opts
 * @param {'success'|'warning'|'danger'|'info'|'neutral'} [opts.type='neutral']
 * @param {string} opts.message
 * @param {number} [opts.duration=4000]   Use 0 for sticky.
 * @param {string} [opts.position='top']  'top'|'bottom'|'top-right' etc.
 * @param {Array}  [opts.actions]         Array of { label, handler, color }
 */
export function toast(opts = {}) {
  const {
    type = "neutral",
    message = "",
    duration = 4000,
    position = "top",
    actions,
    icon,
    html = false,
  } = opts;

  const style = TYPE_STYLES[type] || TYPE_STYLES.neutral;

  const config = {
    message,
    position,
    timeout: duration,
    html,
    icon: icon === null ? undefined : icon || style.icon,
    classes: `ds-toast ds-toast--${type}`,
    attrs: { role: type === "danger" ? "alert" : "status" },
    // Use inline style so we don't need to register global CSS for
    // every Quasar internal class.
    style: resolveStyle(style),
  };

  if (Array.isArray(actions) && actions.length) {
    config.actions = actions.map((a) => ({
      label: a.label,
      color: a.color || "white",
      handler: a.handler,
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

// Vue 2 plugin — exposes `this.$toast` on every component instance.
export const DsToastPlugin = {
  install(Vue) {
    if (Vue.prototype.$toast) return;
    Vue.prototype.$toast = toast;
  },
};

export default toast;
