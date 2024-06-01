<script lang="ts">
	import {
		OpenFile,
	} from "../stores/File.ts";
</script>

<div>
	<span>Drag and drop a file, or </span>
	<button onclick={OpenFile}>Load file</button>
</div>

<style>
	div {
		margin: 1rem 0;
	}
</style>
