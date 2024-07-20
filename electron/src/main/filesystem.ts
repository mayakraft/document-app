import { app, dialog, IpcMainInvokeEvent } from "electron";
// import { IpcMain } from "electron/main";
import { promises as fs } from "node:fs";
import path from "node:path";
import { type FilePathInfo, DOCUMENT_EXTENSION } from "../types/types.ts";

const OpenFileFilters = {
	name: "Text Files",
	extensions: [DOCUMENT_EXTENSION, "html", "css", "js"],
};

const SaveFileFilters = {
	name: "Text Files",
	extensions: [DOCUMENT_EXTENSION],
};

const imageFileFilter = (...extensions: string[]) => ({
	name: "image",
	extensions,
});

/**
 * @description the default file name for a new file
 */
const UNTITLED_FILE = `untitled.${DOCUMENT_EXTENSION}`;

/**
 * @description a new file's default full path
 */
export const NEW_FILE_PATH = () => path.join(app.getPath("home"), UNTITLED_FILE);

/**
 *
 */
export const pathJoin = (_: IpcMainInvokeEvent, ...paths: string[]) => path.join(...paths);

/**
 * @description Pick apart a file path into useful parts
 */
export const getFilePathInfo = async (filePath: string): Promise<FilePathInfo> => {
	// compute everything inside of individual try catches.
	// for example if the file has no extension, the extname() function
	// will throw an error, in which case, we still want to get the other data.
	let fullpath = "";
	let directory = "";
	let file = "";
	let root = "";
	let extension = "";
	// resolve the user's "filePath" into an absolute path
	try {
		fullpath = path.resolve(filePath);
		// filePath = await normalize(filePath);
	} catch (e) {}
	// get the directory containing the file
	try {
		directory = path.dirname(fullpath);
	} catch (e) {}
	// get the basename of the file (name + extension), and for now,
	// set the "name" entry to be this, in the case that the file has no
	// extension, the following calls might not work.
	try {
		file = path.basename(fullpath);
		root = file;
	} catch (e) {}
	// get the extension of the file, the portion after the final "."
	try {
		extension = path.extname(fullpath);
	} catch (e) {}
	// parse the file and get the name of the file excluding the . and extension
	try {
		const rootmatch = file.match(/(.*)\.[^.]+$/);
		if (rootmatch && rootmatch.length > 1) {
			root = rootmatch[1];
		}
	} catch (e) {}
	return { fullpath, directory, file, root, extension };
};

/**
 * @description Convert a file name (name + extension) into a sequence of
 * filenames that take the form of name-0000N.ext where 000N is a number
 * that counts up from 0 to "count" - 1, and 000N will have the minimum
 * number of preceding zeros to pad all numbers to be the same length.
 */
const makeNumberedFilenames = (count: number, name: string, extension: string) => {
	const places = count.toString().length;
	const zeros = Array(places).fill(0).join("");
	return Array.from(Array(count))
		.map((_, i) => `${zeros}${i}`)
		.map((str) => str.slice(str.length - places, str.length))
		.map((num) => `${name}-${num}${extension}`);
};

/**
 *
 */
export const exportTextFile = async (data: string, ext = "svg") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [imageFileFilter(ext)],
	});
	if (canceled) {
		return;
	}
	const { directory, root } = await getFilePathInfo(filePath);
	const joined = path.join(directory, `${root}.${ext}`);
	fs.writeFile(joined, data);
};

/**
 *
 */
export const exportBinaryFile = async (data: DataView, ext = "png") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [imageFileFilter(ext)],
	});
	if (canceled) {
		return;
	}
	const { directory, root } = await getFilePathInfo(filePath);
	const joined = path.join(directory, `${root}.${ext}`);
	fs.writeFile(joined, data, null);
};

/**
 *
 */
export const exportTextFiles = async (textStrings = [], ext = "svg") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [imageFileFilter(ext)],
	});
	if (canceled) {
		return;
	}
	const { directory, root, extension } = await getFilePathInfo(filePath);
	makeNumberedFilenames(textStrings.length, root, extension).map(async (numberedName, i) => {
		const outPath = path.join(directory, numberedName);
		fs.writeFile(outPath, textStrings[i]);
	});
};

/**
 *
 */
export const exportBinaryFiles = async (binaryFiles = [], ext = "png") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [imageFileFilter(ext)],
	});
	if (canceled) {
		return;
	}
	const { directory, root, extension } = await getFilePathInfo(filePath);
	makeNumberedFilenames(binaryFiles.length, root, extension).map(async (numberedName, i) => {
		const outPath = path.join(directory, numberedName);
		fs.writeFile(outPath, binaryFiles[i]);
	});
};

/**
 * @description Load a new file. Unbind any currently opened file, reset the
 * path, disable "Save" by setting FileExists to false.
 */
// export const NewFile = async () => {
// 	if (
// 		!(await dialog.showMessageBox({
// 			message: "This will erase all current progress",
// 			title: "Start a new file?",
// 			type: "question",
// 			buttons: ["New File", "Cancel"],
// 		}))
// 	) {
// 		return;
// 	}
// 	const filePath = NEW_FILE_PATH();
// 	SetNewModel("");
// 	FilePath.set(filePath);
// 	FileModified.set(false);
// };

/**
 * @description The main entry point for loading a file.
 * If the file is a supported file format, the file will be loaded
 * into the app, otherwise an error message will be shown.
 */
