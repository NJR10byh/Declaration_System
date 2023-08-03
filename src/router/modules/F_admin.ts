import Layout from "@/layouts/index.vue";

/**
 * @author baoyuhao
 * @date 2023/8/3 22:07:33
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/admin",
        name: "admin",
        component: Layout,
        redirect: "/user/userInfo",
        meta: {title: "管理员", icon: "desktop"},
        children: [
            {
                path: "userManage",
                name: "userManage",
                component: () => import("@/pages/admin/userManage/index.vue"),
                meta: {title: "人员管理", rolePermission: ["superadmin", "teacher"]}
            }
        ]
    }
];