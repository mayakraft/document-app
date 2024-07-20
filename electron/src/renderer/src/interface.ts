// import { app } from "electron";
import { get } from "svelte/store";
import { Model } from "./stores/Model.ts";
import { FileModified, FileInfo, UNTITLED_FILENAME } from "./stores/File.ts";
import { DOCUMENT_EXTENSION } from "../../types/types.ts";

// import {
// 	appWindow,
// } from "@tauri-apps/api/window";
// import {
// 	exit,
// } from "@tauri-apps/api/process";
// import {
// 	TryCloseFile,
// 	NewFile,
// 	LoadFile,
// 	OpenFile,
// 	SaveFileAs,
// 	SaveFile,
// 	OnCloseRequested,
// } from "./stores/File.js";

/**
 * @description Communicate from Rust to Javascript.
 */

// bind kernel execution methods to the window,
// this is how we call Javascript from Tauri/Rust.
// const methods = {
// 	newFile: NewFile,
// 	loadFile: LoadFile,
// 	openFile: OpenFile,
// 	saveFileAs: SaveFileAs,
// 	saveFile: SaveFile,
// 	quit: async () => await TryCloseFile("Quit without saving?") ? app.quit(): undefined,
// };

// window.fs = fs;
// window.dialog = {};
// Object.assign(window, methods);

// prevent closing before saving the file, 2 ways: "Quit menu" or red/X button
// const unlisten = appWindow.onCloseRequested(OnCloseRequested);

// 'before-quit' event
// 'will-quit' event
// 'quit' event
// 'window-all-closed' event
// app.on('window-all-closed', OnCloseRequested);

// todo: call unlisten if multiple windows are created / component is unmounted
// unlisten();

export const quitApp = async () => {
	console.log("quit app request");
	if (get(FileModified)) {
		const { response } = await window.api.unsavedChangesDialog();
		if (response !== 0) {
			return;
		}
	}
	window.api.quitApp();
};

export const newFile = async () => {
	if (get(FileModified)) {
		const { response } = await window.api.newFileDialog();
		if (response !== 0) {
			return;
		}
	}
	Model.set("");
	FileInfo.set({
		fullpath: "",
		directory: "",
		file: UNTITLED_FILENAME,
		root: "untitled",
		extension: `.${DOCUMENT_EXTENSION}`,
	});
	FileModified.set(false);
};

export const openFile = async () => {
	const { data, fileInfo } = await window.api.openFile();
	if (fileInfo) {
		Model.set(data);
		FileInfo.set(fileInfo);
		FileModified.set(false);
	}
	// console.log("fileInfo", fileInfo);
	// console.log("data", data);
};

export const saveFile = async () => {
	// console.log("$FileInfo", get(FileInfo));
	// console.log("$Model", get(Model));
	const success = await window.api.saveFile(get(FileInfo), get(Model));
	// console.log("success", success);
	if (success) {
		FileModified.set(false);
	} else {
		saveFileAs();
	}
};

export const saveFileAs = async () => {
	// console.log("$FileInfo", get(FileInfo));
	// console.log("$Model", get(Model));
	const fileInfo = await window.api.saveFileAs(get(Model));
	if (fileInfo) {
		FileInfo.set(fileInfo);
		FileModified.set(false);
	}
	// console.log("fileInfo", fileInfo);
};

// true: unsaved changes. false: no changes all good to quit or make a new file
// export const queryUnsavedChanges = () => get(FileModified);
export const queryUnsavedChanges = () => {
	console.log("queryUnsavedChanges in front end", get(FileModified));
	return get(FileModified);
};

window.api.menuQuit(quitApp);
window.api.menuNew(newFile);
window.api.menuOpen(openFile);
window.api.menuSave(saveFile);
window.api.menuSaveAs(saveFileAs);
window.api.queryUnsavedChanges(queryUnsavedChanges);
