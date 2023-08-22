/**
 * @author baoyuhao
 * @date 2023/4/3 1:12:28
 * @description
 * @version 0.1.0
 */

/**
 * 报单状态(0已报单，1待审核，2待返款，3已返款，4已作废)
 * @param status
 */
export const chargeStatus = (status: number) => {
    switch (status) {
        case 0:
            return "已报单";
        case 1:
            return "待审核";
        case 2:
            return "待返款";
        case 3:
            return "已返款";
        case 4:
            return "已作废";
    }
};

/**
 * 根据报单状态返回Tag主题
 * @param status
 */
export const chargeStatusTagTheme = (status: string) => {
    switch (status) {
        case "已报单":
            return "success";
        case "待审核":
            return "warning";
        case "待返款":
            return "warning";
        case "已返款":
            return "success";
        case "已作废":
            return "danger";
    }
};