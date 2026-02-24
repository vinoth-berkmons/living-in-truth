import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Apply dark theme before React renders to prevent flash
try {
  const stored = localStorage.getItem('lit-theme');
  if (stored) {
    const parsed = JSON.parse(stored);
    document.documentElement.classList.toggle('dark', parsed.state?.isDark ?? true);
  } else {
    document.documentElement.classList.add('dark');
  }
} catch {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(
  <WorkspaceProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </WorkspaceProvider>
);
