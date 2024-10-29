export class CodegenState {
    options;
    constructor(options){
        this.options = options;
    }
}


export function generate(
    ast
){
    const code = ast ? genElement(ast) : '_c("div")'
    return {
        render:new Function(`with(this){return ${code}}`)
    }
} 
export function genText(text) {
    return `_v("${text.text}")`
}

function genNode(node, state) {
    if (node.type === 1) {
        return genElement(node, state)
    }else{
        return genText(node)
    }
}

function genChildren(el){
    const children = el.children;
    if(children.length){
        return `[${children.map(child=>genNode(child)).join(",")}]`
    }
}

function genElement(el){
    //最终返回的字符串
    let code;
    let tag = `'${el.tag}'`; 
    let children = genChildren(el);

    code = `_c(${tag}${
        children ? `,${children}`:''
    })` 
    return code;
}