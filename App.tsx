import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Sidebar } from "./components/finance-sidebar";
import {
  DashboardPage,
  BankingPage,
  CalendarPage,
  AssetsPage,
  LiabilitiesPage,
  InventoryPage,
  ReceiptsPage,
  SettingsPage,
  GoalsPage,
} from "./pages";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./components/AuthProvider";
import { setupAuthDebug } from "./utils/debugAuth";

function AppContent() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarWidth, setSidebarWidth] = useState(240); // Smaller default width (was 288px)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      // Set minimum and maximum width constraints
      const minWidth = 180;
      const maxWidth = 400;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse events
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentView} />;
      case "banking":
        return <BankingPage />;
      case "calendar":
        return <CalendarPage />;
      case "assets":
        return <AssetsPage />;
      case "liabilities":
        return (
          <LiabilitiesPage setCurrentView={setCurrentView} />
        );
      case "inventory":
        return <InventoryPage />;
      case "receipts":
        return <ReceiptsPage />;
      case "goals":
        return <GoalsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Resizable Sidebar */}
      <div
        ref={sidebarRef}
        className="relative hidden md:flex bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="w-full">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={sidebarWidth < 200}
          />
        </div>

        {/* Drag Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-slate-300 dark:bg-slate-700/50 hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-8 bg-slate-300 dark:bg-slate-700 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-0.5 h-4 bg-slate-500 dark:bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (unchanged) */}
      <div className="md:hidden transition-all duration-300">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      <main className="flex-1 overflow-hidden">
        <div className="h-full">{renderContent()}</div>
      </main>

      <Toaster />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    setupAuthDebug();
  }, []);

  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="finance-app-theme"
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}