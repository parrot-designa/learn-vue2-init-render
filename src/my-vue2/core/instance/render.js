import { createElement } from "../vdom/create-element";
import { installRenderHelpers } from "./render-helpers";


// 待完善
export function renderMixin(Vue){

    installRenderHelpers(Vue.prototype);

    Vue.prototype._render = function () {
        const vm = this
        const { render } = vm.$options
        let vnode = render.call(vm, vm.$createElement)
        return vnode;
    }
}

export function initRender(vm){
    vm._c = (tag, data, children) => createElement(tag, data, children)
}