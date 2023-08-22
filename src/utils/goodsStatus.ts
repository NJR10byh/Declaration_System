/**
 * @author baoyuhao
 * @date 2023/8/22 17:16:16
 * @description
 * @version 0.1.0
 */

/**
 * 商品状态(0禁用，1启用)
 * @param status
 */
export const chargeStatus = (status: number) => {
    switch (status) {
        case 0:
            return "禁用";
        case 1:
            return "启用";
    }
};

/**
 * 根据商品状态返回Tag主题
 * @param status
 */
export const chargeStatusTagTheme = (status: string) => {
    switch (status) {
        case "禁用":
            return "danger";
        case "启用":
            return "success";
    }
};