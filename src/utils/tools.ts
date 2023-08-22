import {MessagePlugin} from "tdesign-vue-next";
import {isNotEmpty} from "@/utils/validate";

/**
 * @author baoyuhao
 * @date 2023/8/22 17:28:31
 * @description
 * @version 0.1.0
 */

/**
 * 复制内容到剪贴板
 * @param info
 */
export const copyInfo = (info: string) => {
    if (isNotEmpty(info)) {
        navigator.clipboard.writeText(info);
        MessagePlugin.success("已复制");
    } else {
        MessagePlugin.error("复制值为空");
    }
};