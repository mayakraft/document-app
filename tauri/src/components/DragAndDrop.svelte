<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { getCurrentWebview } from "@tauri-apps/api/webview";
  import { dragOpenFile } from "../interface/drag.svelte.ts";

  let isHovering = $state(false);
  let unlisten: Function | undefined;

  onMount(async () => {
    await getCurrentWebview().onDragDropEvent(async (event) => {
      if (event.payload.type === "over") {
        // console.log("User hovering", event.payload.position);
        isHovering = true;
      } else if (event.payload.type === "drop") {
        // console.log("User dropped", event.payload.paths);
        isHovering = false;
        const filePaths = event.payload.paths;
        const filePath = filePaths[0];
        await dragOpenFile(filePath);
      } else {
        console.log("File drop cancelled");
        isHovering = false;
      }
    });
  });

  onDestroy(() => {
    if (unlisten !== undefined) {
      unlisten();
    }
    unlisten = undefined;
  })
</script>

<svelte:body {ondragenter} {ondragleave} {ondragover} {ondrop} />

<div class={isHovering ? "hovering" : ""}></div>

<!-- {#if isHovering}<div class="hovering"></div>{/if} -->

<style>
  div {
    width: 100vw;
    height: 100%;
    min-height: 100vh;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    outline: none;
    border: 3px solid transparent;
    background-color: transparent;
    border-radius: 0.25rem;
    transition: all 0.15s;
  }

  .hovering {
    background-color: #fff1;
    border-color: #fff;
  }
</style>

