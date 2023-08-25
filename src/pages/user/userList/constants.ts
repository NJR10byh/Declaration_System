/**
 * @author baoyuhao
 * @date 2023/8/8 11:13:28
 * @description
 * @version 0.1.0
 */
export const BASE_URL = {
    userList: "/user/list"
};

export const USER_LIST_TABLE_COLUMNS = [
    // { colKey: "row-select", type: "multiple", width: 10, fixed: "left" },
    {
        title: "序号",
        align: "center",
        colKey: "index",
        width: 80
    },
    {
        title: "手机号码",
        align: "center",
        colKey: "phone",
        width: 80,
        ellipsis: true
    },
    {
        title: "姓名",
        align: "center",
        colKey: "name",
        width: 80,
        ellipsis: true
    },
    {
        title: "开户行",
        align: "center",
        colKey: "bankName",
        width: 80,
        ellipsis: true
    },
    {
        title: "银行卡号",
        align: "center",
        colKey: "bankCard",
        width: 150,
        ellipsis: true
    },
    {
        title: "支付宝收款码",
        align: "center",
        colKey: "aliPayCode",
        width: 100
    },
    {
        title: "微信收款码",
        align: "center",
        colKey: "weChatCode",
        width: 100
    },
    {
        title: "状态",
        align: "center",
        colKey: "status",
        width: 80,
        ellipsis: true
    },
    {
        title: "注册时间",
        align: "center",
        colKey: "registerTime",
        width: 120,
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