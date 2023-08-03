import Layout from "@/layouts/index.vue";

/**
 * @author baoyuhao
 * @date 2023/8/3 21:47:24
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/rebate",
        name: "rebate",
        component: Layout,
        redirect: "/rebate/waitRebate",
        meta: {title: "返款", icon: "money-circle"},
        children: [
            {
                path: "waitRebate",
                name: "waitRebate",
                component: () => import("@/pages/rebate/waitRebate/index.vue"),
                meta: {title: "待返款", rolePermission: ["root", "superadmin"]}
            },
            {
                path: "rebated",
                name: "rebated",
                component: () => import("@/pages/rebate/rebated/index.vue"),
                meta: {title: "已返款", rolePermission: ["root", "superadmin"]}
            }
        ]
    }
];