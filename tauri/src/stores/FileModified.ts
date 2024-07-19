import {
	writable,
} from "svelte/store";

export const FileModified = writable<boolean>(false);
