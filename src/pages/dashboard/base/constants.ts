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
    todayStat: "/home/todayStat"
};

export const SALE_TEND_LIST: Array<TendItem> = [
    {
        growUp: 1,
        productName: '国家电网有限公司',
        count: 7059
    },
    {
        growUp: -1,
        productName: '深圳燃气集团股份有限公司',
        count: 6437
    },
    {
        growUp: 4,
        productName: '国家烟草专卖局',
        count: 4221
    },
    {
        growUp: 3,
        productName: '中国电信集团有限公司',
        count: 3317
    },
    {
        growUp: -3,
        productName: '中国移动通信集团有限公司',
        count: 3015
    },
    {
        growUp: -3,
        productName: '新余市办公用户采购项目',
        count: 2015
    },
];

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
        colKey: 'productName',
        title: '商品名称',
        width: 170,
    },
    {
        align: 'center',
        colKey: 'count',
        title: '数量',
        width: 80,
    }
];
