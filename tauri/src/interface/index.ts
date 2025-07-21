import { quitApp } from "./quit.svelte.ts";
import { newFile } from "./newFile.svelte.ts";
import { openFile } from "./openFile.svelte.ts";
import { saveFile, saveFileAs } from "./saveFile.svelte.ts";
import type { WindowAPI } from "../../preload/api.ts";

// this is duplicated (in part) from src/preload/index.d.ts
declare global {
  interface Window {
    api: WindowAPI;
  }
}

/**
 * bind all methods for the from-main-to-renderer IPC communication.
 */
window.api.menuPressNew(newFile);
window.api.menuPressOpen(openFile);
window.api.menuPressSave(saveFile);
window.api.menuPressSaveAs(saveFileAs);
window.api.menuPressQuit(quitApp);
// window.api.queryUnsavedChanges(() => fileModified.value);
