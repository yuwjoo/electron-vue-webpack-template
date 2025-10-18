import { namedHookWithTaskFn, PluginBase } from "@electron-forge/plugin-base";
import type { ForgeMultiHookMap } from "@electron-forge/shared-types";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";

export interface VueDevtoolsPluginConfig {
  port?: number; // Vue Devtools 监听的端口
}

const devtoolsPath: string = path.join(
  __dirname,
  "..",
  "..",
  "node_modules",
  "@vue",
  "devtools",
  "cli.mjs"
);

export default class VueDevtoolsPlugin extends PluginBase<VueDevtoolsPluginConfig> {
  name = "vue-devtools";

  private devtoolsProcess: ChildProcessWithoutNullStreams | null = null; // 用于存储 Vue Devtools 进程
  private port: number | undefined; // vue devtools监听端口

  constructor(config: VueDevtoolsPluginConfig = {}) {
    super(config);
    this.port = config.port;
  }

  getHooks(): ForgeMultiHookMap {
    return {
      preStart: [
        namedHookWithTaskFn<"preStart">(async (task) => {
          return task?.newListr([
            {
              title: "vue devtools process starting...",
              task: async () => {
                this.startVueDevtools();
              },
            },
          ]);
        }, "start vue devtools process"),
      ],
      postStart: async (_config, child) => {
        if (this.devtoolsProcess === null) {
          this.startVueDevtools();
        }

        child.on("exit", () => {
          if (child.restarted) return;
          this.devtoolsProcess?.kill();
        });
      },
    };
  }

  /**
   * 启动vue开发者工具窗口
   */
  startVueDevtools(): void {
    this.devtoolsProcess = spawn("node", [devtoolsPath], {
      env: {
        PORT: this.port + "", // 覆盖PORT变量
      },
    });
    this.devtoolsProcess.on("exit", () => {
      this.devtoolsProcess = null;
    });
  }
}
