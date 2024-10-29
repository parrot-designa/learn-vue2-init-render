
import { parseHTML } from "./html-parser";

export function createASTElement(
    tag,
    attrs
){
    return {
        type:1,
        tag,
        attrList:attrs, 
        children:[]
    }
}

export function parse(template){

    let rootAst;
    const stack = [];
    
    parseHTML(template,{
        start:(startMatch)=>{
            // 当开始元素解析完毕 需要创建一个新的元素 ast节点
            const element = createASTElement(startMatch.tagName, startMatch.attrs)
            // 如果没有根节点 设置根节点
            if(!rootAst){
                rootAst = element
            }
            // 将当前元素推入栈中
            stack.push(element);
        },
        end:(tagName)=>{
            // 如果栈顶元素和当前元素相同
            if(stack[stack.length-1].tag === tagName){
                // 弹出栈顶元素
                const currentElement = stack.pop();
                if(stack.length === 0){
                    rootAst = currentElement;
                }else{
                    // 当前栈顶元素是弹出元素的父元素
                    let currentParent = stack[stack.length-1];
                    currentParent.children = currentParent.children || [];
                    currentParent.children.push(currentElement);
                } 
            }
        },
        chars:(text)=>{
            // 获取栈顶元素 即当前处理中的元素 为文字节点的父元素
            let currentParent = stack[stack.length-1];
            currentParent.children = currentParent.children || [];
            currentParent.children.push({
                type:3,
                text
            })
        },
    });  
    return rootAst;
}