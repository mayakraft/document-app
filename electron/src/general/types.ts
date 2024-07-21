/**
 * files here are accessible to both the back-end and front-end.
 * very important! do not include any node core modules.
 */

/**
 * @description Verbose file path information
 */
export type FilePathInfo = {
	fullpath: string; // "/Users/Maya/Documents/notes.txt"
	directory: string; // "/Users/Maya/Documents" (without a final slash /)
	file: string; // "notes.txt"
	root: string; // "notes"
	extension: string; // ".txt"
};
