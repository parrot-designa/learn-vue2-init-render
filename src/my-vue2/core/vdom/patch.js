import { isArray } from '@/my-vue2/shared/util';
import { isDef } from "../util"
import VNode from "./vnode"

export function createPatchFunction({ nodeOps }){
    // 基于 elm创建一个虚拟节点
    function emptyNodeAt(elm) {
        return new VNode({tag:nodeOps.tagName(elm).toLowerCase(), data:{}, children:[],text:undefined,elm});
    }

    function insert(parent,elm,referenceElm){
        if(referenceElm){
            nodeOps.insertBefore(parent,elm,referenceElm)
        }else{
            nodeOps.appendChild(parent,elm)
        }
    }

    function createChildren(children,parentElm,referenceElm){
        for(let i=0;i<children.length;i++){
            createElm(children[i], parentElm,referenceElm)
        }
    }

    function createElm(vnode,parentElm,referenceElm){
        const tag = vnode.tag;
        const text = vnode.text;
        if(isDef(tag)){
            vnode.elm = nodeOps.createElement(tag);
            createChildren(vnode.children, vnode.elm);
            insert(parentElm, vnode.elm,referenceElm)
        }else if(text){
            vnode.elm = nodeOps.createTextNode(text);
            insert(parentElm, vnode.elm,referenceElm)
        }
    }

    function removeNode(el) {
        const parent = nodeOps.parentNode(el)
        if (isDef(parent)) {
          nodeOps.removeChild(parent, el)
        }
    } 
    
    // oldVnode代表上一次渲染的 vnode
    // vnode代表这次渲染的 vnode
    return function patch(oldVnode,vnode){
        // 判断是否是一个真实节点
        const isRealElement = isDef(oldVnode.nodeType)
        if (isRealElement) {
            oldVnode = emptyNodeAt(oldVnode)
        }
        // 将要替换旧的节点
        const oldElm = oldVnode.elm;
        const parentElm = nodeOps.parentNode(oldElm);

        createElm(
            vnode,
            parentElm,
            nodeOps.nextSibling(oldElm)
        );

        if (isDef(parentElm)) { 
            removeNode(oldElm)
        }
    }
}