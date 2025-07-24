# Electron / Tauri document app

A **document app** is an app whose purpose is to edit a file (open, edit, save changes).

This repo contains two separate apps in both [Tauri](https://tauri.app/) and [Electron](https://www.electronjs.org/), each a stripped-down implementation of a document app containing the features:

- The app titlebar includes the name of the current opened filename.
- The app titlebar appends a \* character if the file is modified and not yet saved.
- The app will warn the user if the file is modified and unsaved before quitting the app.
- The app will warn the user if the file is modified and unsaved before replacing the file with a new file.

This implementation uses a text file as the native file format, but can be easily changed to be an image editing app or any type of file.

There are many differences between the Tauri and Electron implementations, for example, Tauri exposes many of the backend system methods (fs, path) to be able to be called from the front end, where Electron requires a message-calling IPC system, and as a result is a bit more complex.

> Tauri 2.0 is still under active development, contains many issues, a few of which are present in this app. As of 2025 the Electron project is the more stable of the two. Issues are enumerated below.

# Behavior

The designated file type is .txt.

If the file is modified but not yet saved, the app is meant to behave in the expected manner, for example, warning you before quitting. Specifically here are some things to test and ensure work. In all cases, there are two ways of quitting:

- File Menu -> Quit or CMD/CTRL+Q (these trigger the same effect)
- Pressing the X button (Windows/Linux) or red circle (Macos/Linux)

Things to test (each should be tested by triggering both types of quit)

- quitting after opening the app, or when the file has just been saved should quit immediately.
- quitting with a modified file triggers the "would you like to save" query.
- "would you like to save" selecting "cancel" should return you to the app
- "would you like to save" selecting "no" should quit the app
- "would you like to save" selecting "yes" should open the file save dialog
- "would you like to save" selecting "yes", then cancelling the file save dialog should return you to the app
- "would you like to save" selecting "yes", then saving a file should quit the app

Then there is another sequence where a file is modified and the user triggers a "new" file, or opening a new file. Opening a new file can happen two ways:

- File Menu -> Open or CMD/CTRL+O (these trigger the same effect)
- Dragging and dropping a file into the app window

In this case, test the same series of tests as the list above.

# Known Issues

- Tauri. 3-button dialogs are not yet available. This prevents implementation of the common UI pattern "Your file is unmodified, do you want to save before exiting?" with the options: Yes, No, Cancel.
- Tauri. Preventing exit without save on MacOS is stalled because of [this issue](https://github.com/tauri-apps/tauri/issues/9198).

# Developers

```bash
cd electron
npm i
npm run dev
```

or

```bash
cd tauri
npm i
npm run tauri dev
```

to build Electron

### Build

```bash
npm run build
npm run build:win
npm run build:mac
npm run build:linux
```

# License

GPLv3
