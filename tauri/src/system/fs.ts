import {
  open as systemOpenDialog,
  save as systemSaveDialog,
} from "@tauri-apps/plugin-dialog";
import {
  readTextFile as fsReadTextFile,
  writeTextFile as fsWriteTextFile,
  writeFile as fsWriteFile,
} from "@tauri-apps/plugin-fs"
import {
  join,
  homeDir,
} from '@tauri-apps/api/path';
import { EXTENSION, EXTENSIONS, FILE_TYPE_NAME } from "./types.ts";
import { type FilePathInfo, getFilePathInfo } from "./path.ts";
import { validateFileType } from "./validate.ts";
import { defaultFileDialogFilter, openFileDialog } from "./dialogs.ts";

/**
 *
 */
export const readTextFile = (filePath: string): Promise<string> => {
  return fsReadTextFile(filePath);
};

/**
 *
 */
export const writeTextFile = (filePath: string, data: string): Promise<void> => {
  return fsWriteTextFile(filePath, data);
};

/**
 *
 */
export const writeFile = (filePath: string, data: Uint8Array): Promise<void> => {
  return fsWriteFile(filePath, data);
};

/**
 * @description Perform an "Open File" operation, which tells the system
 * to open an open file dialog.
 */
export const openDialogAndReadFile = async (): Promise<{ data?: string; fileInfo?: FilePathInfo }> => {
  const fileInfo = await openFileDialog(defaultFileDialogFilter());

  if (fileInfo === undefined || !(await validateFileType(fileInfo))) {
    return {};
  }

  const data = await readTextFile(fileInfo.fullpath);
  return { fileInfo, data };
};

/**
 * @description Perform a "SaveAs" operation for the currently opened file.
 */
export const saveFileAs = async (data: string): Promise<FilePathInfo | undefined> => {
  const defaultPath = await homeDir();
  const filters = [
    {
      name: FILE_TYPE_NAME,
      extensions: [EXTENSION],
    },
  ];
  const options =
    !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
  const filePath = await systemSaveDialog(options);
  if (filePath === null) {
    return undefined;
  }
  await writeTextFile(filePath, data);
  return getFilePathInfo(filePath);
};

/**
 * @description Perform a "Save" operation for the currently opened file.
 * if the file exists it will be overwritten,
 * if the file does not exist it will be silently created then written to.
 * returns true if the write was successful
 * returns false if the write was unsuccessful, it might be customary to
 * run the "saveAs" method.
 */
export const saveFile = async (
  fileInfo: FilePathInfo,
  data: string,
): Promise<boolean> => {
  // a couple checks to REALLY make sure that the file already exists
  if (!fileInfo || !fileInfo.fullpath) {
    return false;
  }
  // fs.access(fileInfo.fullpath, fs.constants.F_OK)
  await writeTextFile(fileInfo.fullpath, data);
  return true;
};

/**
 * @description Convert a file name (name + extension) into a sequence of
 * filenames that take the form of name-0000N.ext where 000N is a number
 * that counts up from 0 to "count" - 1, and 000N will have the minimum
 * number of preceding zeros to pad all numbers to be the same length.
 */
const makeNumberedFilenames = (
  count: number,
  name: string,
  extension: string,
): string[] => {
  const places = count.toString().length;
  const zeros = Array(places).fill(0).join("");
  return Array.from(Array(count))
    .map((_, i) => `${zeros}${i}`)
    .map((str) => str.slice(str.length - places, str.length))
    .map((num) => `${name}-${num}${extension}`);
};

const makeFileFilter = (
  name: string,
  ...extensions: string[]
): { name: string; extensions: string[] } => ({
  name,
  extensions,
});

/**
 *
 */
export const exportTextFile = async (
  data: string,
  ext = "svg",
  typename = "image",
): Promise<void> => {
  const filePath = await systemSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (filePath === null) {
    return;
  }
  const { directory, root } = await getFilePathInfo(filePath);
  const joined = await join(directory, `${root}.${ext}`);
  writeTextFile(joined, data);
};

/**
 *
 */
export const exportBinaryFile = async (
  data: Uint8Array,
  ext = "png",
  typename = "image",
): Promise<void> => {
  const filePath = await systemSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (filePath === null) {
    return;
  }
  const { directory, root } = await getFilePathInfo(filePath);
  const joined = await join(directory, `${root}.${ext}`);
  writeFile(joined, data);
};

/**
 * @param {string[]} data multiple file contents as strings
 */
export const exportTextFiles = async (
  data: string[] = [],
  ext = "svg",
  typename = "image",
): Promise<void> => {
  const filePath = await systemSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (filePath === null) {
    return;
  }
  const { directory, root, extension } = await getFilePathInfo(filePath);
  makeNumberedFilenames(data.length, root, extension).map(async (numberedName, i) => {
    const outPath = await join(directory, numberedName);
    writeTextFile(outPath, data[i]);
  });
};

/**
 *
 */
export const exportBinaryFiles = async (
  binaryFiles: Uint8Array[] = [],
  ext = "png",
  typename = "image",
): Promise<void> => {
  const filePath = await systemSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (filePath === null) {
    return;
  }
  const { directory, root, extension } = await getFilePathInfo(filePath);
  makeNumberedFilenames(binaryFiles.length, root, extension).map(
    async (numberedName, i) => {
      const outPath = await join(directory, numberedName);
      writeFile(outPath, binaryFiles[i]);
    },
  );
};
