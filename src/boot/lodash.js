import { boot } from 'quasar/wrappers'
import _ from 'lodash'

export default boot(({ app }) => {
  app.config.globalProperties.$_ = _
})
