import { get, writable, derived } from "svelte/store";
import { Model } from "./Model.ts";
// import { GetModel, SetNewModel } from "./Model.ts";
// import { SetNewModel } from "./Model.ts";
import { type FilePathInfo, DOCUMENT_EXTENSION } from "../../../types/types.ts";

const APP_NAME = "Document App";

/**
 * @description the default file name for a new file
 */
const UNTITLED_FILE = `untitled.${DOCUMENT_EXTENSION}`;

// don't think we will really use this
//
// export const File = writable<ArrayBuffer>();

/**
 * @description Literally, just the contents of the file as a text string,
 * this is one level of abstraction away from the raw byte contents of a file,
 * because this app only ever uses files which are text files.
 */
// export const FileString = writable<string|undefined>("");

/**
 * @description The currently opened filename as a full path, including
 * the directory prefix.
 * @value {string}
 */
export const FileInfo = writable<FilePathInfo>();

/**
 * @description Has the current file been edited and not yet saved?
 * @value {boolean}
 */
export const FileModified = writable<boolean>(false);

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

/**
 * @description Watch "FilePath" for any changes, update the window title
 * to include the currently opened filename.
 */
const OnFileNameChange = derived(
	[FileInfo, FileModified],
	async ([$FileInfo, $FileModified]) => {
		const displayName = $FileInfo === undefined ? UNTITLED_FILE : $FileInfo.file;
		const savedIndicator = $FileModified ? " *" : "";
		const titleString = `${APP_NAME} - ${displayName}${savedIndicator}`;
		window.api.setAppTitle(titleString);
	},
	undefined,
);

// todo: top level subscribe has no unsubscribe call.
OnFileNameChange.subscribe(() => {});

// This doesn't work in the way I expected, Svelte derived stores with
// async values. This one time get() will get the current value (previous),
// before the call to the async, which, in theory would trigger a refresh
// of the data, if we weren't using this one time subscribe get().
// const exists = await get(FileExists);
// solution 1: create a top-level subscription, which, might be bad practice.
// solution 2: use Tauri native await exists($FilePath) instead, unless
// we need this FileExists object in multiple places then re-introduce the
// top level subscription thing.

// /**
//  * @description The main entry point for loading a file.
//  * If the file is a supported file format, the file will be loaded
//  * into the app, otherwise an error message will be shown.
//  */
// export const LoadFile = async (contents: any, pathInfo: FilePathInfo) => {
// 	// if the current file is modified, do not proceed
// 	if (!(await TryCloseFile())) {
// 		return;
// 	}

// 	// const { extension } = await getFilenameParts(filePath);
//   const filePath = `${pathInfo.directory}${pathInfo.base}`;

// 	// list all supported extensions here
// 	switch (pathInfo.extension.toLowerCase()) {
// 		case "": // files without an extension might appear here?
// 		case "js":
// 		case "json":
// 		case "txt":
// 			SetNewModel(contents);
// 			FilePath.set(filePath ? filePath : NEW_FILE_PATH());
// 			FileModified.set(false);
// 			break;
// 		default:
// 			// console.log("COULD NOT load file");
// 			await dialog.showMessageBox(null, {
// 				message: "please load a supported file type",
// 				title: "Unknown File Type",
// 				type: "error",
// 			});
// 			break;
// 	}
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
// 		.showMessageBox(null, {
// 			message,
// 			buttons: ["yes", "no"],
// 		})
// 		.then(({ response }) => response === 0);
// };

// export const OnCloseRequested = async (event: CloseRequestedEvent) => {
// 	if (!await TryCloseFile("Quit without saving?")) {
// 		event.preventDefault();
// 	}
// };
// export const OnCloseRequested = async (event) => {
// 	if (!(await TryCloseFile("Quit without saving?"))) {
// 		event.preventDefault();
// 	}
// };

// /**
//  * @description Given a filename (name + extension), without a path
//  * directory, prefix the OS User's document directory to the file
//  * and return the full path.
//  */
// export const homeDirectoryFile = (name: string) => path.join(app.getPath("home"), name);

