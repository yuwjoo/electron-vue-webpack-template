import { contextBridge } from "electron";
import { electronApi } from "./preload/electronApi";

contextBridge.exposeInMainWorld("electronApi", electronApi);
