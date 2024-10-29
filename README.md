🔥从零手写vue2 - 初始化渲染

# 一、$mount方法

上节我们知道在执行` new Vue `时，在内部会初始化一些我们需要的变量等。

通常我们会调用 `new Vue(options).$mount` 将 vnode渲染到页面上。 

该方法定义在`platforms/web/runtime/index.js`文件中：

```js
Vue.prototype.$mount = function (
    el
) {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el)
}
```

## 1.1 query

该方法可以获取虚拟 DOM的真实挂载点。

1. 当 el 是一个字符串时，使用 querySelector 来获取相应元素。如果未找到匹配的元素，会返回一个新的`<div>`元素作为默认值。并且在开发模式下（`__DEV__`）,会输出一条警告信息。
2. 当 el 不是一个字符串，直接返回。通常这个参数是一个真实 DOM元素。

```js
export function query(el) {
    if (typeof el === 'string') {
      const selected = document.querySelector(el)
      if (!selected) {
        __DEV__ && warn('找不到节点: ' + el)
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
}
```

# 二、mountComponent方法

`$mount`方法实际上就是调用了 `mountComponent` 方法。

该方法定义在`core/instance/lifecycle.js`文件中。

```js
export function mountComponent(vm,el){
    // 将挂载的真实节点放到 vm.$el中
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
    return vm;
}
```

## 2.1 判断是否有 render方法

在 `new Vue()`时，内部会进行初始化，然后进行选项合并，在合并时，会将 render函数挂载到 vm.$options上。

如果没有 render 函数，会赋值一个创建空 vnode 的函数。

```js
// 创建一个空的虚拟节点
export const createEmptyVNode = (text="")=>{
    const node = new VNode({});
    node.text = text;
    node.isComment = true;
    return node;
}
```
并且在开发阶段根据是否有 template 提示相应的报错。

## 2.2 updateComponent

1. 如果开启了性能选项，除了执行 `vm._update(vm._render())`。其次记录 render阶段（生成虚拟 DOM） 和 update阶段（渲染页面）的时间。
2. 如果没有开启性能选项，直接执行`vm._update(vm._render())`。

```js
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
```

# 三、_render方法

上面我们知道 vue 中通过_render方法来获取需要渲染的虚拟节点。

_render方法定义在 renderMixin方法中，在 vue加载时执行。

```js
export function renderMixin(Vue){
    Vue.prototype._render = function () {
        const vm = this
        const { render } = vm.$options
        let vnode = render.call(vm, vm.$createElement)
        return vnode;
    }
}
```

可以看到就是获取到 vm.render 并执行，其中第一个参数是`vm.$createElement`。

我们知道在runtime-only版本的项目中，编写的 vue文件会被解析成为一个对象，其中模板部分会解析成为一个 render函数挂载到实例上。

例如：

```js
// App.vue
<template>
  <div>你好</div>
</template>

// 其实引入的就是一个 js
import App from "./App.vue"
new Vue(App)  

new Vue({
  ...,
  render:(c)=>c('div','你好')
})
// 上面这 2 种写法意义一样
```

因为我们实现的是带编译器的版本，所以没有 render选项。

所以在带编译器的文件入口重写了vm.$mount 。

重写的目的就是为了将 template转化成 render函数。

```js
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
```

这里的`compileToFunctions`函数就是之前在编译那节学过得编译函数，这个函数可以将字符串编译成对应的生成虚拟 DOM的创建函数。

我们来看看下面这个例子被编译成了什么。

```js
const vm = new Vue({ 
    template:`<div>Hello World</div>`
}).$mount("#app");  
// template会被编译成render函数
(function anonymous(
) {
with(this){return _c('div',[_v("Hello World")])}
})
```

我们知道该函数被 `with(this)`包裹，所以这里的`_c、_v`表示为`this._c、this._v`。

而这里的this指的是 vue实例。

## 3.1 _c

_c其实就是之前我说到的 createElement函数。 

该方法定义在 `core/instance/render.js`文件中的initRender函数内部。

而 initRender函数 在构造函数初始化时执行。

```js
export function initRender(vm){
    vm._c = (tag, data, children) => createElement(tag, data, children)
}
```

## 3.2 _v

