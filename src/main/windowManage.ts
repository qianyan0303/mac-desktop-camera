import { BrowserWindow, ipcMain } from 'electron'

const MIN_SIZE = 150
const MAX_SIZE = 960

// 获取窗口尺寸
ipcMain.handle('getWindowSize', (event: Electron.IpcMainInvokeEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender)!
  const { width, height } = win.getBounds()
  return { width, height }
})

// 设置窗口尺寸（保持比例）
// size: 主维度（16:9 为宽，9:16 为高，1:1 为边长）
ipcMain.on(
  'setWindowSize',
  (event: Electron.IpcMainEvent, size: number, aspectRatio: number) => {
    if (aspectRatio <= 0) return
    const win = BrowserWindow.fromWebContents(event.sender)!
    const clamped = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size))
    let width: number
    let height: number
    if (aspectRatio >= 1) {
      // 16:9 或 1:1，主维度为宽
      width = clamped
      height = Math.round(width / aspectRatio)
    } else {
      // 9:16，主维度为高
      height = clamped
      width = Math.round(height * aspectRatio)
    }
    win.setBounds({ width, height })
  }
)

// 设置窗口比例（1:1, 9:16, 16:9），aspectRatio 为 0 时清除比例约束（如全屏）
ipcMain.on(
  'setAspectRatio',
  (event: Electron.IpcMainEvent, opt: { aspectRatio: number }) => {
    const win = BrowserWindow.fromWebContents(event.sender)!
    win.setAspectRatio(opt.aspectRatio)
    if (opt.aspectRatio > 0) {
      const { width, height } = win.getBounds()
      const clamped = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.max(width, height)))
      let newWidth: number
      let newHeight: number
      if (opt.aspectRatio >= 1) {
        newWidth = clamped
        newHeight = Math.round(newWidth / opt.aspectRatio)
      } else {
        newHeight = clamped
        newWidth = Math.round(newHeight * opt.aspectRatio)
      }
      win.setBounds({ width: newWidth, height: newHeight })
    }
  }
)

//全屏切换
ipcMain.on('toggleFullscreen', (event: Electron.IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender)!
  win.setFullScreen(!win.isFullScreen())
  const { width, height } = win.getBounds()
  win.setAspectRatio(width >= height ? 16 / 9 : 9 / 16)
})
