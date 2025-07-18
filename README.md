# Electron / Tauri document app

A **document app** is an app whose sole purpose is to edit a file; the name comes from the MacOS app class name. This app is able to open and modify a file (a text file in this case), or start a new file from scratch. The app provides the typical UI expected in this case like prompting before exiting an unsaved file and prompting before overwriting.

This project exists in two implementations, one in [Electron](https://www.electronjs.org/), one in [Tauri](https://tauri.app/), the app itself is cross-platform (Windows, Mac, Linux), both app's front ends are built in Svelte 5 using the new runes system (at this time, in release-candidate phase).

Use this as a foundation and build your app on top of it.

# Usage

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
