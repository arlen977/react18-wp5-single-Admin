import React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/frame/app/App";
import "./assets/css/common.less";
import "@/utils/setFontSize.js";
import "@/utils/i18n";

const container = document.getElementById("root");
const root = createRoot(container); // TypeScript 使用 createRoot(container!)
root.render(<App tab="root" />);
