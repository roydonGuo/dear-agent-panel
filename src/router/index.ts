import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import PanelLayout from "../layouts/PanelLayout.vue";
import Home from "../pages/Home.vue";
import Live2DStandalone from "../pages/Live2DStandalone.vue";

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
  {
    path: "/live2d",
    name: "live2d-standalone",
    component: Live2DStandalone,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

