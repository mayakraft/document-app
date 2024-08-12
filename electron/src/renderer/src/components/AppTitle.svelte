<script lang="ts">
	import { APP_NAME, UNTITLED_FILENAME } from "../../../general/constants.ts";
	import { fileInfo, fileModified } from "../stores/file.svelte.ts";

	/**
	 * @description Watch "FilePath" for any changes, update the window title
	 * to include the currently opened filename.
	 */
	const appTitle = $derived.by<string>(() => {
		const displayName = fileInfo.value === undefined
			? UNTITLED_FILENAME
			: fileInfo.value.file;
		const savedIndicator = fileModified.value ? " *" : "";
		return `${APP_NAME} - ${displayName}${savedIndicator}`;
	});

	// cache the current title of the app window
	let previousAppTitle = "";

	/**
	 * @description update the system app title name to include the file name
	 * and the asterisk indicator if the file has unsaved changes; but only
	 * send an update if the desired and the current titles differ.
	 */
	$effect(() => {
		if (appTitle === previousAppTitle) {
			return;
		}
		previousAppTitle = appTitle;
		window.api.setAppTitle(appTitle);
	});
</script>
