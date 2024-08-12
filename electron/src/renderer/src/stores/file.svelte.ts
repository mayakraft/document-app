import { type FilePathInfo } from "../../../general/types.ts";
import { createStore } from "./store.svelte.ts";

/**
 * @description The currently opened filename as a full path, including
 * the directory prefix.
 * @value {string}
 */
export const fileInfo = createStore<FilePathInfo>();

/**
 * @description Has the current file been edited and not yet saved?
 * @value {boolean}
 */
export const fileModified = createStore<boolean>(false);