// export const LoadFile = async (filePath: string, contents: any) => {
// 	// if the current file is modified, do not proceed
// 	if (!(await TryCloseFile())) {
// 		return;
// 	}

// 	const { extension } = await getFilePathInfo(filePath);

// 	// list all supported extensions here
// 	switch (extension.toLowerCase()) {
// 		case "": // files without an extension might appear here?
// 		case ".js":
// 		case ".json":
// 		case ".txt":
// 			SetNewModel(contents);
// 			FilePath.set(filePath ? filePath : NEW_FILE_PATH());
// 			FileModified.set(false);
// 			break;
// 		default:
// 			// console.log("COULD NOT load file");
// 			await dialog.showMessageBox({
// 				message: "please load a supported file type",
// 				title: "Unknown File Type",
// 				type: "error",
// 			});
// 			break;
// 	}
// };

/**
 * @description Perform an "Open File" operation, which tells the system
 * to open an open file dialog.
 */
export const openFile = async (): Promise<{ data?: string; fileInfo?: FilePathInfo }> => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: [
			"openFile",
			// 'multiSelections'
		],
	});

	if (canceled) {
		return {};
	}
	// todo: hardcoded ignoring more than 1 file
	const filePath = filePaths[0];
	const fileInfo = await getFilePathInfo(filePath);
	const data = await fs.readFile(filePath, { encoding: "utf-8" });
	return { fileInfo, data };
};

/**
 * @description Perform a "SaveAs" operation for the currently opened file.
 */
export const saveFileAs = async (
	_: IpcMainInvokeEvent,
	data: string,
): Promise<FilePathInfo | undefined> => {
	const defaultPath = app.getPath("home");
	const filters = [SaveFileFilters];
	const options = !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
	const { canceled, filePath } = await dialog.showSaveDialog(options);
	if (canceled) {
		return undefined;
	}
	// await writeTextFile(filePath, contents);
	await fs.writeFile(filePath, data);
	return getFilePathInfo(filePath);
};

// export const saveFileAs = async (targetDir: string, data: string): Promise<boolean> => {
// 	const { directory: defaultPath } = await getFilePathInfo(targetDir);
// 	const filters = [SaveFileFilters];
// 	const options =
// 		!targetDir || !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
// 	const { canceled, filePath } = await dialog.showSaveDialog(options);
// 	if (canceled) {
// 		return false;
// 	}
// 	// await writeTextFile(filePath, contents);
// 	await fs.writeFile(filePath, data);
// 	return true;
// };

/**
 * @description Perform a "Save" operation for the currently opened file.
 * if the file exists it will be overwritten,
 * if the file does not exist it will be silently created then written to.
 * returns true if the write was successful
 * returns false if the write was unsuccessful, it might be customary to
 * run the "saveAs" method.
 */
export const saveFile = async (
	_: IpcMainInvokeEvent,
	fileInfo: FilePathInfo,
	data: string,
): Promise<boolean> => {
	// a couple checks to REALLY make sure that the file already exists
	if (!fileInfo || !fileInfo.fullpath) {
		return false;
	}
	return fs
		.access(fileInfo.fullpath, fs.constants.F_OK)
		.catch(() => false)
		.then(async () => {
			// save file and overwrite contents
			await fs.writeFile(fileInfo.fullpath, data);
			return true;
		});
};

// export const SaveFile = async (
// 	event: IpcMainInvokeEvent,
// 	fileInfo: FilePathInfo,
// 	data: string,
// ): Promise<boolean> => {
// 	// a couple checks to REALLY make sure that the file already exists
// 	if (!fileInfo || !fileInfo.fullpath) {
// 		return saveFileAs(event, data);
// 	}
// 	return fs
// 		.access(fileInfo.fullpath, fs.constants.F_OK)
// 		.catch(() => saveFileAs(event, data))
// 		.then(async () => {
// 			// save file and overwrite contents
// 			await fs.writeFile(fileInfo.fullpath, data);
// 			return true;
// 		});
// };

/**
 * @description Check if it's okay to close/exit/new-file.. if the
 * currently opened file is unsaved, prompt the user.
 * @returns {Promise<boolean>} true if we are good to proceed, false
 * if the user has requested to not proceed (do not close the file).
 */
// export const TryCloseFile = async (message = "Close without saving?"): Promise<boolean> => {
// 	if (!get(FileModified)) {
// 		return true;
// 	}
// 	return dialog
// 		.showMessageBox({
// 			message,
// 			buttons: ["yes", "no"],
// 		})
// 		.then(({ response }) => response === 0);
// };

// export const openFileUTF8 = async (): Promise<{}> => {
// 	const { canceled, filePaths } = await dialog.showOpenDialog({});
// 	if (canceled) {
// 		return { contents: undefined, filePath: undefined };
// 	}
// 	const contents = await fs.readFile(filePaths[0], { encoding: "utf-8" });
// 	return { contents, filePath: filePaths[0] };
// };

// export const saveFileAs = async (targetDir: string, contents: string) => {
// 	const { directory: defaultPath } = await getFilePathInfo(targetDir);
// 	const filters = [SaveFileFilters];
// 	const options =
// 		!targetDir || !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
// 	const { canceled, filePath } = await dialog.showSaveDialog(null, options);
// 	if (canceled) {
// 		return;
// 	}
// 	// await writeTextFile(filePath, contents);
// 	await fs.writeFile(filePath, contents);
// 	FilePath.set(filePath);
// 	FileModified.set(false);
// };
