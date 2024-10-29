
import { warn,mark } from "../util";
import { createEmptyVNode } from "../vdom/vnode";
import config from "../config";

export function initLifeCycle(vm) {}

export function mountComponent(vm,el){
    vm.$el = el;

    if(!vm.$options.render){
        vm.$options.render = createEmptyVNode;

        if (__DEV__) {
            if (
                (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                vm.$options.el ||
                el
            ) {
                warn(
                    "您使用的是仅运行时的Vue构建，其中模板’+‘编译器不可用。要么将模板预编译为“+”渲染函数，或者使用包含编译器的构建。"
                )
            }
        }else {
            warn(
              '未能装载组件：模板或渲染函数未定义。',
            )
        }
    }
    let updateComponent
    if (__DEV__ && config.performance && mark) {
        updateComponent = ()=>{
            const name = vm._name
            const id = vm._uid
            const startTag = `vue-perf-start:${id}`
            const endTag = `vue-perf-end:${id}`

            mark(startTag)
            const vnode = vm._render()
            mark(endTag)
            measure(`vue ${name} render`, startTag, endTag)

            mark(startTag)
            vm._update(vnode, hydrating)
            mark(endTag)
            measure(`vue ${name} patch`, startTag, endTag)
        }
    }else{
        updateComponent = ()=>{
            vm._update(vm._render())
        }
    }

    updateComponent()
    return vm;
}

export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this;
        vm.__patch__(vm.$el,vnode);
    }
}