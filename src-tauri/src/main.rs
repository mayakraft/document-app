// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{ CustomMenuItem, Menu, MenuItem, Submenu, AboutMetadata };

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn custom_rust_fn(name: &str) -> String {
  format!("{}, This string was assembled in Rust", name)
}

fn main() {
	// MacOS app menu items
	let about_metadata = AboutMetadata::new();

	#[cfg(target_os = "macos")]
	let item_quit = CustomMenuItem::new(
		"quit".to_string(),
		"Quit")
		.accelerator("cmdOrControl+Q");

	let item_new = CustomMenuItem::new(
		"new".to_string(),
		"New")
		.accelerator("cmdOrControl+N");
	let item_open = CustomMenuItem::new(
		"open".to_string(),
		"Open")
		.accelerator("cmdOrControl+O");
	let item_save = CustomMenuItem::new(
		"save".to_string(),
		"Save")
		.accelerator("cmdOrControl+S");
	let item_save_as = CustomMenuItem::new(
		"save_as".to_string(),
		"Save As...")
		.accelerator("cmdOrControl+Shift+S");

	// menus
	#[cfg(target_os = "macos")]
	let menu_app = Submenu::new("tauri-doc-app", Menu::new()
		.add_native_item(MenuItem::About("tauri-doc-app".to_string(), about_metadata))
		.add_native_item(MenuItem::Separator)
		.add_native_item(MenuItem::Services)
		.add_native_item(MenuItem::Separator)
		.add_native_item(MenuItem::Hide)
		.add_native_item(MenuItem::HideOthers)
		.add_native_item(MenuItem::ShowAll)
		.add_native_item(MenuItem::Separator)
		.add_item(item_quit));
		// .add_native_item(MenuItem::Quit));
	let menu_file = Submenu::new("File", Menu::new()
		.add_item(item_new)
		.add_native_item(MenuItem::Separator)
		.add_item(item_open)
		.add_native_item(MenuItem::Separator)
		.add_item(item_save)
		.add_item(item_save_as));

	// the menu
	#[cfg(target_os = "macos")]
	let menu = Menu::new()
		.add_submenu(menu_app)
		.add_submenu(menu_file);
	#[cfg(not(target_os = "macos"))]
	let menu = Menu::new()
		.add_submenu(menu_file);

	tauri::Builder::default()
		.menu(menu)
		.invoke_handler(tauri::generate_handler![custom_rust_fn])
		.on_menu_event(|event| {
			match event.menu_item_id() {
				"quit" => {
					let _ = event.window().eval("window.quit()");
				}
				"new" => {
					let _ = event.window().eval("window.newFile()");
				}
				"open" => {
					let _ = event.window().eval("window.openFile()");
				}
				"save" => {
					let _ = event.window().eval("window.saveFile()");
				}
				"save_as" => {
					let _ = event.window().eval("window.saveFileAs()");
				}
				_ => {}
			}
		})
		.run(tauri::generate_context!())
    .expect("error while running tauri application");
}
