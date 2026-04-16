import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import PanelLayout from "../layouts/PanelLayout.vue";
import Home from "../pages/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: PanelLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

