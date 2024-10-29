export default class VNode {
    tag;
    data;
    children;
    text;
    elm;
    constructor({ tag, data, children, text, elm }){
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
    }
}

// 创建一个文字vnode
export const createTextVNode = (text) => {
    return new VNode({ text:String(text) })
}
 
// 创建一个空的虚拟节点
export const createEmptyVNode = (text="")=>{
    const node = new VNode({});
    node.text = text;
    node.isComment = true;
    return node;
}