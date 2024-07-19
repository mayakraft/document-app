<script lang="ts">
	import {
		openFile,
		saveFile,
		saveFileAs,
	} from "../stores/File.ts";
</script>

<div>
	<span>Drag and drop a file, or </span>
	<button onclick={openFile}>Load file</button>
	<button onclick={saveFile}>Save File</button>
	<button onclick={saveFileAs}>Save File As</button>
</div>

<style>
	div {
		margin: 1rem 0;
	}
</style>
