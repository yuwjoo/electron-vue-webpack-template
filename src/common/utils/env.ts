/**
 * 判断是否开发环境
 * @returns 是否开发环境
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}
