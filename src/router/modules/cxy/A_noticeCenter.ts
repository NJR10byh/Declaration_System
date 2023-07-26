/**
 * @author baoyuhao
 * @date 2023/3/20 0:01:46
 * @description
 * @version 0.1.0
 */

import Layout from "@/layouts/index.vue";

export default [
  {
    path: "/noticeCenter",
    name: "noticeCenter_cxy",
    component: Layout,
    meta: { title: "通知中心", icon: "notification" },
    children: [
      {
        path: "cxy",
        name: "notice_cxy",
        component: () => import("@/pages/cxy/noticeCenter/index.vue"),
        meta: { title: "通知中心", rolePermission: ["root", "superadmin", "admin"] }
      }
    ]
  }
];