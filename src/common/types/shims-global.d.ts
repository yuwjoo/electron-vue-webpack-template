import type { ElectronApi } from "@/renderer/preload/type";

declare global {
  interface Window {
    electronApi?: ElectronApi;
  }
}