// /**
//  * @description Pick apart a file path into useful parts
//  */
// export const getFilenameParts = async (filePath: string): Promise<FilePathInfo> => {
// 	// compute everything inside of individual try catches.
// 	// for example if the file has no extension, the extname() function
// 	// will throw an error, in which case, we still want to get the other data.
// 	let directory = "";
// 	let base = "";
// 	let name = "";
// 	let extension = "";
// 	// resolve the user's "filePath" into an absolute path
// 	try {
// 		filePath = path.resolve(filePath);
// 		// filePath = await normalize(filePath);
// 	} catch (e) {}
// 	// get the directory containing the file
// 	try {
// 		directory = path.dirname(filePath);
// 	} catch (e) {}
// 	// get the basename of the file (name + extension), and for now,
// 	// set the "name" entry to be this, in the case that the file has no
// 	// extension, the following calls might not work.
// 	try {
// 		base = path.basename(filePath);
// 		name = base;
// 	} catch (e) {}
// 	// get the extension of the file, the portion after the final "."
// 	try {
// 		extension = path.extname(filePath);
// 	} catch (e) {}
// 	// parse the base and get the name of the file excluding the . and extension
// 	try {
// 		const basematch = base.match(/(.*)\.[^.]+$/);
// 		if (basematch && basematch.length > 1) {
// 			name = basematch[1];
// 		}
// 	} catch (e) {}
// 	return { directory, base, name, extension };
// };

// /**
//  * @description Convert a file name (name + extension) into a sequence of
//  * filenames that take the form of name-0000N.ext where 000N is a number
//  * that counts up from 0 to "count" - 1, and 000N will have the minimum
//  * number of preceding zeros to pad all numbers to be the same length.
//  */
// const makeNumberedFilenames = (count: number, name: string, extension: string) => {
// 	const places = count.toString().length;
// 	const zeros = Array(places).fill(0).join("");
// 	return Array.from(Array(count))
// 		.map((_, i) => `${zeros}${i}`)
// 		.map((str) => str.slice(str.length - places, str.length))
// 		.map((num) => `${name}-${num}.${extension}`);
// };

// /**
//  *
//  */
// export const exportTextFile = async (string: string, ext = "svg") => {
// 	const { canceled, filePath } = await dialog.showSaveDialog(
// 		null, // BrowserWindow.getFocusedWindow(),
// 		{ filters: [imageFileFilter(ext)] },
// 	);
// 	if (canceled) {
// 		return;
// 	}
// 	const { directory, name } = await getFilenameParts(filePath);
// 	const joined = path.join(directory, `${name}.${ext}`);
// 	fs.writeFile(joined, string);
// };

// /**
//  *
//  */
// export const exportBinaryFile = async (binaryFile: ArrayBuffer, ext = "png") => {
// 	const { canceled, filePath } = await dialog.showSaveDialog(null, {
// 		filters: [imageFileFilter(ext)],
// 	});
// 	if (canceled) {
// 		return;
// 	}
// 	const { directory, name } = await getFilenameParts(filePath);
// 	const joined = path.join(directory, `${name}.${ext}`);
// 	fs.writeFile(joined, binaryFile, null);
// };

// /**
//  *
//  */
// export const exportTextFiles = async (textStrings = [], ext = "svg") => {
// 	const { canceled, filePath } = await dialog.showSaveDialog({
// 		filters: [imageFileFilter(ext)],
// 	});
// 	if (canceled) {
// 		return;
// 	}
// 	const { directory, name, extension } = await getFilenameParts(filePath);
// 	makeNumberedFilenames(textStrings.length, name, extension).map(async (numberedName, i) => {
// 		const outPath = path.join(directory, numberedName);
// 		fs.writeFile(outPath, textStrings[i]);
// 	});
// };

