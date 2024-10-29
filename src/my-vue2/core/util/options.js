import { unicodeRegExp } from './lang'
import { isBuiltInTag, isFunction, isArray,camelize,isPlainObject,toRawType,hasOwn } from '@/my-vue2/shared/util';
import { warn } from './debug'
import config from "../config"

// 默认的策略
const defaultStrat = function (parentVal, childVal){
    return childVal === undefined ? parentVal : childVal
}

// 引用 config配置 支持用户自定义
let strats = config.optionMergeStrategies;

if (__DEV__) {
    strats.el = strats.propsData = function (
      parent,
      child,
      vm,
      key
    ) {
      if (!vm) {
        warn(
          `选项“${key}”只能在实例期间使用 使用new关键字创建。`
        )
      }
      return defaultStrat(parent, child)
    }
}

// 合并父级和子级的 options
export function mergeOptions(
    parent,
    child,
    vm
) {
    return {
        ...parent,
        ...child
    }
    if (__DEV__) {
        // 校验组件名的正确性
        checkComponents(child)
    }
    // 当 child是一个组件构造函数时
    if (isFunction(child)) {
        child = child.options
    }
    // 规范化处理props
    normalizeProps(child,vm); 
    // 规范化inject
    normalizeInject(child, vm);
    // 规范化 directives
    normalizeDirectives(child);
    // 处理 extends 和 mixins
    // 合并的真正逻辑
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}


// 校验options.components组件选项
function checkComponents(options) {
    for (const key in options.components) {
        validateComponentName(key);
    }
}

export function validateComponentName(name) {
    if (
        !new RegExp(`^[a-zA-Z][\\-checkComponents\\.0-9_${unicodeRegExp.source}]*$`).test(name)
    ) {
        warn(
            `组件名称无效：${name} 。组件名称应该符合html5规范中的有效自定义元素名称。`
        )
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
        warn(
            `不要使用内置的或保留的HTML元素作为组件。id: ${name}`
        )
    }
}


function normalizeProps(options, vm) {
    const props = options.props;
    if (!props) return
    const res = {};
    let i, val, name
    if (isArray(props)) {
        i = props.length;
        while (i--) {
            val = props[i]
            if (typeof val === 'string') {
                name = camelize(val)
                res[name] = { type: null }
            } else if (__DEV__) {
                warn('当使用数组语法时，道具必须是字符串。')
            }
        }
    }else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key]
            name = camelize(key)
            res[name] = isPlainObject(val) ? val : { type: val }
        }
    }else if (__DEV__) {
        warn(
          `props属性应该传入数组类型或者对象类型，但是现在的类型为${toRawType(props)}.`, 
        )
    }
    options.props = res
}

function normalizeInject(options, vm) {
    const inject = options.inject
    if (!inject) return
    const normalized = (options.inject = {})
    if (isArray(inject)) {
      for (let i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] }
      }
    } else if (isPlainObject(inject)) {
      for (const key in inject) {
        const val = inject[key]
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val }
      }
    } else if (__DEV__) {
      warn(
        `inject属性应该传入数组类型或者对象类型，但是现在的类型为` +
          `但是现在为${toRawType(inject)}.`
      )
    }
}
  

/**
 * 规范化自定义指令
 */
function normalizeDirectives(options) {
    const dirs = options.directives
    if (dirs) {
      for (const key in dirs) {
        const def = dirs[key]
        if (isFunction(def)) {
          dirs[key] = { bind: def, update: def }
        }
      }
    }
}