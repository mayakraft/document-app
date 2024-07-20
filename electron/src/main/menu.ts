import { app, BrowserWindow, type MenuItemConstructorOptions } from "electron";

export const makeTemplate = (window: BrowserWindow): MenuItemConstructorOptions[] => [
	{
		label: app.name,
		role: "appMenu",
		submenu: [
			{
				role: "about",
			},
			{
				type: "separator",
			},
			{
				role: "hide",
			},
			{
				role: "hideOthers",
			},
			{
				role: "unhide",
			},
			{
				type: "separator",
			},
			{
				type: "normal",
				accelerator: "CommandOrControl+Q",
				click: () => window.webContents.send("menuQuit"),
				label: "Quit",
			},
		],
	},
	{
		label: "File",
		submenu: [
			{
				type: "normal",
				accelerator: "CommandOrControl+N",
				click: () => window.webContents.send("menuNew"),
				label: "New",
			},
			{
				type: "normal",
				accelerator: "CommandOrControl+O",
				click: () => window.webContents.send("menuOpen"),
				label: "Open",
			},
			{
				type: "separator",
			},
			{
				type: "normal",
				accelerator: "CommandOrControl+S",
				click: () => window.webContents.send("menuSave"),
				label: "Save",
			},
			{
				type: "normal",
				accelerator: "CommandOrControl+Shift+S",
				click: () => window.webContents.send("menuSaveAs"),
				label: "Save As",
			},
		],
	},
	{
		label: "Edit",
		submenu: [
			{
				role: "undo",
			},
			{
				role: "redo",
			},
			{
				type: "separator",
			},
			{
				role: "cut",
			},
			{
				role: "copy",
			},
			{
				role: "paste",
			},
		],
	},
	{
		label: "View",
		submenu: [
			{
				role: "toggleDevTools",
			},
			{
				type: "separator",
			},
			{
				role: "togglefullscreen",
			},
		],
	},
	{
		role: "window",
		submenu: [
			{
				role: "minimize",
			},
			{
				role: "close",
			},
		],
	},
];
