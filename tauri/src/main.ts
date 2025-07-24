import { mount } from "svelte";
import "./system/menu";
import "./css/reset.css";
import "./css/app.css";
import App from "./components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
