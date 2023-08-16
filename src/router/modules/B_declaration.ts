import Layout from "@/layouts/index.vue";

/**
 * @author baoyuhao
 * @date 2023/8/3 20:32:36
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/declaration",
        name: "declaration",
        component: Layout,
        redirect: "/declaration/all",
        meta: {title: "报单", icon: "file-1"},
        children: [
            {
                path: "all",
                name: "allDeclarations",
                component: () => import("@/pages/declaration/all/index.vue"),
                meta: {title: "全部", rolePermission: ["root", "superadmin"]}
            },
            {
                path: "declarated",
                name: "declarated",
                component: () => import("@/pages/declaration/declarated/index.vue"),
                meta: {title: "已报单", rolePermission: ["root", "superadmin"]}
            },
            {
                path: "waitApproval",
                name: "waitApprovalDeclarations",
                component: () => import("@/pages/declaration/waitApproval/index.vue"),
                meta: {title: "待审核", rolePermission: ["root", "superadmin"]}
            }
        ]
    }
];