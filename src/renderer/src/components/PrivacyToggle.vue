<script setup lang="ts">
import { Lock, Unlock } from '@icon-park/vue-next'
import { useConfigStore } from '@renderer/stores/useConfigStore'

const { config } = useConfigStore()

function toggle() {
  config.isPrivacyMode = !config.isPrivacyMode
}
</script>

<template>
  <component
    :is="config.isPrivacyMode ? Lock : Unlock"
    theme="outline"
    size="20"
    :stroke-width="3"
    class="icon"
    @click="toggle"
  />
</template>
