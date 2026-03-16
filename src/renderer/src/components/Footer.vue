<script setup lang="ts">
import { CameraFive, Setting as SettingICon } from '@icon-park/vue-next'
import DropdownMenu from '@renderer/components/DropdownMenu.vue'
import FullScreen from '@renderer/components/FullScreen.vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { watch } from 'vue'
import AspectRatioSelector from './AspectRatioSelector.vue'
import ChangeFlipHorizontally from './ChangeFlipHorizontally.vue'
import ChangeRounded from './ChangeRounded.vue'
import PrivacyToggle from './PrivacyToggle.vue'
const { config } = useConfigStore()

// windowWidth 存储主维度（16:9/1:1 为宽，9:16 为高）
const onSizeChange = (val: number) => {
  const ratio = config.aspectRatioMode === '1:1' ? 1 : config.aspectRatioMode === '9:16' ? 9 / 16 : 16 / 9
  window.api.setWindowSize(val, ratio)
}

watch(
  () => config.windowWidth,
  (val) => onSizeChange(val),
  { immediate: false }
)

watch(
  () => [config.page, config.aspectRatioMode],
  async ([page]) => {
    if (page === 'camera') {
      const { width, height } = await window.api.getWindowSize()
      config.windowWidth = config.aspectRatioMode === '9:16' ? height : width
    }
  },
  { immediate: true }
)
</script>

<template>
  <section
    class="nodrag absolute bottom-0 z-30 group w-screen justify-center items-center gap-2 cursor-pointer flex hover:bg-pink-600 py-2"
    :class="{ 'bg-pink-600': config.page == 'setting' }"
  >
    <!-- 设置页面 -->
    <SettingICon
      v-if="!['setting', 'updater'].includes(config.page)"
      theme="outline"
      size="20"
      :stroke-width="3"
      class="icon"
      @click="config.page = 'setting'"
    />
    <!-- 摄像头页面 -->
    <CameraFive
      v-if="config.page != 'camera'"
      theme="outline"
      size="20"
      :stroke-width="3"
      class="icon"
      @click="config.page = 'camera'"
    />
    <!-- 比例选择 -->
    <div v-if="config.page == 'camera'" class="aspect-ratio-selector">
      <AspectRatioSelector />
    </div>
    <!-- 圆角切换（仅 1:1 时显示） -->
    <ChangeRounded v-if="config.page == 'camera' && config.aspectRatioMode === '1:1'" />
    <!-- 画面镜像 -->
    <ChangeFlipHorizontally v-if="config.page == 'camera'" />
    <!-- 隐私保护 -->
    <PrivacyToggle v-if="config.page == 'camera'" />
    <!-- 全屏 -->
    <FullScreen v-if="['camera'].includes(config.page)" />
    <!-- 窗口大小 -->
    <div
      v-if="config.page === 'camera'"
      class="nodrag flex items-center gap-1 min-w-[80px] px-1"
    >
      <el-slider
        v-model="config.windowWidth"
        :min="150"
        :max="960"
        :step="30"
        size="small"
        class="window-size-slider"
      />
    </div>
    <!-- 快捷菜单 -->
    <DropdownMenu />
    <!-- <power theme="outline" size="20" class="icon" @click="quit" /> -->
    <!-- 打开新摄像头 -->
    <!-- <share
      v-if="config.page == 'camera'"
      theme="filled"
      size="20"
      fill="#ffffff"
      :strokeWidth="3"
      class="icon"
      @click="openNewCamera"
    /> -->
  </section>
</template>

<style lang="scss" scoped>
.icon,
:deep(.icon) {
  @apply text-white cursor-pointer opacity-0 group-hover:opacity-100;
}
.bg-pink-600 {
  .icon,
  :deep(.icon) {
    @apply opacity-100;
  }
}
.aspect-ratio-selector {
  opacity: 0;
  transition: opacity 0.2s;
}
.group:hover .aspect-ratio-selector {
  opacity: 1;
}
.bg-pink-600 .aspect-ratio-selector {
  opacity: 1;
}
.window-size-slider {
  :deep(.el-slider__runway) {
    background-color: rgba(255, 255, 255, 0.3);
  }
  :deep(.el-slider__bar) {
    background-color: #fff;
  }
  :deep(.el-slider__button) {
    border-color: #fff;
    background-color: #fff;
  }
  opacity: 0;
  transition: opacity 0.2s;
}
.group:hover .window-size-slider {
  opacity: 1;
}
.bg-pink-600 .window-size-slider {
  opacity: 1;
}
</style>
