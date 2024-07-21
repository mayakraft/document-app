import { dialog } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import { type FilePathInfo } from "../general/types.ts";

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

const makeFileFilter = (name: string, ...extensions: string[]) => ({
	name,
	extensions,
});

/**
 *
 */
export const exportTextFile = async (data: string, ext = "svg", typename = "image") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [makeFileFilter(typename, ext)],
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
export const exportBinaryFile = async (data: DataView, ext = "png", typename = "image") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [makeFileFilter(typename, ext)],
	});
	if (canceled) {
		return;
	}
	const { directory, root } = await getFilePathInfo(filePath);
	const joined = path.join(directory, `${root}.${ext}`);
	fs.writeFile(joined, data, null);
};

/**
 * @param {string[]} data multiple file contents as strings
 */
export const exportTextFiles = async (data: string[] = [], ext = "svg", typename = "image") => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [makeFileFilter(typename, ext)],
	});
	if (canceled) {
		return;
	}
	const { directory, root, extension } = await getFilePathInfo(filePath);
	makeNumberedFilenames(data.length, root, extension).map(async (numberedName, i) => {
		const outPath = path.join(directory, numberedName);
		fs.writeFile(outPath, data[i]);
	});
};

/**
 *
 */
export const exportBinaryFiles = async (
	binaryFiles: Buffer[] = [],
	ext = "png",
	typename = "image",
) => {
	const { canceled, filePath } = await dialog.showSaveDialog({
		filters: [makeFileFilter(typename, ext)],
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
 *
 */
export const validateFileType = async (fileInfo: FilePathInfo): Promise<boolean> => {
	// list all supported extensions here
	switch (fileInfo.extension.toLowerCase()) {
		case "": // files without an extension might appear here?
		case ".js":
		case ".json":
		case ".txt":
			return true;
		default:
			await dialog.showMessageBox({
				message: `${fileInfo.extension} file type not supported`,
				title: "Unknown File Type",
				type: "error",
			});
			return false;
	}
};
