<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col"
    style="background-color: var(--app-bg); color: var(--app-fg);"
  >
    <header
      class="h-12 flex items-center px-4 shrink-0"
      style="background-color: var(--card-bg); border-bottom: 1px solid var(--border);"
    >
      <div class="text-sm font-semibold">Dear Agent Panel</div>
    </header>

    <div class="flex flex-1 min-h-0">
      <aside
        class="w-64 flex-shrink-0 overflow-hidden"
        style="background-color: var(--card-bg); border-right: 1px solid var(--border);"
      >
        <nav class="p-2 space-y-1">
          <RouterLink
            to="/"
            class="block rounded px-3 py-2 text-sm hover:bg-black/5"
            style="color: var(--app-fg);"
          >
            主页
          </RouterLink>
        </nav>
      </aside>

      <main class="flex-1 overflow-hidden min-w-0">
        <div class="h-full overflow-auto p-4">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>

