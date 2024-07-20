import { ElectronAPI } from "@electron-toolkit/preload";
import { type FilePathInfo } from "../types/types.ts";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			setAppTitle: (title: string) => void;
			quitApp: () => void;
			newFileDialog: () => void;
			unsavedChangesDialog: () => void;
			// pathJoin: () => void;
			openFile: () => void;
			saveFile: (fileInfo: FilePathInfo, data: string) => void;
			saveFileAs: (data: string) => Promise<FilePathInfo | undefined>;
			menuQuit: (callback: Function) => void;
			menuNew: (callback: Function) => void;
			menuOpen: (callback: Function) => void;
			menuSave: (callback: Function) => void;
			menuSaveAs: (callback: Function) => void;
			queryUnsavedChanges: (callback: Function) => boolean;
		};
	}
}
