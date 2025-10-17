import { namedHookWithTaskFn, PluginBase } from "@electron-forge/plugin-base";
import type { ForgeMultiHookMap } from "@electron-forge/shared-types";
import { ChildProcess, spawn } from "child_process";

export default class VueDevtoolsPlugin extends PluginBase<void> {
  name = "vue-devtools";

  private devtoolsProcess: ChildProcess | null = null;

  getHooks(): ForgeMultiHookMap {
    return {
      preStart: [
        namedHookWithTaskFn<"preStart">(async (task) => {
          return task?.newListr([
            {
              title: "vue devtools starting...",
              task: async () => {
                console.log("执行 vue devtools...");
                process.env.PORT = "8090"; // 修改或新增PORT变量
                spawn("node", [
                  "C:\\selfProject\\my-home-desktop\\node_modules\\@vue\\devtools-electron\\dist\\cli.mjs",
                ]);
                // await import("@vue/devtools-electron/cli");
                // this.devtoolsProcess = spawn(
                //   "cross-env",
                //   ["PORT=8090", "vue-devtools"],
                //   { stdio: "inherit" }
                // );
                // await this.compileMain(true, logger);
              },
              //   rendererOptions: {
              //     timer: { ...PRESET_TIMER },
              //   },
            },
          ]);
        }, "start vue devtools"),
      ],
      postStart: async (_config, child) => {
        child.on("exit", () => {
          if (child.restarted) return;
          console.log("退出 vue-devtools");
          this.devtoolsProcess?.kill();
        });
      },
    };
  }
}
