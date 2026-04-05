# mac-desktop-camera 项目分析文档

> 📷 基于 Electron + Vue3 的桌面摄像头软件
> 生成时间：2026-04-05

---

## 1. 项目概述

### 1.1 项目简介

这是一个功能完善的**桌面摄像头软件**，主要用于直播、录课、短视频拍摄等场景。项目 fork 自 [houdunwang/camera](https://github.com/houdunwang/camera)（向军大叔作品），并进行了本地化定制。

### 1.2 核心特性

- ✅ 支持摄像头切换
- ✅ 摄像头窗口置顶显示
- ✅ 配置边框宽度与颜色
- ✅ 支持圆角与横屏显示
- ✅ 窗口大小拖动调节
- ✅ 画面镜像翻转
- ✅ 全屏模式
- ✅ 隐私模式（关闭摄像头）
- ✅ 滚轮缩放窗口大小
- ✅ Windows、Mac、Linux 多系统支持

---

## 2. 技术栈

### 2.1 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Electron | ^25.0.1 | 桌面应用框架 |
| electron-vite | ^1.0.23 | 现代化 Electron 构建工具 |
| Vue 3 | ^3.3.4 | 前端框架 |
| Vite | ^4.3.9 | 前端构建工具 |
| TypeScript | ^5.1.3 | 类型系统 |
| Pinia | ^2.1.3 | 状态管理 |
| TailwindCSS | ^3.3.2 | CSS 框架 |

### 2.2 辅助库

| 库名 | 版本 | 用途 |
|------|------|------|
| @icon-park/vue-next | ^1.4.2 | 图标库 |
| element-plus | ^2.3.6 | UI 组件库 |
| axios | ^1.4.0 | HTTP 请求 |
| electron-updater | ^5.3.0 | 自动更新 |
| pinia-plugin-persistedstate | ^3.1.0 | Pinia 持久化 |
| @electron-toolkit/preload | ^2.0.0 | Electron 工具包 |

### 2.3 开发依赖

| 库名 | 版本 | 用途 |
|------|------|------|
| eslint | ^8.42.0 | 代码检查 |
| prettier | ^2.8.8 | 代码格式化 |
| vue-tsc | ^2.2.0 | Vue TypeScript 检查 |
| electron-builder | ^23.6.0 | 应用打包 |
| @vitejs/plugin-vue | ^4.2.3 | Vue 插件 |

---

## 3. 项目架构

### 3.1 目录结构

```
mac-desktop-camera/
│
├── src/                          # 源代码目录
│   ├── main/                     # Electron 主进程
│   │   ├── index.ts             # 入口，创建主窗口
│   │   ├── ipcMain.ts           # IPC 通信处理（axios token）
│   │   ├── menu.ts              # 菜单栏配置
│   │   ├── tray.ts              # 系统托盘图标
│   │   ├── windowManage.ts      # 窗口管理（拖拽、尺寸）
│   │   ├── contextMenu.ts       # 右键菜单
│   │   └── autoUpdater.ts       # 自动更新逻辑
│   │
│   ├── preload/                  # 预加载脚本（安全桥接层）
│   │   ├── index.ts             # API 暴露到渲染进程
│   │   └── index.d.ts           # 类型声明
│   │
│   └── renderer/                 # Vue 渲染进程
│       ├── public/              # 静态资源
│       ├── index.html           # HTML 入口
│       └── src/
│           ├── App.vue          # 根组件
│           ├── main.ts          # Vue 入口
│           ├── env.d.ts         # 环境类型声明
│           ├── axios.ts         # axios 配置
│           │
│           ├── views/           # 页面组件
│           │   ├── Camera.vue        # 摄像头主界面 ⭐
│           │   ├── Setting.vue       # 设置页面
│           │   ├── Secret.vue        # 隐藏页面（已禁用）
│           │   └── UpdaterV1.vue     # 更新页面
│           │
│           ├── components/      # UI 组件
│           │   ├── Footer.vue                    # 底部菜单
│           │   ├── AspectRatioSelector.vue       # 画面比例选择器
│           │   ├── ChangeFlipHorizontally.vue    # 镜像翻转
│           │   ├── ChangeRounded.vue             # 圆角调整
│           │   ├── DropdownMenu.vue              # 下拉菜单
│           │   ├── FullScreen.vue                # 全屏切换
│           │   └── PrivacyToggle.vue             # 隐私模式
│           │
│           ├── stores/          # Pinia 状态管理
│           │   └── useConfigStore.ts    # 摄像头配置状态 ⭐
│           │
│           ├── composables/     # 组合式函数
│           │   └── useCamera.ts
│           │
│           └── assets/          # 样式资源
│               └── css/
│                   ├── global.css
│                   ├── global.scss
│                   ├── icon.css
│                   └── tailwind.css
│
├── build/                        # 构建配置
│   ├── entitlements.mac.plist    # Mac 普通应用权限
│   ├── entitlements.mas.plist    # Mac App Store 权限
│   ├── entitlements.mas.inherit.plist
│   ├── icon.icns                 # Mac 应用图标
│   ├── icon.png                  # 应用图标 PNG
│   └── notarize.js               # Mac 应用签名脚本
│
├── resources/                    # 应用资源
│   ├── icon.png                  # 主图标
│   ├── iconTemplate.png          # 模板图标
│   ├── iconTemplate@2x.png       # 模板图标 2x
│   ├── trayTemplate@2x.png       # 托盘图标
│   └── windowTray.png            # 窗口托盘图标
│
├── .vscode/                       # VS Code 配置
│   ├── launch.json              # 调试配置
│   ├── settings.json            # 编辑器配置
│   └── extensions.json          # 推荐插件
│
├── electron.vite.config.ts       # electron-vite 配置 ⭐
├── electron-builder.yml          # 普通打包配置
├── electron-builder-mas.yml     # App Store 打包配置
├── package.json                  # 项目配置 ⭐
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.js            # TailwindCSS 配置
├── postcss.config.js             # PostCSS 配置
├── .eslintrc.cjs                 # ESLint 配置
├── .prettierrc.yaml              # Prettier 配置
└── .npmrc                        # npm 镜像配置

```

---

## 4. 核心模块详解

### 4.1 主进程 (src/main/)

主进程是 Electron 应用的核心，负责：
- 创建和管理窗口
- 处理系统级事件
- 管理托盘图标和菜单
- IPC 通信处理

#### 4.1.1 窗口创建 (index.ts)

**文件位置**: `src/main/index.ts`

**窗口配置特点**:

```typescript
{
  width: 720,
  height: 405,
  minHeight: 84,
  minWidth: 84,
  alwaysOnTop: true,      // ⭐ 窗口置顶
  show: false,
  autoHideMenuBar: true,
  skipTaskbar: true,      // ⭐ 隐藏任务栏
  frame: false,           // ⭐ 无边框窗口
  hasShadow: false,
  transparent: true,      // ⭐ 透明背景
  webPreferences: {
    preload: '../preload/index.js',
    sandbox: false
  }
}
```

**窗口特性**:
- 无边框透明窗口
- 置顶显示在所有应用之上
- 支持设置宽高比（16:9, 9:16, 1:1）
- 最小尺寸限制为 84x84

#### 4.1.2 IPC 通信 (ipcMain.ts)

**文件位置**: `src/main/ipcMain.ts`

**主要功能**:

1. **退出应用**
   ```typescript
   ipcMain.on('quit', ...)
   ```

2. **Token 验证**
   ```typescript
   ipcMain.handle('axios', async () => {
     // 调用 houdunren.test/api 获取授权
     const http = axios.create({
       baseURL: 'http://houdunren.test/api',
       timeout: 10000
     })
     return await http.request({
       url: 'softToken/camera',
       method: 'POST',
       data: { secret: '15047f4e116484ff6e84a6e47a4874b1' }
     })
   })
   ```

#### 4.1.3 托盘管理 (tray.ts)

**文件位置**: `src/main/tray.ts`

**功能**:
- 创建系统托盘图标
- 设置右键菜单（退出程序、问题反馈）
- 设置工具提示文本

```typescript
const contextMenu = Menu.buildFromTemplate([
  { label: '退出程序', role: 'quit' },
  { type: 'separator' },
  { label: '问题反馈', click: () => shell.openExternal('https://www.houdunren.com') }
])
```

---

### 4.2 预加载脚本 (src/preload/)

预加载脚本是主进程和渲染进程之间的安全桥接层。

**文件位置**: `src/preload/index.ts`

**暴露的 API**:

| API | 说明 |
|-----|------|
| `quit()` | 退出应用 |
| `downloadProgress(callback)` | 下载进度回调 |
| `setAspectRatio(opt)` | 设置画面比例 |
| `contextMenu()` | 显示右键菜单 |
| `toggleFullscreen()` | 切换全屏 |
| `getWindowSize()` | 获取窗口尺寸 |
| `setWindowSize(size, ratio)` | 设置窗口尺寸 |
| `startWindowDrag(x, y)` | 开始拖拽 |
| `updateWindowDrag(x, y)` | 更新拖拽位置 |
| `endWindowDrag()` | 结束拖拽 |
| `openNewCamera()` | 打开新窗口 |
| `axios()` | 获取 token |

---

### 4.3 渲染进程 (src/renderer/)

#### 4.3.1 根组件 (App.vue)

**文件位置**: `src/renderer/src/App.vue`

**功能**:
- 路由切换（Camera / Setting 页面）
- 全局键盘事件监听（ESC 退出）
- 滚轮缩放窗口大小

**滚轮缩放逻辑**:
```typescript
const WHEEL_STEP = 30
const MIN_SIZE = 150
const MAX_SIZE = 960

async function onWheel(e: WheelEvent) {
  const { width, height } = await window.api.getWindowSize()
  const ratio = config.aspectRatioMode === '1:1' ? 1 
    : config.aspectRatioMode === '9:16' ? 9/16 : 16/9
  const currentSize = config.aspectRatioMode === '9:16' ? height : width
  const delta = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP
  const newSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, currentSize + delta))
  config.windowWidth = newSize
  window.api.setWindowSize(newSize, ratio)
}
```

#### 4.3.2 摄像头主界面 (Camera.vue)

**文件位置**: `src/renderer/src/views/Camera.vue`

**核心功能**:

1. **摄像头初始化**
   ```typescript
   async function getVideoConstraints(): Promise<MediaStreamConstraints> {
     // 优先选择 Mac 内置摄像头
     // 排除 iPhone (Continuity Camera)
     const builtIn = videoDevices.find(
       (d) => /FaceTime|Built-in|内置/i.test(d.label) 
         && !/iPhone|iphone/i.test(d.label)
     )
     return {
       audio: false,
       video: deviceId
         ? { deviceId: { ideal: deviceId }, width: 1920, height: 1080 }
         : { width: 1920, height: 1080 }
     }
   }
   ```

2. **长按拖拽窗口**
   ```typescript
   const LONG_PRESS_MS = 300
   
   function onPointerDown(e: PointerEvent) {
     pressTimer = setTimeout(() => {
       isDragging.value = true
       window.api.startWindowDrag(lastPos.value.x, lastPos.value.y)
     }, LONG_PRESS_MS)
   }
   ```

3. **短按切换隐私模式**
   ```typescript
   function togglePrivacy() {
     config.isPrivacyMode = !config.isPrivacyMode
   }
   ```

4. **隐私模式 UI**
   - 毛玻璃效果
   - 摄像头图标

#### 4.3.3 状态管理 (useConfigStore.ts)

**文件位置**: `src/renderer/src/stores/useConfigStore.ts`

**配置项**:

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `borderColor` | string | 边框颜色 | `#f39c12` |
| `borderWidth` | number | 边框宽度 | `0` |
| `borderRadius` | number | 圆角 | `10` |
| `deviceId` | string | 摄像头设备 ID | `''` |
| `page` | string | 当前页面 | `'camera'` |
| `rounded` | boolean | 圆形摄像头 | `false` |
| `aspectRatioMode` | `'1:1' \| '9:16' \| '16:9'` | 画面比例 | `'16:9'` |
| `windowWidth` | number | 窗口宽度 | `720` |
| `flip` | boolean | 镜像翻转 | `false` |
| `isPrivacyMode` | boolean | 隐私模式 | `false` |
| `token` | object | 授权信息 | `{ uid: '', secret: '' }` |

**持久化配置**:
```typescript
{
  persist: {
    afterRestore: (ctx) => {
      // 迁移旧配置：aspectRatio -> aspectRatioMode
    }
  }
}
```

**计算属性**:
```typescript
const aspectRatio = computed(() => ASPECT_RATIO_MAP[config.value.aspectRatioMode])
// ASPECT_RATIO_MAP = { '1:1': 1, '9:16': 9/16, '16:9': 16/9 }
```

---

## 5. 组件详解

### 5.1 底部菜单 (Footer.vue)

底部固定菜单栏，包含：
- 摄像头切换（DropdownMenu）
- 画面比例选择（AspectRatioSelector）
- 圆角调整（ChangeRounded）
- 镜像翻转（ChangeFlipHorizontally）
- 全屏（FullScreen）
- 设置（跳转到 Setting 页面）

### 5.2 画面比例选择器 (AspectRatioSelector.vue)

支持三种比例：
- 1:1 (正方形)
- 9:16 (竖屏)
- 16:9 (横屏)

点击切换，实时更新窗口比例。

### 5.3 隐私模式 (PrivacyToggle.vue)

- 开启后显示毛玻璃遮罩
- 保护用户隐私
- 短按切换

---

## 6. 构建与部署

### 6.1 环境要求

| 依赖 | 版本要求 |
|------|----------|
| Node.js | 18+ |
| pnpm | 8+ |

### 6.2 安装依赖

```bash
pnpm install
```

### 6.3 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发模式（热重载） |
| `pnpm start` | 预览打包后的应用 |
| `pnpm build` | 类型检查 + 构建 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查并修复 |
| `pnpm format` | Prettier 格式化 |

### 6.4 打包命令

| 命令 | 说明 | 平台 |
|------|------|------|
| `pnpm build:mac` | Mac 包 | Intel |
| `pnpm build:mac-arm` | Mac ARM64 | Apple Silicon |
| `pnpm build:mac-mas` | Mac App Store | App Store |
| `pnpm build:win` | Windows 安装包 | Windows |
| `pnpm build:linux` | Linux 包 | Linux |

### 6.5 构建产物

打包产物位于 `dist/` 目录：
- `dist/mac/` - Mac 应用
- `dist/win-unpacked/` - Windows 便携版
- `dist/linux-unpacked/` - Linux 便携版

---

## 7. 配置说明

### 7.1 electron-vite 配置

**文件位置**: `electron.vite.config.ts`

```typescript
{
  main: {
    plugins: [externalizeDepsPlugin()]  // 外部化 node_modules
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': 'src/renderer/src'  // 路径别名
      }
    },
    plugins: [vue()],                    // Vue 插件
    server: {
      port: 5187                         // 开发服务器端口
    }
  }
}
```

### 7.2 electron-builder 配置

**文件位置**: `electron-builder.yml`

配置文件定义了：
- 应用元数据（名称、版本、作者）
- 打包格式（dmg, pkg, zip, nsis 等）
- Mac 相关配置（签名、权限）
- 图标路径

### 7.3 npm 镜像配置

**文件位置**: `.npmrc`

```properties
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
```

---

## 8. 开发指南

### 8.1 添加新组件

1. 在 `src/renderer/src/components/` 创建组件文件
2. 在需要的页面中导入使用
3. 如果需要配置项，更新 `useConfigStore.ts`

**示例**:

```typescript
// src/renderer/src/components/MyComponent.vue
<template>
  <div>{{ title }}</div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
```

### 8.2 添加新配置项

1. 在 `useConfigStore.ts` 的 `config` 对象中添加
2. 在需要的地方使用 `useConfigStore()` 访问

**示例**:

```typescript
// useConfigStore.ts
const config = ref({
  // ... 现有配置
  myNewOption: 'default value'
})

// 其他组件中
const { config } = useConfigStore()
console.log(config.myNewOption)
```

### 8.3 IPC 通信

**渲染进程调用主进程**:

```typescript
// 渲染进程
window.api.someMethod()

// preload/index.ts
ipcRenderer.send('channel', data)

// main/index.ts
ipcMain.on('channel', (event, data) => {
  // 处理逻辑
})
```

### 8.4 调试技巧

1. **开发调试**: F12 打开 DevTools
2. **主进程调试**: 在 VS Code 中配置 `.vscode/launch.json`
3. **查看日志**: `pnpm dev` 终端输出

---

## 9. 常见问题

### 9.1 IDE 终端运行失败

如果在 Cursor、VS Code 等 IDE 终端中 `pnpm dev` 报错：

```bash
ELECTRON_RUN_AS_NODE= pnpm dev
```

或直接使用系统终端。

### 9.2 摄像头权限

Mac 上需要授权摄像头权限，首次使用会弹出系统授权窗口。

### 9.3 App Store 打包

Mac App Store 版本需要额外的权限配置，见 `build/entitlements.mas.plist`。

---

## 10. 项目亮点

1. ✅ **现代化架构**
   - electron-vite + Vue3 + TypeScript
   - Pinia 状态管理
   - TailwindCSS 样式

2. ✅ **优秀的用户体验**
   - 无边框透明窗口
   - 置顶显示
   - 丰富的交互（拖拽、缩放、快捷键）

3. ✅ **跨平台支持**
   - Windows、Mac、Linux
   - Intel 和 ARM 架构

4. ✅ **配置持久化**
   - 用户偏好自动保存
   - 配置迁移机制

5. ✅ **自动更新**
   - 集成 electron-updater
   - 静默更新

6. ✅ **代码质量**
   - TypeScript 类型安全
   - ESLint + Prettier 规范
   - 组件化设计

---

## 11. 下一步

如果你想继续开发，可以：

1. **运行项目**: `pnpm install && pnpm dev`
2. **查看组件**: `src/renderer/src/components/`
3. **理解状态**: `src/renderer/src/stores/useConfigStore.ts`
4. **调试主进程**: `src/main/`

---

*文档由 AI 自动生成，如有问题请提交 Issue。*
