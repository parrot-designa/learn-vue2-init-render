import Vue from "./runtime/index"
import { createCompiler } from "@/my-vue2/compiler/index"

// Vue上扩展了定义了Vue.compile 
// 重写了 Vue.prototype.$mount
let mount = Vue.prototype.$mount;

Vue.prototype.$mount = function(el){
    const vm = this;
    const options = vm.$options; 
    if (!options.render) { 
        const { compileToFunctions } = createCompiler()
        const { render } = compileToFunctions(options.template);
        options.render = render
    }
    return mount.call(this, el);
}

export default Vue;