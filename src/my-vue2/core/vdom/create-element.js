import VNode from "./vnode"
import { isArray,isPrimitive } from "../util/index";

export function createElement(
    tag,
    data,
    children
){
    // 如果 data是数组或者是原始值
    // 则交换 children和 data的位置
    // 体现了vue的灵活性
    if (isArray(data) || isPrimitive(data)) {
        children = data
        data = undefined
    }
    return new VNode({
        tag,
        data,
        children
    })
}