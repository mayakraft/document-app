import { model } from "../state/model.svelte.ts";
import file from "../state/file.svelte.ts";
import { saveFileAs } from "./saveFile.svelte.ts";

/**
 * @description ask the app to open a new file, replacing the current one.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const openFile = async (): Promise<void> => {
  if (file.modified) {
    // 0: "yes", 1: "cancel", 2: "no"
    const { response } = await window.api.unsavedChangesDialog("Yes", "No", "Cancel");
    if (response === 1) {
      return;
    }
    if (response === 0) {
      // request to save
      await saveFileAs();
    }
  }

  const { data, fileInfo: info } = await window.api.openFile();
  if (info) {
    model.value = data;
    file.info = info;
    file.modified = false;
  }
};
