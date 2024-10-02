import { ElectronAPI } from "@electron-toolkit/preload";
import { type FilePathInfo } from "../general/types.ts";

type DialogReturn = Promise<object>;

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      // one way, from renderer to main
      quitApp: () => void;
      setAppTitle: (title: string) => void;

      // two way, from renderer to main and back
      unsavedChangesDialog: (yesString?: string, noString?: string) => Promise<{ response: number }>;
      pathJoin: () => string;
      openFile: () => Promise<{ data?: string; fileInfo?: FilePathInfo }>;
      saveFile: (fileInfo: FilePathInfo, data: string) => Promise<boolean>;
      saveFileAs: (data: string) => Promise<FilePathInfo | undefined>;
      makeFilePathInfo: (data: string) => Promise<FilePathInfo>;

      // from main to renderer,
      // queryUnsavedChanges: (callback: Function) => boolean;

      // allow front end to bind a front end method that can be called by the back end
      bindIpcRendererOn: (key: string, func: () => void) => void;
    };
  }
}

