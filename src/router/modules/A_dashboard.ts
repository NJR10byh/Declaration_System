import Layout from "@/layouts/index.vue";

/**
 * @author baoyuhao
 * @date 2023/8/3 20:41:06
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/dashboard",
        name: "dashboard",
        component: Layout,
        redirect: "/dashboard/mainInfo",
        meta: {title: "首页", icon: "dashboard"},
        children: [
            {
                path: "mainInfo",
                name: "mainInfo",
                component: () => import("@/pages/dashboard/base/index.vue"),
                meta: {title: "概览", rolePermission: ["root", "superadmin"]}
            }
        ]
    }
];