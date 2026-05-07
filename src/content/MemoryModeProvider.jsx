import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const MemoryModeContext = createContext(null);

const defaultMode = {
  focusMode: false,
  reduceMotion: false,
  compactCards: false,
  activeWeekTab: "map"
};

export function MemoryModeProvider({ children }) {
  const [mode, setMode] = useLocalStorage("modular-exam-revision-mode", defaultMode);

  const api = useMemo(() => {
    function setModeKey(key, value) {
      setMode((prev) => ({ ...defaultMode, ...prev, [key]: value }));
    }

    function toggle(key) {
      setMode((prev) => ({ ...defaultMode, ...prev, [key]: !prev?.[key] }));
    }

    return {
      mode: { ...defaultMode, ...mode },
      setModeKey,
      toggle
    };
  }, [mode, setMode]);

  return (
    <MemoryModeContext.Provider value={api}>
      {children}
    </MemoryModeContext.Provider>
  );
}

export function useMemoryMode() {
  const ctx = useContext(MemoryModeContext);
  if (!ctx) throw new Error("useMemoryMode must be used inside MemoryModeProvider");
  return ctx;
}
