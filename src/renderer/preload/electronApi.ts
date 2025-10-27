import { GET_STORE, SET_STORE } from "@/common/constants/ipc";
import { ipcRenderer } from "electron";

const store = {
  get: (key: string) => {
    return ipcRenderer.invoke(GET_STORE, key);
  },
  set: (key: string, value: any) => {
    return ipcRenderer.invoke(SET_STORE, key, value);
  },
};

export const electronApi = {
  store,
};
