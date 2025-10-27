import Store from "electron-store";
import type { StoreType } from "./type";
import { ipcMain } from "electron";
import { GET_STORE, SET_STORE } from "@/common/constants/ipc";

let store: Store<StoreType>;

/**
 * 初始化store
 */
export function initStore(): void {
  store = new Store<StoreType>({
    defaults: {},
  });

  ipcMain.handle(SET_STORE, (_event, key, value) => {
    store.set(key, value);
  });

  ipcMain.handle(GET_STORE, (_event, key) => {
    return store.get(key);
  });
}

/**
 * 获取store
 * @returns store对象
 */
export function getStore(): Store<StoreType> {
  return store;
}
