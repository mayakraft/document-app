import { model } from "../state/model.svelte.ts";
import file from "../state/file.svelte.ts";
import { type FilePathInfo } from "../fs/path.ts";
import { saveFile as saveFileFS, saveFileAs as saveFileAsFS } from "../fs/file.ts";
/**
 * @description ask the app to save the currently opened file.
 * this can be called from the front-end or the back-end.
 */
export const saveFile = async (): Promise<boolean> => {
  // fileInfo.value is an object and a Proxy (due to Svelte 5), this method
  // will attempt to clone it, can't clone a proxy, so we shallow copy.
  // const success = await window.api.saveFile({ ...fileInfo.value }, model.value);
  const success = await saveFileFS($state.snapshot(file.info), model.value);
  console.log("success", success);
  if (success) {
    file.modified = false;
  } else {
    saveFileAs();
  }
  return success;
};

/**
 * @description ask the app to "save as", to write to a new file.
 * this can be called from the front-end or the back-end.
 */
export const saveFileAs = async (): Promise<FilePathInfo | undefined> => {
  const info = await saveFileAsFS(model.value);
  console.log("info", info);
  if (info) {
    file.info = info;
    file.modified = false;
  }
  return info;
};
