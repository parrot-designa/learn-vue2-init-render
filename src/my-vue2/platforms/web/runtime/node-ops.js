// 创建节点
export function createElement(
    tagName
){
    return document.createElement(tagName);
}

// 获取节点的标签名
export function tagName(node){
    return node.tagName;
}

// 创建文本节点
export function createTextNode(text) {
    return document.createTextNode(text)
}
  
// 创建注释节点
export function createComment(text) {
    return document.createComment(text)
}

// 在parentNode节点下的reference节点前插入一个newNode
export function insertBefore(
    parentNode,
    newNode,
    referenceNode
){
    parentNode.insertBefore(newNode, referenceNode);
}

// 移除 node节点下的 child节点
export function removeChild(node, child) {
    node.removeChild(child)
}

// 在 node节点下添加child节点
export function appendChild(node, child) {
    node.appendChild(child)
}

// 获取父节点
export function parentNode(node) {
    return node.parentNode
}

// 获取下一个相邻节点
export function nextSibling(node) {
    return node.nextSibling
}
  
// 给节点设置文本内容
export function setTextContent(node, text) {
    node.textContent = text
}