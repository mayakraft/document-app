import { ElectronAPI } from "@electron-toolkit/preload";
import type { WindowAPI } from "../preload/api.ts";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WindowAPI;
  }
}

