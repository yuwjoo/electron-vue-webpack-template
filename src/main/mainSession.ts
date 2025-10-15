import { app, net, session } from "electron";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs/promises";
import { mainWebHost } from "./mainWindow";

const rendererRoot = path.resolve(__dirname, "..", "renderer"); // 渲染进程根目录
const partition = "persist:main"; // 主 session partition
let ses: Electron.Session | null = null; // 主 session 对象

/**
 * 创建 main session
 */
export function createMainSession(): void {
  app.on("ready", () => {
    ses = session.fromPartition(partition);
    ses.protocol.handle("https", async (req) => {
      const { host, pathname } = new URL(req.url);

      if (host !== mainWebHost) return net.fetch(req);

      const targetPath = path.join(rendererRoot, pathname);
      const indexPath = path.join(process.env.MAIN_WINDOW_NAME, "index.html");
      const rollbackPath = path.join(rendererRoot, indexPath);

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
  });
}

/**
 * 获取 main session
 * @returns Electron.Session
 */
export function getMainSession(): Electron.Session {
  return ses;
}

/**
 * 获取 main session partition
 * @returns partition值
 */
export function getMainSessionPartition(): string {
  return partition;
}
