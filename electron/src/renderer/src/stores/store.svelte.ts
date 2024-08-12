/**
 * @description create and return a writable Svelte store
 */
export const createStore = <T>(val?: T) => {
	let value = $state(val);
	return {
		get value(): T {
			return value;
		},
		set value(v: T) {
			value = v;
		},
	};
};
