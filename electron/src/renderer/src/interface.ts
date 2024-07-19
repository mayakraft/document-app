import { app } from 'electron';
// import {
// 	appWindow,
// } from "@tauri-apps/api/window";
// import {
// 	exit,
// } from "@tauri-apps/api/process";
import {
	TryCloseFile,
	NewFile,
	LoadFile,
	OpenFile,
	SaveFileAs,
	SaveFile,
	OnCloseRequested,
} from "./stores/File.js";

/**
 * @description Communicate from Rust to Javascript.
 */

// bind kernel execution methods to the window,
// this is how we call Javascript from Tauri/Rust.
const methods = {
	newFile: NewFile,
	loadFile: LoadFile,
	openFile: OpenFile,
	saveFileAs: SaveFileAs,
	saveFile: SaveFile,
	quit: async () => await TryCloseFile("Quit without saving?") ? app.quit(): undefined,
};

// window.fs = fs;
// window.dialog = {};
Object.assign(window, methods);

// prevent closing before saving the file, 2 ways: "Quit menu" or red/X button
// const unlisten = appWindow.onCloseRequested(OnCloseRequested);

// 'before-quit' event
// 'will-quit' event
// 'quit' event
// 'window-all-closed' event
app.on('window-all-closed', OnCloseRequested);

// todo: call unlisten if multiple windows are created / component is unmounted
// unlisten();
