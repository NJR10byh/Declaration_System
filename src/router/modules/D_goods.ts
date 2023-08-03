import Layout from "@/layouts/index.vue";

/**
 * @author baoyuhao
 * @date 2023/8/3 22:02:04
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/goods",
        name: "goods",
        component: Layout,
        redirect: "/goods/goodsInfo",
        meta: {title: "商品", icon: "shop"},
        children: [
            {
                path: "goodsInfo",
                name: "goodsInfo",
                component: () => import("@/pages/goods/index.vue"),
                meta: {title: "商品信息", rolePermission: ["superadmin", "teacher"]}
            }
        ]
    }
];