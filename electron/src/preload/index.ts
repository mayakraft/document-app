import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { type FilePathInfo } from "../types/types.ts";

// Custom APIs for renderer
const api = {
	// changeTitle: (title: string) => ipcRenderer.send("set-title", title),
	setAppTitle: (title: string) => ipcRenderer.send("setAppTitle", title),
	pathJoin: () => ipcRenderer.invoke("pathJoin"),
	openFile: () => ipcRenderer.invoke("openFile"),
	saveFile: (fileInfo: FilePathInfo, data: string) =>
		ipcRenderer.invoke("saveFile", fileInfo, data),
	saveFileAs: (data: string): Promise<FilePathInfo | undefined> =>
		ipcRenderer.invoke("saveFileAs", data),
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
	// @ts-ignore (define in dts)
	window.electron = electronAPI;
	// @ts-ignore (define in dts)
	window.api = api;
}
