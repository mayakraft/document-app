import { get } from "svelte/store";
import { Model } from "./stores/Model.ts";
import { FileModified, FileInfo } from "./stores/File.ts";
import { DOCUMENT_EXTENSION, UNTITLED_FILENAME } from "../../general/constants.ts";
import { type FilePathInfo } from "../../general/types.ts";

/**
 * @description methods available to both the front and back ends.
 * This is the front-end's counterpart to src/main/index.ts, these methods
 * exist on the front-end side, but can be called from either front or back end.
 */

let quitInProgress = false;

/**
 * @description ask the app to quit.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const quitApp = async () => {
	// console.log("quit app request");
	if (get(FileModified)) {
		const { response } = await window.api.unsavedChangesDialog();
		if (response !== 0) {
			return;
		}
	}
	quitInProgress = true;
	window.api.quitApp();
};

/**
 * @description ask the app to create a new file.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const newFile = async () => {
	if (get(FileModified)) {
		const { response } = await window.api.unsavedChangesDialog("New File", "Cancel");
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

/**
 * @description ask the app to open a new file, replacing the current one.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const openFile = async () => {
	if (get(FileModified)) {
		const { response } = await window.api.unsavedChangesDialog("Proceed", "Cancel");
		if (response !== 0) {
			return;
		}
	}

	const { data, fileInfo } = await window.api.openFile();
	if (fileInfo) {
		Model.set(data);
		FileInfo.set(fileInfo);
		FileModified.set(false);
	}
};

/**
 * @description ask the app to save the currently opened file.
 * this can be called from the front-end or the back-end.
 */
export const saveFile = async () => {
	const success = await window.api.saveFile(get(FileInfo), get(Model));
	if (success) {
		FileModified.set(false);
	} else {
		saveFileAs();
	}
};

/**
 * @description ask the app to "save as", to write to a new file.
 * this can be called from the front-end or the back-end.
 */
export const saveFileAs = async () => {
	const fileInfo = await window.api.saveFileAs(get(Model));
	if (fileInfo) {
		FileInfo.set(fileInfo);
		FileModified.set(false);
	}
};

/**
 * @description this method is bound directly to the window DragEvent "ondrop"
 * and will fire when the user drags in a file from the system into the app.
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

/**
 * @description Protection for quitting the app with the "X" or red circle.
 * This will prompt the user if there are unsaved changes.
 */
window.addEventListener("beforeunload", (event) => {
	if (!get(FileModified) || quitInProgress) {
		return;
	}
	event.preventDefault();
	// https://github.com/electron/electron/issues/7977
	event.returnValue = false;
	setTimeout(async () => {
		const { response } = await window.api.unsavedChangesDialog();
		quitInProgress = response === 0;
		if (response === 0) {
			window.api.quitApp();
		}
	});
});

/**
 * bind all methods for the from-main-to-renderer IPC communication.
 */
window.api.bindMenuQuit(quitApp);
window.api.bindMenuNew(newFile);
window.api.bindMenuOpen(openFile);
window.api.bindMenuSave(saveFile);
window.api.bindMenuSaveAs(saveFileAs);
// window.api.queryUnsavedChanges(() => get(FileModified));
