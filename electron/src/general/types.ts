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

export type WindowAPI = {
  // one way, from renderer to main
  quitApp: () => void;
  setAppTitle: (title: string) => void;

  // two way, from renderer to main and back
  unsavedChangesDialog: (yesString?: string, noString?: string) => Promise<{ response: number }>;
  pathJoin: () => string;
  openFile: () => Promise<{ data?: string; fileInfo?: FilePathInfo }>;
  saveFile: (fileInfo: FilePathInfo, data: string) => Promise<boolean>;
  saveFileAs: (data: string) => Promise<FilePathInfo | undefined>;
  makeFilePathInfo: (data: string) => Promise<FilePathInfo>;

  // from main to renderer,
  // queryUnsavedChanges: (callback: Function) => boolean;

  // allow front end to bind a front end method that can be called by the back end
  bindIpcRendererOn: (key: string, func: () => void) => void;
};

