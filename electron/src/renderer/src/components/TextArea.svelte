<script lang="ts">
	import { Model } from "../stores/Model.ts";
	import { FileModified } from "../stores/File.ts";

	const oninput = () => $FileModified = true;
</script>

<textarea bind:value={$Model} {oninput}></textarea>

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
