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

// Per-type icon + timeout. The VISUAL styling (ivory card, tinted icon
// chip, per-type accent + progress line, bottom position) lives in the
// global stylesheet src/css/ds-toast.scss, keyed off the `ds-toast` +
// `ds-toast--<type>` classes added below. Keeping colors in CSS (not
// inline) means both this helper and raw `$q.notify` calls (restyled via
// the notify boot) share one source of truth.
//
// Timeouts:
//   default  — 4000ms
//   danger   — 5000ms (longer; user must read the error)
const TYPE_META = {
  success: { icon: "check_circle",  timeout: 4000 },
  warning: { icon: "warning",       timeout: 4000 },
  danger:  { icon: "error",         timeout: 5000 },
  info:    { icon: "info",          timeout: 4000 },
  neutral: { icon: "notifications", timeout: 4000 },
};

/**
 * Show a branded toast (ivory + accent, bottom-positioned).
 * @param {Object} opts
 * @param {'success'|'warning'|'danger'|'info'|'neutral'} [opts.type='neutral']
 * @param {string}  opts.message
 * @param {number}  [opts.duration]    Override default per-type timeout. Use 0 for sticky.
 * @param {string}  [opts.position='bottom']  'bottom'|'top'|'top-right' etc.
 * @param {Array}   [opts.actions]         Array of { label, handler, color }
 * @param {string|null} [opts.icon]    Override icon. Pass null to suppress the icon.
 * @param {boolean} [opts.html=false]  Render message as HTML.
 */
export function toast(opts = {}) {
  const {
    type = "neutral",
    message = "",
    duration,
    position = "bottom",
    actions,
    icon,
    html = false,
  } = opts;

  const meta = TYPE_META[type] || TYPE_META.neutral;

  // duration arg wins; otherwise fall back to per-type default
  const timeout = typeof duration === "number" ? duration : meta.timeout;

  const config = {
    message,
    position,
    timeout,
    html,
    // progress bar lets users see the dismiss timer visually
    progress: timeout > 0,
    // multiLine handles long Arabic text without truncation
    multiLine: true,
    icon: icon === null ? undefined : icon || meta.icon,
    classes: `ds-toast ds-toast--${type}`,
    attrs: { role: type === "danger" ? "alert" : "status" },
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
