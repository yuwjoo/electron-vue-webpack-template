import { app, BrowserWindow } from "electron";
import { getMainSessionPartition } from "./mainSession";

export const mainWebHost = "0.0.0.0:8888"; // 主渲染页面Host

let mainWindow: BrowserWindow | null = null; // 主窗口对象

/**
 * 创建主窗口
 */
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    titleBarStyle: "hidden", // 原生标题栏
    titleBarOverlay: {
      color: "#fff",
      height: 35,
    }, // 原生标题栏控制器样式
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: true, // 安全网络 (禁止跨域)
      devTools: process.env.NODE_ENV === "development", // 是否启用 DevTools
      partition: getMainSessionPartition(),
    },
  });

  mainWindow.loadURL(
    `https://${mainWebHost}/${process.env.FRAME_WINDOW_NAME}/index.html?target=https://${mainWebHost}/`
  );

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

/**
 * 获取主窗口
 * @returns 主窗口对象
 */
export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

/**
 * 初始化主窗口
 */
export function initMainWindow(): void {
  app.on("ready", () => {
    createMainWindow();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}
