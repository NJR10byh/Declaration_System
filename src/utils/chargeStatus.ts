/**
 * @author baoyuhao
 * @date 2023/8/25 14:23:47
 * @description 判断状态
 * @version 0.1.0
 */
/**
 * 报单状态(0已报单，1待审核，2待返款，3已返款，4已作废)
 * @param status
 */
export const declarationStatus = (status: number) => {
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
export const declarationTagTheme = (status: string) => {
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


/**
 * 商品状态(0禁用，1启用)
 * @param status
 */
export const goodsStatus = (status: number) => {
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
export const goodsTagTheme = (status: string) => {
    switch (status) {
        case "禁用":
            return "danger";
        case "启用":
            return "success";
    }
};

/**
 * 用户状态(0禁用，1启用)
 * @param status
 */
export const userStatus = (status: number) => {
    switch (status) {
        case 0:
            return "禁用";
        case 1:
            return "启用";
    }
}

/**
 * 根据用户状态返回Tag主题
 * @param status
 */
export const userTagTheme = (status: string) => {
    switch (status) {
        case "禁用":
            return "danger";
        case "启用":
            return "success";
    }
}