import file from "../state/file.svelte.ts";
import { model } from "../state/model.svelte.ts";
import { unsavedChangesDialog } from "../system/dialogs.ts";
import { readTextFile } from "../system/fs.ts";
import { getFilePathInfo } from "../system/path.ts";
import { validateFileType } from "../system/validate.ts";
import { saveFileAs } from "./save.svelte.ts";

export const dragOpenFile = async (filePath: string): Promise<void> => {
  if (file.modified) {
    // todo: when 3-button dialogs are re-introduced this needs updating
    const response = await unsavedChangesDialog("Yes", "No", "Cancel");
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
