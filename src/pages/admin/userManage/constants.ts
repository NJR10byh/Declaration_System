/**
 * @author baoyuhao
 * @date 2023/4/24 14:16:06
 * @description
 * @version 0.1.0
 */
export const BASE_URL = {};

export const USER_MANAGE_TABLE_COLUMNS = [
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
        title: "创建人",
        align: "center",
        colKey: "creatUser",
        width: 120,
        ellipsis: true
    },
    {
        title: "创建时间",
        align: "center",
        colKey: "creatTime",
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
        width: 80
    }
];