import { app } from "electron";
import { initMainWindow } from "./mainWindow";
import { createMainSession } from "./mainSession";
import { initDatabase } from "./database";
import { initStore } from "@/main/store";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

initStore(); // 初始化store
initDatabase(); // 初始化数据库
createMainSession(); // 创建主session
initMainWindow(); // 初始化主窗口

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
