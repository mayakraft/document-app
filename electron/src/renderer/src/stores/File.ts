import { writable, derived, type Writable } from "svelte/store";
import { APP_NAME, UNTITLED_FILENAME } from "../../../general/constants.ts";
import { type FilePathInfo } from "../../../general/types.ts";

/**
 * @description The currently opened filename as a full path, including
 * the directory prefix.
 * @value {string}
 */
export const FileInfo = writable<FilePathInfo>();

/**
 * @description Has the current file been edited and not yet saved?
 * @value {boolean}
 */
export const FileModified = writable<boolean>(false);

/**
 * @description Watch "FilePath" for any changes, update the window title
 * to include the currently opened filename.
 */
const AppTitle = derived<[Writable<FilePathInfo>, Writable<boolean>], string>(
	[FileInfo, FileModified],
	([$FileInfo, $FileModified]) => {
		const displayName = $FileInfo === undefined ? UNTITLED_FILENAME : $FileInfo.file;
		const savedIndicator = $FileModified ? " *" : "";
		return `${APP_NAME} - ${displayName}${savedIndicator}`;
	},
	"",
);

let previousAppTitle = "";
const AppTitleUpdater = derived(
	AppTitle,
	($AppTitle) => {
		if ($AppTitle === previousAppTitle) {
			return;
		}
		previousAppTitle = $AppTitle;
		window.api.setAppTitle($AppTitle);
	},
	undefined,
);

// todo: top level subscribe has no unsubscribe call.
AppTitleUpdater.subscribe(() => {});
