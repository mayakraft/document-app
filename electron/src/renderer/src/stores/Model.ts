import {
	// get,
	writable,
} from "svelte/store";

/**
 * @description Literally, just the contents of the file as a text string,
 * this is one level of abstraction away from the raw byte contents of a file,
 * because this app only ever uses files which are text files.
 */
export const Model = writable<string>("");

/**
 * @description Load a new file, replace everything currently open.
 * Instead of calling this, call "LoadFile" from inside the File store.
 * Load file metadata and frames and reset the current frame to frame 0.
 * This should include everything that happens in all the other
 * update/set Frame methods.
 */
export const SetNewModel = (contents: string) => {
	// Selection.reset();
	// FileMetadata.set(getFileMetadata(FOLD));
	// CommandHistory.set([]);
	// RecalculateView();
	// CameraMatrix.reset();
	// WebGLViewMatrix.reset();
	Model.set(contents);
};

// export const GetModel = () => (get(Model) || "");
