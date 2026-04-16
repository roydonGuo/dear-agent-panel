/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    // pixi-live2d-display 运行时会用到全局 PIXI
    PIXI: any;
  }

  // Cursor/IDE 在少数情况下会把 `.vue` 模板当作 JSX 来做类型诊断，
  // 这会导致缺少 JSX.IntrinsicElements 的报错。这里做一个宽松声明避免误报。
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
