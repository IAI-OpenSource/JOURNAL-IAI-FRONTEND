import React from "react";
import ReactDOM from "react-dom/client";
import { AuthPage } from "./pages/AuthPage";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthPage />
  </React.StrictMode>
);