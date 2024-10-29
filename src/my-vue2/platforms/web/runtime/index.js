import Vue from '@/my-vue2/core/index'
import { isReservedTag } from "../util/index"
import { inBrowser, noop } from "@/my-vue2/core/util/index";
import { query } from "@/my-vue2/platforms/web/util/index";
import { mountComponent } from '@/my-vue2/core/instance/lifecycle'
import { patch } from './patch';

// 新增了Vue.prototype.$mount、
Vue.prototype.$mount = function (
    el
) {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el)
}
// 新增了Vue.prototype.__patch__
Vue.prototype.__patch__ = inBrowser ? patch : noop;
// 扩展 Vue.config一些属性
Vue.config.isReservedTag = isReservedTag;
// 扩展 Vue.options.directive
// 扩展 Vue.options.components

export default Vue