import dotenvx from "@dotenvx/dotenvx";
import path from "path";
import fs from "fs";

const defaultEnvPath = path.join(__dirname, "..", "..", ".env");
const currentEnvPath = path.join(
  __dirname,
  "..",
  "..",
  `.env.${process.env.NODE_ENV}`
);

let envConfig: dotenvx.DotenvParseOutput | null = null;

/**
 * 配置环境变量
 */
export function configEnv(): void {
  dotenvx.config({ path: defaultEnvPath });
  dotenvx.config({ path: currentEnvPath });
}

/**
 * 获取环境变量
 * @return 环境配置对象
 */
export function getEnv(): dotenvx.DotenvParseOutput {
  if (envConfig === null) {
    const defaultEnv = dotenvx.parse(fs.readFileSync(defaultEnvPath));
    const currentEnv = dotenvx.parse(fs.readFileSync(currentEnvPath));

    envConfig = { ...defaultEnv, ...currentEnv };
  }

  return envConfig;
}
