import { unicodeRegExp } from "@/my-vue2/core/util/lang";
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)


// 解析模板
export function parseHTML(html,options){
    while(html){
        const textEnd = html.indexOf('<');
        // 说明匹配到 <  可能是开始标签（<）或者闭合标签（</）
        if(textEnd === 0){
            // 解析结束标签
            // 假设这里html是</span></div>
            // endTagMatch 为["</span>","span"]
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                options.end(endTagMatch[1]);
                continue
            } 

            // 解析开始标签
            const startTagMatch = parseStartTag()
            if(startTagMatch){  
                options.start(startTagMatch);
                continue
            }
        }
        // text表示文本 rest表示截取文本后的属于字符串 
        let text
        // 第一位不是标签 表明非元素 即为文本
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
        }
        if (options.chars && text) {
            options.chars(text)
        }
    }

    function advance(n){
        html = html.substring(n)
    }

    function parseStartTag(){
        // 如果html为<div> 则 start[0]为<div start[1]为 tag
        const start = html.match(startTagOpen);
        // 将匹配的标签名存在 match中
        const match = {
            tagName:start[1],
            attrs: [],
        }
        // 将解析过后的 html删除
        advance(start[0].length);
        // 匹配的结束标签
        let end;
        // 匹配的属性
        let attr;
        // 匹配属性
        // 如果没有匹配到结束标签 && 匹配到属性 继续遍历
        // 反之，如果匹配到结束标签 || 不能匹配到属性 则结束遍历
        while(
            !(end = html.match(startTagClose)) && 
            (attr = html.match(dynamicArgAttribute) || html.match(attribute))
        ){
            advance(attr[0].length);
            match.attrs.push(attr);
        }
        if(end){
            advance(end[0].length)
            return match;
        }
    }

    function parseEndTag(tagName) {
    }
}