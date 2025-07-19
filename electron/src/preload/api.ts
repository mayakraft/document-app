import { ipcRenderer } from "electron";
import type { FilePathInfo } from "../main/fs/path.ts";

// this list should reflect the binding that occurs inside src/main/index.ts,
// with invokeEvents and onEvents function bindings.

export type WindowAPI = {
  // one way, from renderer to main
  quitApp: () => void;
  setAppTitle: (title: string) => void;

  // two way, from renderer to main and back
  unsavedChangesDialog: (
    yesString?: string,
    noString?: string,
    cancelString?: string,
  ) => Promise<{ response: number }>;
  pathJoin: () => Promise<string>;
  openFile: () => Promise<{ data?: string; fileInfo?: FilePathInfo }>;
  saveFile: (fileInfo: FilePathInfo, data: string) => Promise<boolean>;
  saveFileAs: (data: string) => Promise<FilePathInfo | undefined>;
  makeFilePathInfo: (data: string) => Promise<FilePathInfo>;
  getBaseDirectory: () => Promise<string>;

  // one way, from main to renderer
  menuPressNew: (callback: () => void) => void;
  menuPressOpen: (callback: () => void) => void;
  menuPressSave: (callback: () => void) => void;
  menuPressSaveAs: (callback: () => void) => void;
  menuPressQuit: (callback: () => void) => void;
};

// window.api
// this object will become a child of the global window object.
// primarily this will function as a way for the renderer to call to main.
export const api: WindowAPI = {
  // one way, front end to back end
  quitApp: () => ipcRenderer.send("quitApp"),
  setAppTitle: (title: string) => ipcRenderer.send("setAppTitle", title),

  // two way, front to back with a response
  unsavedChangesDialog: (yesString?: string, noString?: string, cancelString?: string) =>
    ipcRenderer.invoke("unsavedChangesDialog", yesString, noString, cancelString),
  openFile: () => ipcRenderer.invoke("openFile"),
  saveFile: (fileInfo: FilePathInfo, data: string) =>
    ipcRenderer.invoke("saveFile", fileInfo, data),
  saveFileAs: (data: string): Promise<FilePathInfo | undefined> =>
    ipcRenderer.invoke("saveFileAs", data),
  pathJoin: () => ipcRenderer.invoke("pathJoin"),
  makeFilePathInfo: (data: string): Promise<FilePathInfo> =>
    ipcRenderer.invoke("makeFilePathInfo", data),
  // get the app bundle's directory (not the location of the executable)
  getBaseDirectory: () => ipcRenderer.invoke("getBaseDirectory"),

  // from main to renderer
  // allow front end to bind methods so the backend can call the front end
  menuPressNew: (callback) => ipcRenderer.on("menuNew", () => callback()),
  menuPressOpen: (callback) => ipcRenderer.on("menuOpen", () => callback()),
  menuPressSave: (callback) => ipcRenderer.on("menuSave", () => callback()),
  menuPressSaveAs: (callback) => ipcRenderer.on("menuSaveAs", () => callback()),
  menuPressQuit: (callback) => ipcRenderer.on("menuQuit", () => callback()),
};
