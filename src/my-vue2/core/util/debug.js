import { noop } from "@/my-vue2/shared/util";

export let warn = noop

if(__DEV__){
    warn = (msg) => {
        // 内部其实还有一些逻辑 我们会在后续的章节中补充
        const hasConsole = typeof console !== 'undefined'
        if(hasConsole){
            console.error(`[My Vue2 warn]: ${msg}`) 
        }
    }
}