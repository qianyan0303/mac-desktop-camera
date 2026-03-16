<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { onMounted } from 'vue'

const { config, ASPECT_RATIO_MAP } = useConfigStore()

const options: Array<{ value: '1:1' | '9:16' | '16:9'; label: string }> = [
  { value: '1:1', label: '1:1' },
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' }
]

function selectAspectRatio(mode: '1:1' | '9:16' | '16:9') {
  config.aspectRatioMode = mode
  config.rounded = mode === '1:1' ? config.rounded : false
  window.api.setAspectRatio({ aspectRatio: ASPECT_RATIO_MAP[mode] })
}

onMounted(() => {
  window.api.setAspectRatio({ aspectRatio: ASPECT_RATIO_MAP[config.aspectRatioMode] })
})
</script>

<template>
  <div class="nodrag flex items-center gap-1">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="px-2 py-0.5 text-xs rounded transition-opacity min-w-[36px]"
      :class="
        config.aspectRatioMode === opt.value
          ? 'bg-white/30 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/20'
      "
      @click="selectAspectRatio(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
