<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";

// pixi-live2d-display 内部依赖全局 PIXI
window.PIXI = PIXI;

let pixiApp: PIXI.Application | null = null;
let live2dModel: any = null;
let audioContext: AudioContext | null = null;
let mouthIntervalId: number | null = null;

const live2dCanvas = ref<HTMLCanvasElement | null>(null);

onBeforeUnmount(() => {
  if (mouthIntervalId != null) {
    window.clearInterval(mouthIntervalId);
    mouthIntervalId = null;
  }
  live2dModel?.destroy?.();
  live2dModel = null;
  pixiApp?.destroy?.();
  pixiApp = null;
  audioContext?.close?.();
  audioContext = null;
});

const init = async () => {
  if (!live2dCanvas.value) return;

  // 确保窗口背景为透明（避免全局样式污染）
  document.documentElement.style.backgroundColor = "transparent";
  document.body.style.backgroundColor = "transparent";

  audioContext = new AudioContext();

  pixiApp = new PIXI.Application({
    view: live2dCanvas.value,
    resizeTo: live2dCanvas.value,
    backgroundAlpha: 0,
    autoStart: true,
  });

  live2dModel = await Live2DModel.from("/live2d/Ganyu1024/Ganyu1024.model3.json", {
    autoInteract: true,
    autoUpdate: true,
  });

  live2dModel.scale.set(0.1);
  live2dModel.y = 0;
  live2dModel.x = 0;
  pixiApp.stage.addChild(live2dModel);
};

onMounted(() => {
  void init();
});

const startDrag = async (e: PointerEvent) => {
  // 仅左键拖拽
  if (e.button !== 0) return;
  try {
    e.preventDefault();
    e.stopPropagation();
    const win = getCurrentWindow();
    await win.setFocus?.();
    await win.startDragging();
  } catch {
    // no-op
  }
};

const closeSelf = async () => {
  try {
    await getCurrentWebviewWindow().close();
  } catch {
    // no-op
  }
};
</script>

<template>
  <div
    class="h-screen w-screen relative"
    style="background: transparent; cursor: move;"
    @pointerdown.capture="startDrag"
  >
    <canvas
      ref="live2dCanvas"
      class="w-full h-full"
      @pointerdown.capture="startDrag"
    />

    <button
      class="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-black/30 text-white hover:bg-black/40"
      @click="closeSelf"
      @pointerdown.stop.prevent
    >
      关闭
    </button>
  </div>
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}

:global(html),
:global(body),
:global(#app) {
  background: transparent !important;
}
</style>

