// Design system barrel. Use as a Vue plugin:
//   Vue.use(DesignSystem)
// …or import individual components:
//   import { DsCard } from 'src/design-system'

import DsBadge       from './components/DsBadge.vue'
import DsButton      from './components/DsButton.vue'
import DsCard        from './components/DsCard.vue'
import DsEmptyState  from './components/DsEmptyState.vue'
import DsProgressBar from './components/DsProgressBar.vue'
import DsSkeleton    from './components/DsSkeleton.vue'

const components = {
  DsBadge,
  DsButton,
  DsCard,
  DsEmptyState,
  DsProgressBar,
  DsSkeleton
}

export {
  DsBadge,
  DsButton,
  DsCard,
  DsEmptyState,
  DsProgressBar,
  DsSkeleton
}

export default {
  install (Vue) {
    Object.entries(components).forEach(([name, component]) => {
      Vue.component(name, component)
    })
  }
}
