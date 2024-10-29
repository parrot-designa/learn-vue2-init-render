import * as nodeOps from "./node-ops";
import { createPatchFunction } from "@/my-vue2/core/vdom/patch";

export const patch = createPatchFunction({ nodeOps })