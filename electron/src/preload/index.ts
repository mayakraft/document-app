import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { type FilePathInfo } from "../general/types.ts";

// ipcRenderer sends signal from the renderer to main

const api = {
	// one way, front end to back end
	quitApp: () => ipcRenderer.send("quitApp"),
	setAppTitle: (title: string) => ipcRenderer.send("setAppTitle", title),

	// two way, front to back with a response
	unsavedChangesDialog: (yesString: string, noString: string) =>
		ipcRenderer.invoke("unsavedChangesDialog", yesString, noString),
	openFile: () => ipcRenderer.invoke("openFile"),
	saveFile: (fileInfo: FilePathInfo, data: string) =>
		ipcRenderer.invoke("saveFile", fileInfo, data),
	saveFileAs: (data: string): Promise<FilePathInfo | undefined> =>
		ipcRenderer.invoke("saveFileAs", data),
	pathJoin: () => ipcRenderer.invoke("pathJoin"),
	makeFilePathInfo: (data: string): Promise<FilePathInfo> =>
		ipcRenderer.invoke("makeFilePathInfo", data),

	// from main to renderer,
	// where main calls via: window.webContents.send() and ipcRenderer.on()
	bindMenuQuit: (callback: Function) => ipcRenderer.on("menuQuit", (_event) => callback()),
	bindMenuNew: (callback: Function) => ipcRenderer.on("menuNew", (_event) => callback()),
	bindMenuOpen: (callback: Function) => ipcRenderer.on("menuOpen", (_event) => callback()),
	bindMenuSave: (callback: Function) => ipcRenderer.on("menuSave", (_event) => callback()),
	bindMenuSaveAs: (callback: Function) => ipcRenderer.on("menuSaveAs", (_event) => callback()),

	// queryUnsavedChanges: (callback: Function) =>
	// 	ipcRenderer.invoke("queryUnsavedChanges", (_event) => callback()),
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
