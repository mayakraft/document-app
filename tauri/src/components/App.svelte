<script lang="ts">
  import AppTitle from "./AppTitle.svelte";
  import ButtonBar from "./ButtonBar.svelte";
  import TextArea from "./TextArea.svelte";
  import DragAndDrop from "./DragAndDrop.svelte";
</script>

<main>
  <AppTitle />
  <DragAndDrop />
  <ButtonBar />
  <TextArea />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    min-height: 100vh;
  }
</style>
