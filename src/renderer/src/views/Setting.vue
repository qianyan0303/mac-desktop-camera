<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'
import packageJson from '../../../../package.json'

const { config } = useConfigStore()
const cameras = ref<MediaDeviceInfo[]>([])
const loading = ref(true)

// 必须先请求摄像头权限，enumerateDevices 才能返回设备名称（否则 label 为空）
async function loadCameras() {
  loading.value = true
  try {
    // 先获取临时视频流以触发权限请求，这样 enumerateDevices 才能返回带 label 的设备列表
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach((track) => track.stop())
  } catch {
    // 用户拒绝权限时继续，此时 label 可能为空
  }
  const devices = await navigator.mediaDevices.enumerateDevices()
  cameras.value = devices.filter((d) => d.kind === 'videoinput')
  loading.value = false
}

onMounted(() => {
  loadCameras()
})
</script>

<template>
  <main class="bg-[#2c3e50] h-screen w-screen z-50 drag">
    <section class="p-5">
      <h2 class="text-center text-gray-100 opacity-80 text-sm font-mono">参数设置</h2>
      <div class="w-full">
        <h3>选择摄像头</h3>
        <el-select
          v-model="config.deviceId"
          placeholder="选择摄像头"
          clearable
          filterable
          class="w-full"
          :loading="loading"
        >
          <el-option
            v-for="(device, index) in cameras"
            :key="device.deviceId"
            :label="device.label || `摄像头 ${index + 1}`"
            :value="device.deviceId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <h3>边框宽度</h3>
          <el-input v-model="config.borderWidth" type="number" :min="0"></el-input>
        </div>
        <div>
          <h3>圆角尺寸</h3>
          <el-input v-model="config.borderRadius" type="number" :min="0"></el-input>
        </div>
      </div>
      <h3>边框颜色</h3>
      <el-input
        v-model="config.borderColor"
        placeholder="请输入CSS边框颜色，如#f1c40f"
        clearable
      ></el-input>
      <section
        class="flex flex-col items-center justify-center text-gray-100 font-light mt-2 text-xs nodrag"
      >
        <div class="text-orange-300 mb-2">
          向军大叔作品
          <a
            href="https://www.houdunren.com/live"
            target="_blank"
            class="text-yellow-500 font-bold hover:text-orange-300"
            >晚八点直播</a
          >
        </div>
        <span class="font-light opacity-70 mb-1">微信: houdunren2021</span>
        <span class="font-light opacity-70 text-xs text-gray-300">
          版本号: {{ packageJson.version }}
        </span>
      </section>
    </section>
  </main>
</template>

<style lang="scss" scoped>
h3 {
  @apply text-white opacity-80 text-xs my-3;
}
</style>
