import { warn } from "@/my-vue2/core/util/index";

export * from './element'

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
  