<script lang="ts">
	import { model } from "../stores/model.svelte.ts";
	import { fileModified } from "../stores/file.svelte.ts";

	const oninput = () => fileModified.value = true;
</script>

<textarea bind:value={model.value} {oninput}></textarea>

<style>
	textarea {
		font-family: monospace;
		color: #D7D9DA;
		width: 80%;
		min-height: 15rem;
		resize: vertical;
		font-size: 1rem;
		padding: 1rem;
		border: 2px solid #555;
		border-radius: 0.5rem;
		background-color: #2b2a33;
		outline: none;
	}
</style>
