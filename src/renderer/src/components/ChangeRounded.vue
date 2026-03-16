<script setup lang="ts">
import { InnerShadowUp } from '@icon-park/vue-next'
import { useConfigStore } from '@renderer/stores/useConfigStore'
const { config, ASPECT_RATIO_MAP } = useConfigStore()
const changeRounded = () => {
  config.rounded = !config.rounded
  window.api.setAspectRatio({ aspectRatio: ASPECT_RATIO_MAP[config.aspectRatioMode] })
}
</script>

<template>
  <!-- 切换圆角摄像头 -->
  <InnerShadowUp theme="outline" size="20" :stroke-width="3" class="icon" @click="changeRounded" />
</template>

<style lang="scss"></style>
