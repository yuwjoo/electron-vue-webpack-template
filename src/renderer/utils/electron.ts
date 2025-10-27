import type { ElectronApi } from "../preload/type";

/**
 * 是否electron环境
 * @returns electron环境
 */
export function isElectronEnv(): boolean {
  return !!window.electronApi;
}

/**
 * 使用electronApi
 * @returns electropApi对象
 */
export function useElectronApi(): ElectronApi {
  return window.electronApi;
}
