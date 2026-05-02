import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#10101F",
            color: "#F0F0FF",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "12px",
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "0.875rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
          },
          success: { iconTheme: { primary: "#10B981", secondary: "#030305" } },
          error: { iconTheme: { primary: "#F43F5E", secondary: "#030305" } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
