import { dialog, type MessageBoxReturnValue } from "electron";

export const unsavedChanges = (
  yesString: string = "Yes",
  noString: string = "No",
  cancelString: string = "Cancel",
): Promise<MessageBoxReturnValue> =>
  dialog.showMessageBox({
    message: "You have unsaved progress",
    title: "Would you like to save?",
    detail: "Would you like to save?",
    type: "question",
    buttons: [yesString, cancelString, noString],
  });
