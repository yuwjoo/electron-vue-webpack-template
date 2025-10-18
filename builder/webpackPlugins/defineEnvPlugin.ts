import { Compiler, DefinePlugin } from "webpack";

export interface DefineEnvPluginOptions {
  vars: Record<string, any>; // 变量数据
  prefix?: string; // 变量前缀, 默认 "process.env."
}

export default class DefineEnvPlugin {
  private vars: Record<string, any>;
  private prefix: string;

  constructor(options: DefineEnvPluginOptions) {
    this.vars = options.vars;
    this.prefix = options.prefix || "process.env.";
  }

  apply(compiler: Compiler): void {
    const data: Record<string, any> = {};

    for (let [key, value] of Object.entries(this.vars)) {
      data[this.prefix + key] = JSON.stringify(value);
    }

    new DefinePlugin(data).apply(compiler);
  }
}
