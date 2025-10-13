import { app, BrowserWindow, protocol, net } from "electron";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs/promises";

const rendererDir = path.resolve(__dirname, "..", "renderer"); // 渲染进程目录
let mainWindow: BrowserWindow | null = null; // 主窗口对象

protocol.registerSchemesAsPrivileged([
  { scheme: "local", privileges: { secure: true, standard: true } },
]);

/**
 * 设置本地请求协议
 */
function setupLocalProtocol(): void {
  protocol.handle("local", async (req) => {
    const { host, pathname } = new URL(req.url);
    if (host === "renderer") {
      const targetPath = path.join(rendererDir, pathname);
      const mainHTMLPath = path.join(
        rendererDir,
        `${process.env.MAIN_WINDOW_NAME}/index.html`
      );

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
    }
  });
}

/**
 * 创建主窗口
 */
function createMainWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.loadURL(`local://renderer/`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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
    setupLocalProtocol();
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
