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
import { LoadingScreen } from "./components/LoadingScreen";
import { useFinanceStore } from "./store/useFinanceStore";
import { setupAuthDebug } from "./utils/debugAuth";
import { IndexedDBErrorBoundary } from "./components/IndexedDBErrorBoundary";
import { MemoryManager } from "./utils/memoryCleanup";
import { dynamicMemoryManager } from "./utils/dynamicMemoryManager";
import { AdaptiveComponentLoader } from "./components/AdaptiveComponentLoader";
import { environment } from "./utils/environment";

function AppContent() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarWidth, setSidebarWidth] = useState(240); // Smaller default width (was 288px)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useFinanceStore();

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

  // Dynamic memory management
  useEffect(() => {
    // Register app component with dynamic memory manager
    dynamicMemoryManager.registerComponent('app-root', 'critical');
    
    // Enhanced memory monitoring with adaptive allocation
    const memoryCheckInterval = setInterval(() => {
      const { percentage, shouldCleanup } = MemoryManager.checkMemoryUsage();
      const memoryStats = dynamicMemoryManager.getMemoryStats();
      
      if (shouldCleanup) {
        console.warn(`High memory usage detected: ${percentage.toFixed(1)}%`);
        console.log('Memory stats:', memoryStats);
        MemoryManager.emergencyCleanup();
        
        // Request garbage collection through dynamic memory manager
        dynamicMemoryManager.requestGarbageCollection();
      }
      
      // Log memory stats in development
      if (environment.isDevelopment) {
        console.log('Dynamic memory allocation stats:', {
          pressure: memoryStats.pressure.level,
          cacheSize: `${(memoryStats.cacheSize / 1024 / 1024).toFixed(2)}MB`,
          activeComponents: memoryStats.activeComponents,
          batchSize: memoryStats.strategy.batchSize
        });
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(memoryCheckInterval);
      dynamicMemoryManager.unregisterComponent('app-root');
    };
  }, []);

  // Show loading screen while data is being loaded
  // MOVED AFTER all hooks to prevent hook order violations
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Update access for current view (moved outside renderContent)
  useEffect(() => {
    dynamicMemoryManager.updateComponentAccess(`page-${currentView}`);
  }, [currentView]);

  const renderContent = () => {
    // Dynamic component loading based on memory allocation
    const memoryPressure = dynamicMemoryManager.getMemoryPressure();
    const isLowMemory = memoryPressure.level === 'high' || memoryPressure.level === 'critical';

    const ComponentWrapper = ({ children, componentId, priority = 'medium' }: { 
      children: React.ReactNode; 
      componentId: string; 
      priority?: 'critical' | 'high' | 'medium' | 'low';
    }) => (
      <AdaptiveComponentLoader 
        componentId={componentId} 
        priority={priority}
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse space-y-4 w-full max-w-md">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        }
      >
        {children}
      </AdaptiveComponentLoader>
    );

    switch (currentView) {
      case "dashboard":
        return (
          <ComponentWrapper componentId="dashboard-page" priority="high">
            <DashboardPage onNavigate={setCurrentView} />
          </ComponentWrapper>
        );
      case "banking":
        return (
          <ComponentWrapper componentId="banking-page" priority="high">
            <BankingPage />
          </ComponentWrapper>
        );
      case "calendar":
        return (
          <ComponentWrapper componentId="calendar-page" priority={isLowMemory ? 'low' : 'medium'}>
            <CalendarPage />
          </ComponentWrapper>
        );
      case "assets":
        return (
          <ComponentWrapper componentId="assets-page" priority="medium">
            <AssetsPage />
          </ComponentWrapper>
        );
      case "liabilities":
        return (
          <ComponentWrapper componentId="liabilities-page" priority="medium">
            <LiabilitiesPage setCurrentView={setCurrentView} />
          </ComponentWrapper>
        );
      case "inventory":
        return (
          <ComponentWrapper componentId="inventory-page" priority={isLowMemory ? 'low' : 'medium'}>
            <InventoryPage />
          </ComponentWrapper>
        );
      case "receipts":
        return (
          <ComponentWrapper componentId="receipts-page" priority={isLowMemory ? 'low' : 'medium'}>
            <ReceiptsPage />
          </ComponentWrapper>
        );
      case "goals":
        return (
          <ComponentWrapper componentId="goals-page" priority="medium">
            <GoalsPage />
          </ComponentWrapper>
        );
      case "settings":
        return (
          <ComponentWrapper componentId="settings-page" priority="high">
            <SettingsPage />
          </ComponentWrapper>
        );
      default:
        return (
          <ComponentWrapper componentId="dashboard-page" priority="high">
            <DashboardPage onNavigate={setCurrentView} />
          </ComponentWrapper>
        );
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
            isCollapsed={sidebarWidth < 180}
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
    
    // Only register service worker in production and if supported
    if (environment.isProduction && 'serviceWorker' in navigator) {
      // Conditional service worker registration to avoid 404 errors
      fetch('/sw.js', { method: 'HEAD' })
        .then(() => {
          // Service worker file exists, safe to register
          import('./utils/serviceWorkerUtils').then(({ autoRegisterServiceWorker }) => {
            autoRegisterServiceWorker().then(() => {
              console.log('✅ Service worker registered');
            }).catch(error => {
              console.warn('⚠️ Service worker registration failed:', error);
            });
          });
        })
        .catch(() => {
          // Service worker file doesn't exist, skip registration
          console.log('ℹ️ Service worker not available, running without offline support');
        });
    }
  }, []);

  return (
    <IndexedDBErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </IndexedDBErrorBoundary>
  );
}