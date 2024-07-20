import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { type FilePathInfo } from "../types/types.ts";

const api = {
	// one way, front end to back end
	setAppTitle: (title: string) => ipcRenderer.send("setAppTitle", title),
	quitApp: () => ipcRenderer.send("quitApp"),

	// two way, front to back and respond
	newFileDialog: () => ipcRenderer.invoke("newFileDialog"),
	unsavedChangesDialog: () => ipcRenderer.invoke("unsavedChangesDialog"),
	// pathJoin: () => ipcRenderer.invoke("pathJoin"),
	openFile: () => ipcRenderer.invoke("openFile"),
	saveFile: (fileInfo: FilePathInfo, data: string) =>
		ipcRenderer.invoke("saveFile", fileInfo, data),
	saveFileAs: (data: string): Promise<FilePathInfo | undefined> =>
		ipcRenderer.invoke("saveFileAs", data),

	// from menu
	menuQuit: (callback: Function) => ipcRenderer.on("menuQuit", (_event) => callback()),
	menuNew: (callback: Function) => ipcRenderer.on("menuNew", (_event) => callback()),
	menuOpen: (callback: Function) => ipcRenderer.on("menuOpen", (_event) => callback()),
	menuSave: (callback: Function) => ipcRenderer.on("menuSave", (_event) => callback()),
	menuSaveAs: (callback: Function) => ipcRenderer.on("menuSaveAs", (_event) => callback()),
	queryUnsavedChanges: (callback: Function) =>
		ipcRenderer.invoke("queryUnsavedChanges", (_event) => callback()),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore (defined in .d.ts)
	window.electron = electronAPI;
	// @ts-ignore (defined in .d.ts)
	window.api = api;
}
