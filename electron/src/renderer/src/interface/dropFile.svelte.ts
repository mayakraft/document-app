import type { FilePathInfo } from "../../../main/filesystem.ts";
import { model } from "../state/model.svelte.ts";
import file from "../state/file.svelte.ts";

/**
 * @description this method is bound directly to the window DragEvent "ondrop"
 * and will fire when the user drags in a file from the system into the app.
 */
export const fileDropDidUpdate = async (event: DragEvent) => {
  // drag and drop file event object does not contain
  // the filename, we have to store it here and re-match later.
  let info: FilePathInfo;

  const fileOnLoad = (event: ProgressEvent<FileReader>) => {
    if (event.target && event.target.result && typeof event.target.result === "string") {
      model.value = event.target.result;
      file.info = info;
      file.modified = false;
    }
  };

  if (event.dataTransfer && event.dataTransfer.items) {
    const filenames = [...event.dataTransfer.files].map((el) => el.name);

    const transferFile = [...event.dataTransfer.items]
      .map((item, i) => ({ item, filename: filenames[i] }))
      .filter((el) => el.item.kind === "file")
      .map((el) => ({ ...el, contents: el.item.getAsFile() }))
      .shift();

    if (transferFile) {
      info = await window.api.makeFilePathInfo(transferFile.contents.path);

      //console.log(transferFile.contents.path);
      const reader = new FileReader();
      reader.onload = fileOnLoad;
      if (transferFile.contents) {
        reader.readAsText(transferFile.contents);
      }
    }
  }
};