_v就是之前我们说的创建文本节点的函数。

该函数在 `installRenderHelper` 函数内部定义。

```js
import { createTextVNode } from "../vdom/vnode";

export function installRenderHelpers(target){ 
    target._v = createTextVNode
}
```

而 `installRenderHelper` 是在 `renderMixin` 函数中执行的。

```js
export function renderMixin(Vue){

    installRenderHelpers(Vue.prototype);

    Vue.prototype._render = function () {
        // ...
    }
}
```

# 四、_update方法

该方法在加载Vue时调用的 `lifecycleMixin` 函数中定义。

```js
export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this;
        vm.__patch__(vm.$el, vnode);
    }
}
```

可以看到调用了 `vm.__patch__`函数。

其中第一个参数是挂载的真实 DOM节点，第二个参数是需要渲染的虚拟 DOM。

# 五、`vm.__patch__`

经过上节的学习，我们知道渲染最终就是调用了 `vm.__patch__`方法。

该函数在 `platforms/web/runtime/index.js` 中定义。

```js
// 调用 createPatchFunction 生成
export const patch = createPatchFunction()
// 可知只有在 web端才会执行渲染逻辑
Vue.prototype.__patch__ = inBrowser ? patch : noop; 
```

# 六、createPatchFunction

可以看到返回的 patch函数的第一个参数是 oldVnode，第二个参数是 vnode。

因为这个函数是初次渲染和更新函数的通用函数。

```js
// 返回patch函数
export function createPatchFunction({}){
    // oldVnode代表上一次渲染的 vnode
    // vnode代表这次渲染的 vnode
    return function patch(oldVnode,vnode){
        // xxx
    }
}
```

在初次render后，在内存中会生成一个 vnode。

在更新渲染时，会再次执行 render方法，在内存中会生成一个新的 vnode。

而更新渲染需要对比新旧的 vnode。

所以第一个参数即为 oldVnode，代表上一次渲染的 vnode。

第二个vnode即为当前渲染的 vnode。

那么首次渲染时没有上一次的 vnode。

这里第一个参数传入的就是虚拟节点的挂载点。

所以你可以这么理解，挂载节点的挂载算是上一次渲染，而你将虚拟vnode挂载到挂载节点上就算是更新渲染。

## 6.1 nodeOps

既然是挂载到真实节点，那避免不了调用浏览器的一些 DOM操作的 API。

nodeOps模块内部就存在了这么一些操作 DOM的方法。

```js
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
```

## 6.2 将真实元素转化为虚拟 Vnode

因为后面的逻辑是通用逻辑，即是依据虚拟 DOM的逻辑进行编写，所以如果检测到节点为真实 DOM元素（挂载时），
就将真实 DOM元素转化为虚拟 DOM。

```js
    const isRealElement = isDef(oldVnode.nodeType)
    if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
    }
```
 
## 6.3 createElm 渲染元素

```js
createElm(
    vnode,
    parentElm,
    nodeOps.nextSibling(oldElm)
);
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

function insert(parent,elm,referenceElm){
    if(referenceElm){
        nodeOps.insertBefore(parent,elm,referenceElm)
    }else{
        nodeOps.appendChild(parent,elm)
    }
}
```
因为是首次渲染，直接将需要渲染的虚拟 DOM直接渲染到挂载节点即可。

createElm的第一个参数是 vnode。

第二个参数是挂载的父节点。

第三个参数是参考节点，通过这个参数可以知道挂载的具体位置。

## 6.4 删除旧的节点

在渲染节点成功之后，需要将旧的节点删除，对于首次渲染来说，旧的节点即为挂载点。

> 首次渲染的时候我们不是将虚拟 DOM挂载到挂载点上，而是渲染到挂载点的父节点上，和挂载点保持同级，然后我们将旧的挂载点删除，相当于是“覆盖“，最后我们的真实节点上应该是没有挂在的那个节点了。

```js
function removeNode(el) {
    const parent = nodeOps.parentNode(el)
    if (isDef(parent)) {
        nodeOps.removeChild(parent, el)
    }
} 
if (isDef(parentElm)) { 
    removeNode(oldElm)
}
```

> 实际上就是调用的removeChild API。










