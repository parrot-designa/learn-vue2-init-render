import { noop } from "./util"

export default {
    performance: false,
    // 默认为空
    isReservedTag: noop,
    // option合并策略
    optionMergeStrategies: Object.create(null)
}