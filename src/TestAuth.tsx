import React from "react";
import ReactDOM from "react-dom/client";
import { AuthPage } from "./components/ui/Auth/AuthPage"; 

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthPage />
  </React.StrictMode>
);