import config from "../config";

export function initGlobalAPI(Vue){
    const configDef = {};
    configDef.get = () => config;

    if (__DEV__) {
        configDef.set = () => {
          warn(
            '不要替换Vue.配置对象，而是设置单独的字段'
          )
        }
    }

    Object.defineProperty(Vue,'config',configDef);

    Vue.options = Object.create(null)

    Vue.options._base = Vue;
    Vue.options.test1 = "我是Vue.options上定义的test1属性";
}