import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style/index.css";

document.body.innerHTML = '<div id="root"></div>';
const root = createRoot(document.getElementById("root") as HTMLDivElement);

// @ts-ignore
root.render(<App />);
