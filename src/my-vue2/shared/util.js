// 判断是否是数组
export const isArray = Array.isArray
// 判断是否是原始类型
export function isPrimitive(value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
}
// 空函数 可以避免undefined错误
export function noop(a, b, c) {}

// 根据字符串创建一个快速查找映射，用于判断一个字符串是否属于预定义的一组关键字之一。
export function makeMap(
  str,
  expectsLowerCase
){
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

// 是否是内置组件
export const isBuiltInTag = makeMap('slot,component', true)

// 判断是否是函数类型
export function isFunction(value){
  return typeof value === 'function'
}

/**
 * 创建一个纯函数的缓存版本。
 */
export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

/**
 * 将“-“写法转成驼峰 my-props => myProps
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

const _toString = Object.prototype.toString
// 查看是否是一个普通对象
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
// 查看对象类型
export function toRawType(value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * 往目标对象中合并属性
 */
export function extend(
  to,
  _from
) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

// 判断一个值是否是 undefined或者 null
export function isUndef(v){
  return v === undefined || v === null;
}

// 判断一个值是否被定义
export function isDef(v) {
  return v !== undefined && v !== null
}