import { app, shell, Menu, BrowserWindow, ipcMain } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { join } from "node:path";
import icon from "../../resources/icon.png?asset";
import { openFile, saveFile, saveFileAs, pathJoin, makeFilePathInfo } from "./filesystem.ts";
import { setAppTitle } from "./app.ts";
import { newFileDialog, unsavedChangesDialog } from "./dialogs.ts";
import { makeTemplate } from "./menu.ts";

function createWindow(): BrowserWindow {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}

	// mainWindow.webContents.openDevTools();

	return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId("com.electron");

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	// IPC
	ipcMain.on("setAppTitle", setAppTitle);
	ipcMain.on("quitApp", () => app.quit());
	ipcMain.handle("newFileDialog", newFileDialog);
	ipcMain.handle("unsavedChangesDialog", unsavedChangesDialog);
	ipcMain.handle("pathJoin", pathJoin);
	ipcMain.handle("openFile", openFile);
	ipcMain.handle("saveFile", saveFile);
	ipcMain.handle("makeFilePathInfo", makeFilePathInfo);
	ipcMain.handle("saveFileAs", saveFileAs);

	const mainWindow = createWindow();
	const menu = Menu.buildFromTemplate(makeTemplate(mainWindow));
	Menu.setApplicationMenu(menu);

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	app.on("before-quit", (event) => {
		console.log("before-quit");
		// event.preventDefault();
		// mainWindow.webContents.send("menuQuit");
	});

	app.on("will-quit", (event) => {
		console.log("will-quit");
		// event.preventDefault();
		// mainWindow.webContents.send("menuQuit");
	});

	app.on("quit", (event) => {
		console.log("quit");
		// event.preventDefault();
		// mainWindow.webContents.send("menuQuit");
	});

	app.on("window-all-closed", (event) => {
		console.log("window-all-closed");
		// event.preventDefault();
		// mainWindow.webContents.send("menuQuit");
		// if (process.platform !== "darwin") {
		// 	app.quit();
		// }
		app.quit();
	});

	// mainWindow.on("close", (event) => {
	// 	event.preventDefault();
	// 	const result = mainWindow.webContents.send("queryUnsavedChanges");
	// 	console.log("attempted close", result);
	// 	// mainWindow.webContents.send("menuQuit");
	// });
});
