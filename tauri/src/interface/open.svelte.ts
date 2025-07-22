import { saveFileAs } from "./save.svelte.ts";
import file from "../state/file.svelte.ts";
import { model } from "../state/model.svelte.ts";
import {
  unsavedChangesDialog,
  defaultFileDialogFilter,
  openFileDialog,
} from "../system/dialogs.ts";
import { validateFileType } from "../system/validate.ts";
import { readTextFile } from "../system/fs.ts";

/**
 * @description ask the app to open a new file, replacing the current one.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const openFile = async (): Promise<void> => {
  if (file.modified) {
    const response = await unsavedChangesDialog("Yes", "No", "Cancel");
    console.log("open file, save current file", response);
    if (response === false) {
      return;
    }
    if (response === true) {
      await saveFileAs();
    }
  }

  const fileInfo = await openFileDialog(defaultFileDialogFilter());
  if (fileInfo === undefined || !(await validateFileType(fileInfo))) {
    return;
  }
  const data = await readTextFile(fileInfo.fullpath);

  if (fileInfo) {
    model.value = data;
    file.info = fileInfo;
    file.modified = false;
  }
};

