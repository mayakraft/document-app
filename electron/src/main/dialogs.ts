import { dialog } from "electron";

export const newFileDialog = () =>
	dialog.showMessageBox({
		message: "This will erase all current progress",
		title: "Start a new file?",
		type: "question",
		buttons: ["New File", "Cancel"],
	});

export const unsavedChangesDialog = () =>
	dialog.showMessageBox({
		message: "You have unsaved progress",
		title: "Are you sure?",
		type: "question",
		buttons: ["Quit", "Cancel"],
	});
