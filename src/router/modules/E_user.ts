import Layout from "@/layouts/index.vue";

/**
 * @author baoyuhao
 * @date 2023/8/3 22:07:09
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/user",
        name: "user",
        component: Layout,
        redirect: "/user/userInfo",
        meta: {title: "用户", icon: "user-circle"},
        children: [
            {
                path: "userInfo",
                name: "userInfo",
                component: () => import("@/pages/user/userInfo/index.vue"),
                meta: {title: "用户信息", rolePermission: ["superadmin", "teacher"]}
            }
        ]
    }
];