import { family } from "@tauri-apps/plugin-os";
import {
  appDataDir,
  basename,
  dirname,
  extname,
  join,
  resolve,
} from '@tauri-apps/api/path';

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

/**
 * @description The directory "Resources" inside of the application bundle
 */
export const getResourcesDirectory = async (): Promise<string> =>
  family() === "windows"
    ? join(await appDataDir(), "/")
    : join(await appDataDir(), "/../");

/**
 * @description The directory the application bundle resides inside.
 */
export const getBaseDirectory = async (): Promise<string> =>
  family() === "windows"
    ? join(await appDataDir(), "/../../../")
    : join(await appDataDir(), "/../../../../");


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
    fullpath = await resolve(filePath);
  } catch (e) {
    // ignore
  }

  // get the directory containing the file
  try {
    directory = await dirname(fullpath);
  } catch (e) {
    // ignore
  }

  // get the basename of the file (name + extension), and for now,
  // set the "name" entry to be this, in the case that the file has no
  // extension, the following calls might not work.
  try {
    file = await basename(fullpath);
    root = file;
  } catch (e) {
    // ignore
  }

  // get the extension of the file, the portion after the final "."
  try {
    extension = await extname(fullpath);
  } catch (e) {
    // ignore
  }
  // parse the file and get the name of the file excluding the . and extension

  try {
    const rootmatch = file.match(/(.*)\.[^.]+$/);
    if (rootmatch && rootmatch.length > 1) {
      root = rootmatch[1];
    }
  } catch (e) {
    // ignore
  }
  return { fullpath, directory, file, root, extension };
};
