import { app, BrowserWindow, net, session } from "electron";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs/promises";

const rendererHost = "0.0.0.0:8888"; // 渲染进程访问Host
const rendererDir = path.resolve(__dirname, "..", "renderer"); // 渲染进程目录

const partition = "persist:main";

let mainWindow: BrowserWindow | null = null; // 主窗口对象

/**
 * 创建自定义 session
 */
function createSession(): void {
  const ses = session.fromPartition(partition);

  ses.protocol.handle("https", async (req) => {
    const { host, pathname } = new URL(req.url);

    if (host !== rendererHost) return net.fetch(req);

    const targetPath = path.join(rendererDir, pathname);
    const indexPath = path.join(process.env.MAIN_WINDOW_NAME, "index.html");
    const rollbackPath = path.join(rendererDir, indexPath);

    let fetchUrl = "";
    try {
      if ((await fs.stat(targetPath)).isFile()) {
        fetchUrl = pathToFileURL(targetPath).toString();
      } else {
        fetchUrl = pathToFileURL(rollbackPath).toString();
      }
    } catch {
      fetchUrl = pathToFileURL(rollbackPath).toString();
    }

    return net.fetch(fetchUrl);
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
      partition,
    },
  });

  mainWindow.loadURL(
    `https://${rendererHost}/${process.env.FRAME_WINDOW_NAME}/index.html?target=https://${rendererHost}/`
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
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    createSession();
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
