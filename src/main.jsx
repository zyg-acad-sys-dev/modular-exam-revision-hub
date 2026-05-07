import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ContentProvider } from "./content/ContentProvider.jsx";
import { MemoryModeProvider } from "./content/MemoryModeProvider.jsx";
import { StudyProgressProvider } from "./content/StudyProgressProvider.jsx";
import { LanguageProvider } from "./content/LanguageProvider.jsx";
import { ThemeProvider } from "./content/ThemeProvider.jsx";
import App from "./App.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <ContentProvider>
          <ThemeProvider>
            <MemoryModeProvider>
              <StudyProgressProvider>
                <App />
              </StudyProgressProvider>
            </MemoryModeProvider>
          </ThemeProvider>
        </ContentProvider>
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
);
