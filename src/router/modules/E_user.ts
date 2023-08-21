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
                path: "userList",
                name: "userList",
                component: () => import("@/pages/user/userList/index.vue"),
                meta: {title: "用户列表", rolePermission: ["superadmin", "teacher"]}
            }
        ]
    }
];