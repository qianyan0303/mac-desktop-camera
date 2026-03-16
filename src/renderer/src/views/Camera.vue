<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { onMounted } from 'vue'

const { config } = useConfigStore()

function togglePrivacy() {
  config.isPrivacyMode = !config.isPrivacyMode
}

async function getVideoConstraints(): Promise<MediaStreamConstraints> {
  let deviceId = config.deviceId

  // 当未指定设备时，优先选择 Mac 内置摄像头，避免默认使用 iPhone（Continuity Camera）
  if (!deviceId) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((t) => t.stop())
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === 'videoinput')
      // 优先选择内置摄像头（FaceTime、Built-in），排除 iPhone
      const builtIn = videoDevices.find(
        (d) =>
          /FaceTime|Built-in|内置/i.test(d.label) && !/iPhone|iphone/i.test(d.label)
      )
      const nonIphone = videoDevices.find((d) => !/iPhone|iphone/i.test(d.label))
      deviceId = builtIn?.deviceId || nonIphone?.deviceId || videoDevices[0]?.deviceId
    } catch {
      // 权限被拒绝时使用默认
    }
  }

  return {
    audio: false,
    video: deviceId
      ? { deviceId: { ideal: deviceId }, width: 1920, height: 1080 }
      : { width: 1920, height: 1080 }
  }
}

onMounted(async () => {
  const video = document.querySelector('video')! as HTMLVideoElement
  config.videoElement = video
  const constraints = await getVideoConstraints()
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream
  })
})
</script>
<template>
  <main
    class="w-screen h-screen overflow-hidden relative z-0 flex flex-col"
    :class="{
      'aspect-square': config.aspectRatioMode === '1:1',
      'aspect-video': config.aspectRatioMode === '16:9',
      'aspect-[9/16]': config.aspectRatioMode === '9:16'
    }"
    :style="`border:solid ${config.borderWidth}px ${config.borderColor};border-radius:${
      config.rounded ? '50%' : config.borderRadius + 'px'
    }`"
  >
    <!-- 顶部拖拽条 -->
    <div
      class="drag h-6 flex-shrink-0"
      :style="{
        borderTopLeftRadius: config.rounded ? '9999px' : config.borderRadius + 'px',
        borderTopRightRadius: config.rounded ? '9999px' : config.borderRadius + 'px'
      }"
    />
    <!-- 画面区域：点击切换隐私模式 -->
    <div
      class="nodrag flex-1 relative cursor-pointer overflow-hidden"
      @click="togglePrivacy"
    >
      <div
        v-if="!config.isPrivacyMode"
        class="border-4 border-transparent absolute inset-0 bg-slate-700 text-white font-light text-base flex flex-col justify-center items-center z-0"
      >
        摄像头加载中...
        <div class="text-xs opacity-90">如果长时间不加载，在软件配置中切换摄像头</div>
      </div>
      <video
        class="object-cover absolute inset-0 w-full h-full z-10"
        :class="{
          'aspect-square': config.aspectRatioMode === '1:1',
          'aspect-video': config.aspectRatioMode === '16:9',
          'aspect-[9/16]': config.aspectRatioMode === '9:16'
        }"
        :style="{
          transform: config.flip ? `rotateY(180deg)` : '',
          height: config.rounded && config.aspectRatioMode === '1:1' ? '100%' : ''
        }"
        autoplay
      ></video>
      <!-- 隐私模式：毛玻璃遮罩 -->
      <div
        v-if="config.isPrivacyMode"
        class="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto"
        :style="{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }"
      >
        <span class="text-white/80 text-sm font-light">(・_・)</span>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
