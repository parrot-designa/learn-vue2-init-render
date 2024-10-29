import Vue from './instance/index'
import { initGlobalAPI } from './global-api'

// 使用了initGlobalAPI定义了一些全局方法 如 mixin
initGlobalAPI(Vue)
// 定义了Vue.prototype.$isServer
// 定义了Vue.prototype.$ssrContext
// 定义了Vue.FunctionalRenderContext
// 定义了Vue.version

export default Vue