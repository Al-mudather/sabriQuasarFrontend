import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

// =============================================================
// Unify every notification under one bottom-positioned, brand-
// styled look. Two surfaces feed Quasar Notify:
//   1. the DS `toast()` helper (src/design-system/toast.js), and
//   2. raw `$q.notify({ type: 'positive' | 'negative' | ... })`
//      calls across the app (~37 sites).
// Registering the built-in Quasar types here makes the raw calls
// adopt the same `ds-toast` styling (see src/css/ds-toast.scss)
// without touching each call site. setDefaults pins position to
// the bottom for anything that doesn't override it.
// =============================================================

const TYPE_MAP = {
  positive: { classes: 'ds-toast ds-toast--success', icon: 'check_circle', color: 'transparent', textColor: 'dark' },
  negative: { classes: 'ds-toast ds-toast--danger',  icon: 'error',        color: 'transparent', textColor: 'dark' },
  warning:  { classes: 'ds-toast ds-toast--warning', icon: 'warning',      color: 'transparent', textColor: 'dark' },
  info:     { classes: 'ds-toast ds-toast--info',    icon: 'info',         color: 'transparent', textColor: 'dark' },
}

export default boot(() => {
  Notify.setDefaults({
    position: 'bottom',
    progress: true,
    multiLine: true,
    timeout: 4000,
  })

  for (const [type, cfg] of Object.entries(TYPE_MAP)) {
    Notify.registerType(type, cfg)
  }
})
