import { get } from "svelte/store";
import { Model } from "./stores/Model.ts";
import { FileModified, FileInfo, UNTITLED_FILENAME } from "./stores/File.ts";
import { DOCUMENT_EXTENSION } from "../../types/types.ts";

/**
 * @description additional communication between back and front ends
 */

// 'before-quit' event
// 'will-quit' event
// 'quit' event
// 'window-all-closed' event
// prevent closing before saving the file, 2 ways: "Quit menu" or red/X button
// app.on('window-all-closed', OnCloseRequested);
// const unlisten = appWindow.onCloseRequested(OnCloseRequested);
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
};

export const saveFile = async () => {
	const success = await window.api.saveFile(get(FileInfo), get(Model));
	if (success) {
		FileModified.set(false);
	} else {
		saveFileAs();
	}
};

export const saveFileAs = async () => {
	const fileInfo = await window.api.saveFileAs(get(Model));
	if (fileInfo) {
		FileInfo.set(fileInfo);
		FileModified.set(false);
	}
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

/**
 *
 */
// let dropUnlistener: Function;

/**
 * @description
 */
// const StartDropListener = async () => {
// 	// BrowserWindow.getFocusedWindow()
// 	dropUnlistener = await appWindow.onFileDropEvent(async (event) => {
// 		if (event.payload.type === "hover") {
// 			// console.log("User hovering", event.payload.paths);
// 		} else if (event.payload.type === "drop") {
// 			const filePath = event.payload.paths[0];
// 			try {
// 				LoadFile(await fs.readFile(filePath), filePath);
// 			} catch (error) {
// 				// could not load file
// 			}
// 			// console.log("User dropped", event.payload.paths);
// 		} else {
// 			// console.log("File drop cancelled");
// 		}
// 	});
// 	// you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
// 	// unlisten()
// };

// on app start
// StartDropListener();

// // on app dealloc
// const appDealloc = () => {
// 	if (dropUnlistener) {
// 		dropUnlistener();
// 	}
// };
