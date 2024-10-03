import { ElectronAPI } from "@electron-toolkit/preload";
import type { WindowAPI } from "../general/types.ts";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WindowAPI;
  }
}

