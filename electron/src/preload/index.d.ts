import { ElectronAPI } from "@electron-toolkit/preload";
import { type FilePathInfo } from "../general/types.ts";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			// one way, from renderer to main
			quitApp: () => void;
			setAppTitle: (title: string) => void;

			// two way, from renderer to main and back
			unsavedChangesDialog: (yesString: string, noString: string) => void;
			pathJoin: () => void;
			openFile: () => void;
			saveFile: (fileInfo: FilePathInfo, data: string) => void;
			saveFileAs: (data: string) => Promise<FilePathInfo | undefined>;
			makeFilePathInfo: (data: string) => Promise<FilePathInfo>;

			// one way, from main to renderer
			bindMenuQuit: (callback: Function) => void;
			bindMenuNew: (callback: Function) => void;
			bindMenuOpen: (callback: Function) => void;
			bindMenuSave: (callback: Function) => void;
			bindMenuSaveAs: (callback: Function) => void;
			// queryUnsavedChanges: (callback: Function) => boolean;
		};
	}
}
