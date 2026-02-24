import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <WorkspaceProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </WorkspaceProvider>
);
