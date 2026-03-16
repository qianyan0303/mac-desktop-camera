<script setup lang="ts">
import Footer from '@renderer/components/Footer.vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { onMounted, onUnmounted } from 'vue'
import Camera from './views/Camera.vue'
import Setting from './views/Setting.vue'
// import Secret from './views/Secret.vue'

const { config } = useConfigStore()
config.page = 'camera'

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    window.api.quit()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const WHEEL_STEP = 30
const MIN_SIZE = 150
const MAX_SIZE = 960

async function onWheel(e: WheelEvent) {
  if (config.page !== 'camera') return
  e.preventDefault()
  const { width, height } = await window.api.getWindowSize()
  const ratio = config.aspectRatioMode === '1:1' ? 1 : config.aspectRatioMode === '9:16' ? 9 / 16 : 16 / 9
  const currentSize = config.aspectRatioMode === '9:16' ? height : width
  const delta = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP
  const newSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, currentSize + delta))
  config.windowWidth = newSize
  window.api.setWindowSize(newSize, ratio)
}
</script>

<template>
  <Suspense>
    <main class="relative" @wheel.prevent="onWheel">
      <Camera v-if="config.page == 'camera'" />
      <Setting v-if="config.page == 'setting'" />
      <!-- 菜单图标 -->
      <Footer />
      <!-- 编译苹果 mas 时不使用该组件 -->
      <!-- <Secret /> -->
    </main>
  </Suspense>
</template>
