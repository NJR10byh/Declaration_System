/**
 * @author baoyuhao
 * @date 2023/8/3 21:44:31
 * @description
 * @version 0.1.0
 */
export const BASE_URL = {
    listSettle: "/payback/listSettle",
    getSettleDetail: "/payback/getSettleDetail",
};

export const REBATED_TABLE_COLUMNS = [
    // { colKey: "row-select", type: "multiple", width: 10, fixed: "left" },
    {
        title: "序号",
        align: "center",
        colKey: "index",
        width: 50
    },
    {
        title: "用户名称",
        align: "center",
        colKey: "userName",
        width: 100,
        ellipsis: true
    },
    {
        title: "结算金额",
        align: "center",
        colKey: "payAmount",
        width: 80,
        ellipsis: true
    },
    {
        title: "结算人",
        align: "center",
        colKey: "payUser",
        width: 100,
        ellipsis: true
    },
    {
        title: "结算时间",
        align: "center",
        colKey: "payTime",
        width: 120,
        ellipsis: true
    },
    {
        title: "操作",
        align: "left",
        colKey: "settings",
        fixed: "right",
        width: 80
    }
];

export const REBATED_DETAIL_TABLE_COLUMNS = [
    {
        title: "序号",
        align: "center",
        colKey: "index",
        width: 50
    },
    {
        title: "订单号",
        align: "center",
        colKey: "orderId",
        width: 80,
        ellipsis: true
    },
    {
        title: "商品",
        align: "left",
        colKey: "commodity",
        width: 150,
        ellipsis: true
    },
    {
        title: "实付金额",
        align: "center",
        colKey: "payAmount",
        width: 80,
        ellipsis: true
    },
    {
        title: "应返款金额",
        align: "center",
        colKey: "shouldPayback",
        width: 80,
        ellipsis: true
    },
    {
        title: "备注",
        align: "left",
        colKey: "notes",
        width: 100,
        ellipsis: true
    },
    {
        title: "审核备注",
        align: "left",
        colKey: "examineNotes",
        width: 100,
        ellipsis: true
    },
];