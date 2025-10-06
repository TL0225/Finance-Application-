/// <reference types="vite/client" />

// Extend Window interface for debug functions
interface Window {
  debugAuth: () => void;
  clearAllProfiles: () => void;
  forceLogout: () => void;
  electronAPI?: {
    saveData: (data: string) => Promise<{ success: boolean }>;
    loadData: () => Promise<string | null>;
    saveFile: (category: string, file: File) => Promise<string>;
    loadFile: (category: string, filename: string) => Promise<string>;
  };
}