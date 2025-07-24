import file from "./file.svelte.ts";
import { EXTENSION } from "../system/types.ts";

/**
 * @description the name of the app
 */
export const APP_NAME = "Document App";

/**
 * @description the default file name for a new file
 */
export const UNTITLED_FILENAME = `untitled.${EXTENSION}`;

class AppSettings {
  /**
   * @description Watch "FilePath" for any changes, update the window title
   * to include the currently opened filename.
   */
  appTitle: string = $derived.by<string>(() => {
    const displayName = file.info === undefined ? UNTITLED_FILENAME : file.info.file;
    const savedIndicator = file.modified ? " *" : "";
    return `${APP_NAME} - ${displayName}${savedIndicator}`;
  });
};

export const appSettings = new AppSettings();