// /**
//  *
//  */
// export const exportBinaryFiles = async (binaryFiles = [], ext = "png") => {
// 	const { canceled, filePath } = await dialog.showSaveDialog({
// 		filters: [imageFileFilter(ext)],
// 	});
// 	if (canceled) {
// 		return;
// 	}
// 	const { directory, name, extension } = await getFilenameParts(filePath);
// 	makeNumberedFilenames(binaryFiles.length, name, extension).map(async (numberedName, i) => {
// 		const outPath = path.join(directory, numberedName);
// 		fs.writeFile(outPath, binaryFiles[i]);
// 	});
// };

// /**
//  * @description Load a new file. Unbind any currently opened file, reset the
//  * path, disable "Save" by setting FileExists to false.
//  */
// export const NewFile = async () => {
// 	if (
// 		!(await dialog.showMessageBox(null, {
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

// /**
//  * @description The main entry point for loading a file.
//  * If the file is a supported file format, the file will be loaded
//  * into the app, otherwise an error message will be shown.
//  */
// export const LoadFile = async (contents: any, filePath: string) => {
// 	// if the current file is modified, do not proceed
// 	if (!(await TryCloseFile())) {
// 		return;
// 	}

// 	const { extension } = await getFilenameParts(filePath);

// 	// list all supported extensions here
// 	switch (extension.toLowerCase()) {
// 		case "": // files without an extension might appear here?
// 		case "js":
// 		case "json":
// 		case "txt":
// 			SetNewModel(contents);
// 			FilePath.set(filePath ? filePath : NEW_FILE_PATH());
// 			FileModified.set(false);
// 			break;
// 		default:
// 			// console.log("COULD NOT load file");
// 			await dialog.showMessageBox(null, {
// 				message: "please load a supported file type",
// 				title: "Unknown File Type",
// 				type: "error",
// 			});
// 			break;
// 	}
// };

// /**
//  * @description Perform an "Open File" operation, which tells the system
//  * to open an open file dialog.
//  */
// export const OpenFile = async () => {
// 	const { canceled, filePaths } = await dialog.showOpenDialog({
// 		properties: [
// 			"openFile",
// 			// 'multiSelections'
// 		],
// 	});

// 	if (canceled) {
// 		return;
// 	}
// 	// todo: hardcoded ignoring more than 1 file
// 	const filePath = filePaths[0];
// 	const contents = await fs.readFile(filePath, { encoding: "utf-8" });
// 	try {
// 		LoadFile(contents, filePath);
// 	} catch (error) {
// 		console.warn(error);
// 	}
// 	// const contents = await readBinaryFile(filePath);
// };

// /**
//  * @description Perform a "SaveAs" operation for the currently opened file.
//  */
// export const SaveFileAs = async () => {
// 	const contents = GetModel();
// 	const targetFilePath = get(FilePath);
// 	const { directory: defaultPath } = await getFilenameParts(targetFilePath);
// 	const filters = [SaveFileFilters];
// 	const options =
// 		!targetFilePath || !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
// 	const { canceled, filePath } = await dialog.showSaveDialog(null, options);
// 	if (canceled) {
// 		return;
// 	}
// 	// await writeTextFile(filePath, contents);
// 	await fs.writeFile(filePath, contents);
// 	FilePath.set(filePath);
// 	FileModified.set(false);
// };

// /**
//  * @description Perform a "Save" operation for the currently opened file.
//  * if the file exists it will be overwritten,
//  * if the file does not exist it will be silently created then written to.
//  */
// export const SaveFile = async () => {
// 	// a couple checks to REALLY make sure that the file already exists
// 	const filePath = get(FilePath);
// 	if (!filePath) {
// 		return SaveFileAs();
// 	}
// 	fs.access(filePath, fs.constants.F_OK)
// 		.catch(() => SaveFileAs())
// 		.then(async () => {
// 			// save file and overwrite contents
// 			await fs.writeFile(filePath, GetModel());
// 			FileModified.set(false);
// 		});
// };

// /**
//  *
//  */
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
