import { model } from "../state/model.svelte.ts";
import file from "../state/file.svelte.ts";
import { getFilePathInfo } from "../system/path.ts";
import { saveFileAs } from "./save.svelte.ts";
import { unsavedChangesDialog } from "../system/dialogs.ts";
import { validateFileType } from "../system/validate.ts";
import { readTextFile } from "../system/fs.ts";

export const dragOpenFile = async (filePath: string): Promise<void> => {
  if (file.modified) {
    const response = await unsavedChangesDialog("Yes", "No", "Cancel");
    console.log("open file, save current file", response);
    if (response === false) {
      return;
    }
    if (response === true) {
      // todo: if they cancel from this dialog
      await saveFileAs();
    }
  }
  const fileInfo = await getFilePathInfo(filePath);

  if (fileInfo === undefined) { return; }
  if (!(await validateFileType(fileInfo))) { return; }

  const data = await readTextFile(fileInfo.fullpath);

  if (fileInfo) {
    model.value = data;
    file.info = fileInfo;
    file.modified = false;
  }
};

