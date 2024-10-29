import { createTextVNode } from "../vdom/vnode";

export function installRenderHelpers(target){

    target._v = createTextVNode

}