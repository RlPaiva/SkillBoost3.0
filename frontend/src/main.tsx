import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// Observação: NÃO colocamos <BrowserRouter> aqui porque o App.tsx já
// contém um Router. Ter dois Routers causa o erro: "You cannot render a <Router> inside another <Router>".

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
