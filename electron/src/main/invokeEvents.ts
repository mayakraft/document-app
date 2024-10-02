import { app, dialog, IpcMainInvokeEvent } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DOCUMENT_EXTENSION, DOCUMENT_TYPE_NAME } from "../general/constants.ts";
import { type FilePathInfo } from "../general/types.ts";
import { getFilePathInfo, validateFileType } from "./filesystem.ts";

/**
 * these are the two-way renderer-to-main-and-back events which use
 * ipcRenderer.invoke() and ipcMain.handle()
 */

export const unsavedChangesDialog = (
  _: IpcMainInvokeEvent,
  yesString: string = "Proceed",
  noString: string = "Cancel",
) =>
  dialog.showMessageBox({
    message: "You have unsaved progress",
    title: "Are you sure?",
    type: "question",
    buttons: [yesString, noString],
  });

/**
 *
 */
export const pathJoin = (_: IpcMainInvokeEvent, ...paths: string[]) => path.join(...paths);

export const makeFilePathInfo = async (
  _: IpcMainInvokeEvent,
  filePath: string,
): Promise<FilePathInfo> => getFilePathInfo(filePath);

/**
 * @description Perform an "Open File" operation, which tells the system
 * to open an open file dialog.
 */
export const openFile = async (
  _: IpcMainInvokeEvent,
): Promise<{ data?: string; fileInfo?: FilePathInfo }> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  if (canceled) {
    return {};
  }
  // hardcoded ignoring more than 1 file
  const filePath = filePaths[0];
  const fileInfo = await getFilePathInfo(filePath);
  if (!(await validateFileType(fileInfo))) {
    return {};
  }
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
  const filters = [
    {
      name: DOCUMENT_TYPE_NAME,
      extensions: [DOCUMENT_EXTENSION],
    },
  ];
  const options = !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
  const { canceled, filePath } = await dialog.showSaveDialog(options);
  if (canceled) {
    return undefined;
  }
  await fs.writeFile(filePath, data);
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

