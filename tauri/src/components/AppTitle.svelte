<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { getAppTitle } from "../state/app.svelte.ts";

  // cache the current title of the app window
  let previousAppTitle = "";

  /**
   * @description update the system app title name to include the file name
   * and the asterisk indicator if the file has unsaved changes; but only
   * send an update if the desired and the current titles differ.
   */
  $effect(() => {
    if (getAppTitle() === previousAppTitle) {
      return;
    }
    previousAppTitle = getAppTitle();
    getCurrentWindow().setTitle(getAppTitle());
  });
</script>
