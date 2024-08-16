import { type FilePathInfo } from "../../../general/types.ts";
import { createSignal } from "./runes.svelte.ts";
import { APP_NAME, UNTITLED_FILENAME } from "../../../general/constants.ts";

/**
 * @description The currently opened filename as a full path, including
 * the directory prefix.
 * @value {string}
 */
export const fileInfo = createSignal<FilePathInfo>();

/**
 * @description Has the current file been edited and not yet saved?
 * @value {boolean}
 */
// export const fileModified = createSignal<boolean>(false);
let fileModified = $state<boolean>(false);
export let setFileModified = (v: boolean) => {
	fileModified = v;
};
export let getFileModified = () => fileModified;

// export const setFileModified = (value: boolean) => {
// 	fileModified = value;
// };

// export const setFileModified = (value: boolean) => {};
/**
 * @description Watch "FilePath" for any changes, update the window title
 * to include the currently opened filename.
 */
const appTitle = $derived.by<string>(() => {
	const displayName = fileInfo.value === undefined ? UNTITLED_FILENAME : fileInfo.value.file;
	const savedIndicator = fileModified ? " *" : "";
	return `${APP_NAME} - ${displayName}${savedIndicator}`;
});

export const getAppTitle = () => appTitle;

// const createAppTitleDerived = () => {
// 	let value = $derived(
// 		`${APP_NAME} - ${fileInfo.value === undefined ? UNTITLED_FILENAME : fileInfo.value.file}${fileModified ? " *" : ""}`,
// 	);
// 	return {
// 		get value() {
// 			return value;
// 		},
// 	};
// };

// export const appTitle = createAppTitleDerived();
