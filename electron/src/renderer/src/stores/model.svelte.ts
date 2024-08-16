import { createSignal } from "./runes.svelte";

/**
 * @description Literally, just the contents of the file as a text string,
 * this is one level of abstraction away from the raw byte contents of a file,
 * because this app only ever uses files which are text files.
 */
export const model = createSignal();

// export let makeModel = (val?: string) => {
// 	let value = $state(val);
// 	return {
// 		get value(): string {
// 			return value;
// 		},
// 		set value(v: string) {
// 			// if anything else is needed, clear the state of the app
// 			value = v;
// 		},
// 	};
// };
// export const model = makeModel();
