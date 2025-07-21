import { confirm } from "@tauri-apps/plugin-dialog";

export const unsavedChangesDialog = (
  yesString: string = "Yes",
  noString: string = "No",
  cancelString: string = "Cancel",
): Promise<boolean> =>
  confirm("Would you like to save?", {
    title: "You have unsaved progress",
    kind: "warning",
  });

// dialog.showMessageBox({
//   message: "You have unsaved progress",
//   title: "Would you like to save?",
//   detail: "Would you like to save?",
//   type: "question",
//   buttons: [yesString, cancelString, noString],
// });

