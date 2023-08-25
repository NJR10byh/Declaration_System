

/**
 * 用户状态(0禁用，1启用)
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
 * 根据用户状态返回Tag主题
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