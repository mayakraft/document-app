/**
 *
 */
export type FilePathInfo = {
	fullpath: string; // "/Users/Maya/Documents/notes.txt"
	directory: string; // "/Users/Maya/Documents" (without a final slash /)
	file: string; // "notes.txt"
	root: string; // "notes"
	extension: string; // ".txt"
};

/**
 * @description This app is allowed to support many different file types,
 * but it should have one "main" file type.
 */
export const DOCUMENT_EXTENSION = "txt";
