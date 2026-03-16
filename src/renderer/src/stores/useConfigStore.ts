import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const ASPECT_RATIO_MAP = { '1:1': 1, '9:16': 9 / 16, '16:9': 16 / 9 } as const

export const useConfigStore = defineStore(
  'camera',
  () => {
    const config = ref({
      //边框颜色
      borderColor: '#f39c12',
      //边框宽度
      borderWidth: 0,
      //摄像头设备ID
      deviceId: '',
      page: 'camera',
      //边框圆角
      borderRadius: 10,
      //圆型摄像头（仅 1:1 时有效）
      rounded: false,
      //窗口比例: '1:1' | '9:16' | '16:9'
      aspectRatioMode: '16:9' as '1:1' | '9:16' | '16:9',
      // 窗口宽度（用于滑块）
      windowWidth: 720,
      //视频标签元素
      videoElement: null as null | HTMLVideoElement,
      //镜像
      flip: false,
      // 隐私模式：关闭摄像头，显示毛玻璃
      isPrivacyMode: false,
      token: {
        uid: '',
        secret: ''
      }
    })

    const updateConfig = () => {}
    const aspectRatio = computed(() => ASPECT_RATIO_MAP[config.value.aspectRatioMode])

    return { config, updateConfig, aspectRatio, ASPECT_RATIO_MAP }
  },
  {
    persist: {
      afterRestore: (ctx) => {
        // 迁移旧配置：aspectRatio -> aspectRatioMode
        const store = ctx.store as unknown as { config: Record<string, unknown> }
        const c = store?.config
        if (c && !c.aspectRatioMode && c.aspectRatio !== undefined) {
          const ar = c.aspectRatio as number
          c.aspectRatioMode = ar === 1 ? '1:1' : ar > 1 ? '16:9' : '9:16'
        }
      }
    }
  }
)
