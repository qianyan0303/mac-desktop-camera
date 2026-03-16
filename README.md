# 桌面摄像头

> forked from houdunwang/camera 向军大叔 [抖音](https://www.douyin.com/user/MS4wLjABAAAAz0TXiTnI3HAmxDEfBrHItlViAwC6rsxJL6_GIHFA2Ho) 和 [bilibili](https://space.bilibili.com/282190994) 

基于 Electron + Vue3 + Vite 开发的桌面摄像头软件，方便直播录课、短视频拍摄等场景。

## 功能特点

- 支持摄像头切换
- 摄像头窗口置顶
- 配置边框宽度与颜色
- 支持圆角与横屏显示
- **窗口大小拖动调节**（底部菜单滑块）
- 画面镜像、全屏
- Windows、Mac、Linux 多系统支持

## 软件下载
https://wwaoz.lanzoum.com/ie8qW3ks828f

## 开发指引

### 环境要求

| 依赖 | 版本 |
|------|------|
| Node.js | 18+ |
| pnpm | 8+ |

### 项目结构

```
src/
├── main/           # Electron 主进程
│   ├── index.ts    # 入口
│   ├── ipcMain.ts  # IPC 通信
│   ├── windowManage.ts
│   └── ...
├── preload/        # 预加载脚本
│   └── index.ts
└── renderer/       # Vue 渲染进程
    └── src/
        ├── views/      # 页面
        ├── components/ # 组件
        └── stores/     # Pinia 状态
```

### 启动命令

```bash
# 安装依赖（首次需执行）
pnpm install

# 开发模式（热重载，Vite 开发服务器 + Electron）
pnpm dev

# 预览模式（运行打包后的应用，需先 build）
pnpm start
```

### 开发相关命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发模式，支持热重载 |
| `pnpm start` | 预览打包后的应用 |
| `pnpm build` | 类型检查 + 构建（仅编译，不打包） |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查并自动修复 |
| `pnpm format` | Prettier 格式化代码 |

### 构建打包命令

| 命令 | 说明 |
|------|------|
| `pnpm build:mac` | Mac 包（当前架构） |
| `pnpm build:mac-arm` | Mac ARM64（Apple Silicon） |
| `pnpm build:mac-mas` | Mac App Store 发布包 |
| `pnpm build:win` | Windows 安装包 |
| `pnpm build:linux` | Linux 包（AppImage / snap / deb） |

构建产物位于 `dist/` 目录。

### 开发配置

- **Electron 镜像**：项目已配置 `.npmrc` 使用 npmmirror 镜像
- **IDE 终端**：若在 Cursor、VS Code 等 IDE 终端中 `pnpm dev` 报错，可改用系统终端，或执行 `ELECTRON_RUN_AS_NODE= pnpm dev`

### 图标

应用图标使用 `resources/icon.png`，建议尺寸 512×512 或 1024×1024。Mac 打包需要 `.icns` 格式，若 electron-builder 无法自动从 PNG 生成，可手动生成：

```bash
mkdir icon.iconset
sips -z 16 16 resources/icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 resources/icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 resources/icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 resources/icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 resources/icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 resources/icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 resources/icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 resources/icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 resources/icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 resources/icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset -o build/icon.icns
rm -rf icon.iconset
```

生成后将 `electron-builder.yml` 和 `electron-builder-mas.yml` 中的 `icon` 改为 `build/icon.icns`。

### 常见问题

- **编译失败**：检查 electron / electron-builder 镜像配置，参考 [后盾人文档库 - Electron](https://doc.houdunren.com/%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B/electron/1%20%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.html)
- **Electron 未安装**：项目已配置 `pnpm.onlyBuiltDependencies`，首次 `pnpm install` 会自动下载 Electron 二进制

