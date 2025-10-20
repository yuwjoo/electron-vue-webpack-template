import { GET_STORE, SET_STORE } from "@/common/constants/ipc";
import { contextBridge, ipcRenderer } from "electron";

const store = {
  get: (key: string) => {
    ipcRenderer.send(GET_STORE, key);
  },
  set: (key: string, value: any) => {
    ipcRenderer.send(SET_STORE, key, value);
  },
};

contextBridge.exposeInMainWorld("electronApi", {
  store,
});
