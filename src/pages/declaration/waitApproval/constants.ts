/**
 * @author baoyuhao
 * @date 2023/8/3 20:34:20
 * @description
 * @version 0.1.0
 */
export const BASE_URL = {};

export const WAIT_APPROVAL_TABLE_COLUMNS = [
    // { colKey: "row-select", type: "multiple", width: 10, fixed: "left" },
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
        width: 120,
        ellipsis: true
    },
    {
        title: "商品",
        align: "left",
        colKey: "goodsName",
        width: 200,
        ellipsis: true
    },
    {
        title: "报单人",
        align: "center",
        colKey: "declarationPerson",
        width: 80,
        ellipsis: true
    },
    {
        title: "微信名",
        align: "center",
        colKey: "wechatName",
        width: 80,
        ellipsis: true
    },
    {
        title: "实付金额",
        align: "center",
        colKey: "relMoney",
        width: 80,
        ellipsis: true
    },
    {
        title: "预计返款金额",
        align: "center",
        colKey: "preBackMoney",
        width: 80,
        ellipsis: true
    },
    {
        title: "实际返款金额",
        align: "center",
        colKey: "relBackMoney",
        width: 80,
        ellipsis: true
    },
    {
        title: "申请返款时间",
        align: "center",
        colKey: "backMoneyTime",
        width: 120,
        ellipsis: true
    },
    {
        title: "报单时间",
        align: "center",
        colKey: "declarateTime",
        width: 120,
        ellipsis: true
    },
    {
        title: "订单状态",
        align: "center",
        colKey: "orderStatus",
        width: 80,
        ellipsis: true
    },
    {
        title: "下单图",
        align: "center",
        colKey: "orderPic",
        width: 80
    },
    {
        title: "完成图",
        align: "center",
        colKey: "completePic",
        width: 80
    },
    {
        title: "操作",
        align: "left",
        colKey: "settings",
        fixed: "right",
        width: 200
    }
];