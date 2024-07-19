# Electron / Tauri document app

A **document app** is an app whose sole purpose is to edit a file; the name comes from the MacOS app class name. This app is able to open and modify a file (a text file in this case), or start a new file from scratch. The app provides the typical UI expected in this case like prompting before exiting an unsaved file and prompting before overwriting.

This project exists in two implementations, one in [Electron](https://www.electronjs.org/), one in [Tauri](https://tauri.app/), the app itself is cross-platform (Windows, Mac, Linux), the front end runs Svelte.

Use this as a foundation and build your app on top of it.

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

# License

GPLv3
