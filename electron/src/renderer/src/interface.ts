import { get } from "svelte/store";
import { Model } from "./stores/Model.ts";
import { FileModified, FileInfo, UNTITLED_FILENAME } from "./stores/File.ts";
import { DOCUMENT_EXTENSION, type FilePathInfo } from "../../types/types.ts";

/**
 * @description for front end - back end communication, this is the counterpart
 * to "main/index.ts, methods which exist from the front end side.
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

console.log("binding window.api menu methods");
window.api.menuQuit(quitApp);
window.api.menuNew(newFile);
window.api.menuOpen(openFile);
window.api.menuSave(saveFile);
window.api.menuSaveAs(saveFileAs);
window.api.queryUnsavedChanges(queryUnsavedChanges);

/**
 * @description bind an "ondrop" event handler and when it fires
 * pass in the result event object into this method.
 */
export const fileDropDidUpdate = async (event: DragEvent) => {
	// drag and drop file event object does not contain
	// the filename, we have to store it here and re-match later.
	let fileInfo: FilePathInfo;

	const fileOnLoad = (event: ProgressEvent<FileReader>) => {
		if (event.target && event.target.result && typeof event.target.result === "string") {
			Model.set(event.target.result);
			FileInfo.set(fileInfo);
			FileModified.set(false);
		}
	};

	if (event.dataTransfer && event.dataTransfer.items) {
		const filenames = [...event.dataTransfer.files].map((el) => el.name);

		const transferFile = [...event.dataTransfer.items]
			.map((item, i) => ({ item, filename: filenames[i] }))
			.filter((el) => el.item.kind === "file")
			.map((el) => ({ ...el, contents: el.item.getAsFile() }))
			.shift();

		if (transferFile) {
			fileInfo = await window.api.makeFilePathInfo(transferFile.contents.path);

			console.log(transferFile.contents.path);
			const reader = new FileReader();
			reader.onload = fileOnLoad;
			if (transferFile.contents) {
				reader.readAsText(transferFile.contents);
			}
		}
	}
};
