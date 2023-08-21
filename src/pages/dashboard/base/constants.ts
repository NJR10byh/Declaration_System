import {TdBaseTableProps} from 'tdesign-vue-next';

interface DashboardPanel {
    title: string;
    number: string | number;
    leftType: string;
    upTrend?: string;
    downTrend?: string;
}

interface TendItem {
    growUp?: number;
    productName: string;
    count: number;
}

export const BASE_URL = {
    todayStat: "/home/todayStat",
    weekStat: "/home/weekStat",
    reportRank: "/home/reportRank"
};

export const SALE_COLUMNS: TdBaseTableProps['columns'] = [
    {
        align: 'center',
        colKey: 'index',
        title: '排名',
        width: 80,
        fixed: 'left',
    },
    {
        align: 'left',
        ellipsis: true,
        colKey: 'commodityName',
        title: '商品名称',
        width: 170,
    },
    {
        align: 'center',
        colKey: 'reportCount',
        title: '数量',
        width: 80,
    }
];
