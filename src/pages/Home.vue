<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";

// pixi-live2d-display 内部依赖全局 PIXI
window.PIXI = PIXI;

let pixiApp: PIXI.Application | null = null;
let live2dModel: any = null;
let audioContext: AudioContext | null = null;
let mouthIntervalId: number | null = null;
let requestAnimationId: number | null = null;

const live2dCanvas = ref<HTMLCanvasElement | null>(null);

onBeforeUnmount(() => {
  if (mouthIntervalId != null) {
    window.clearInterval(mouthIntervalId);
    mouthIntervalId = null;
  }
  if (requestAnimationId != null) {
    cancelAnimationFrame(requestAnimationId);
    requestAnimationId = null;
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

  audioContext = new AudioContext();

  pixiApp = new PIXI.Application({
    view: live2dCanvas.value,
    resizeTo: live2dCanvas.value,
    backgroundAlpha: 0,
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
  void init().then(() => {
    // 默认只初始化 Live2D，不启动 analyser 逻辑，避免额外开销。
  });
});

function expressionFn() {
  live2dModel?.expression?.();
}

function mouthFn() {
  live2dModel?.expression?.(0);

  if (mouthIntervalId != null) window.clearInterval(mouthIntervalId);
  mouthIntervalId = window.setInterval(() => {
    const n = Math.random();
    live2dModel?.internalModel?.coreModel?.setParameterValueById?.("ParamMouthOpenY", n);
  }, 100);
}

async function speakFn() {
  // 目前项目里没有找到音频文件；这里避免因为 audioFile 未定义导致页面崩溃。
  const hasModel = !!live2dModel?.internalModel?.coreModel;
  const hasAudioContext = !!audioContext;
  if (!hasModel || !hasAudioContext) {
    console.warn("live2d 尚未初始化或 AudioContext 不可用");
    return;
  }
  console.warn("未配置音频文件，speakFn 已跳过（可继续补充 /assets/sounds/jp.wav 等资源）。");
}
</script>

<template>
  <div class="flex flex-col h-full min-h-[360px]">
    <div class="flex gap-2 mb-3">
      <button class="px-3 py-2 text-sm rounded bg-blue-200 hover:bg-blue-300" @click="expressionFn">
        表情切换
      </button>
      <button class="px-3 py-2 text-sm rounded bg-blue-300 hover:bg-blue-400" @click="mouthFn">
        嘴型变换
      </button>
      <button class="px-3 py-2 text-sm rounded bg-blue-500 text-white hover:brightness-110" @click="speakFn">
        人物说话
      </button>
    </div>

    <div
      class="flex-1 overflow-hidden rounded-lg border"
      style="border-color: var(--border); background-color: rgba(0,0,0,0.02);"
    >
      <canvas ref="live2dCanvas" class="w-full h-full" />
    </div>
  </div>
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

