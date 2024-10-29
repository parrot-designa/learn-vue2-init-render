 
import { parse } from "./parse";
import { generate } from "./codegen/index";

export const createCompiler = () => {
    return {
        compileToFunctions:(template)=>{
            // 1.生成AST
            const ast = parse(template.trim());
          
            // 2.AST生成 render
            const { render } = generate(ast); 

            return {
                render
            }
        }
    }
}


 