/**
 * @author baoyuhao
 * @date 2023/8/3 22:17:32
 * @description
 * @version 0.1.0
 */
export const BASE_URL = {
    commodityList: "/commodity/list",
    editDetail: "/commodity/editDetail"
};

export const GOODS_INFO_TABLE_COLUMNS = [
    // { colKey: "row-select", type: "multiple", width: 10, fixed: "left" },
    {
        title: "序号",
        align: "center",
        colKey: "index",
        width: 80
    },
    {
        title: "商品名称",
        align: "left",
        colKey: "commodity",
        width: 160,
        ellipsis: true
    },
    {
        title: "剩余额度",
        align: "center",
        colKey: "remainAmount",
        width: 80,
        ellipsis: true
    },
    {
        title: "总金额",
        align: "center",
        colKey: "totalAmount",
        width: 80,
        ellipsis: true
    },
    {
        title: "预计返款金额",
        align: "center",
        colKey: "expectPayback",
        width: 80,
        ellipsis: true
    },
    {
        title: "创建时间",
        align: "center",
        colKey: "buildTime",
        width: 120,
        ellipsis: true
    },
    {
        title: "截止时间",
        align: "center",
        colKey: "endTime",
        width: 120,
        ellipsis: true
    },
    {
        title: "状态",
        align: "center",
        colKey: "status",
        width: 80,
        ellipsis: true
    },
    {
        title: "操作",
        align: "left",
        colKey: "settings",
        fixed: "right",
        width: 200
    }
];