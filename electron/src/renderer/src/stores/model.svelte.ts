import { createStore } from "./store.svelte.ts";

/**
 * @description Literally, just the contents of the file as a text string,
 * this is one level of abstraction away from the raw byte contents of a file,
 * because this app only ever uses files which are text files.
 */
export let model = createStore<string>("");

/**
 * @description Clear the model, update any other parts of the app state too.
 */
export const setNewModel = (contents: string) => {
	// if anything is needed, clear the state of the app
	model.value = contents;
};
