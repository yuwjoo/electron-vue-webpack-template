import { app, BrowserWindow, protocol, net } from "electron";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs/promises";

const rendererDir = path.resolve(__dirname, "..", "renderer"); // 渲染进程目录
let mainWindow: BrowserWindow | null = null; // 主窗口对象

protocol.registerSchemesAsPrivileged([
  { scheme: "renderer", privileges: { secure: true, standard: true } },
]);

/**
 * 设置渲染进程请求协议
 */
function setupRendererProtocol(): void {
  protocol.handle("renderer", async (req) => {
    const { host, pathname } = new URL(req.url);
    const targetPath = path.join(rendererDir, pathname);
    const mainHTMLPath = path.join(rendererDir, `${host}/index.html`);

    try {
      const stat = await fs.stat(targetPath);
      if (stat.isFile()) {
        return net.fetch(pathToFileURL(targetPath).toString());
      } else {
        return net.fetch(pathToFileURL(mainHTMLPath).toString());
      }
    } catch {
      return net.fetch(pathToFileURL(mainHTMLPath).toString());
    }
  });
}

/**
 * 创建主窗口
 */
function createMainWindow(): void {
  // Create the browser window.
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
    },
  });

  if (process.env.NODE_ENV === "development") {
    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`renderer://${process.env.MAIN_WINDOW_NAME}/`);
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
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    setupRendererProtocol();
    createMainWindow();
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}
