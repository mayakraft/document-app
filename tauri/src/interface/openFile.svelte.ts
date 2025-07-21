import { model } from "../state/model.svelte.ts";
import file from "../state/file.svelte.ts";
import { saveFileAs } from "./saveFile.svelte.ts";
import { open, readTextFile } from "@tauri-apps/plugin-fs"
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { getFilePathInfo } from "../fs/path.ts";
import { unsavedChangesDialog } from "../dialogs/changes.ts";

/**
 * @description ask the app to open a new file, replacing the current one.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const openFile = async (): Promise<void> => {
  if (file.modified) {
    // 0: "yes", 1: "cancel", 2: "no"
    const response = await unsavedChangesDialog("Yes", "No", "Cancel");
    console.log("response", response);
    if (response === false) {
      return;
    }
    if (response === true) {
      // request to save
      await saveFileAs();
    }
  }

  // Open a selection dialog for image files
  const selected = await openDialog({
    multiple: false,
    filters: [{
      name: "Text",
      extensions: ["txt", "md"]
    }]
  });
  console.log("open dialog result", selected);

  // user cancelled the selection
  if (selected === null) { return; }

  // user selected a single file
  const f = await open(selected);
  console.log(f);
  const fileInfo = await f.stat();
  console.log(fileInfo);
  await f.close();
  if (!fileInfo.isFile) { return; }
  const contents = await readTextFile(selected);
  // todo: quit if contents is invalid
  const info = await getFilePathInfo(selected);
  console.log(contents);
  console.log(info);
  if (info) {
    model.value = contents;
    file.info = info;
    file.modified = false;
  }
};
