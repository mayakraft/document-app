import { BrowserWindow, IpcMainInvokeEvent } from "electron";

/**
 *
 */
export const setAppTitle = (event: IpcMainInvokeEvent, title: string) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	if (!win) {
		return;
	}
	win.setTitle(title);
};
