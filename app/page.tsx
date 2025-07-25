'use client';

import React, { Suspense, useState } from 'react';
import { LiveAPIProvider } from '@/contexts/LiveAPIProvider';

// Lazy load components for better performance
const ControlPanel = React.lazy(() => import('@/components/interface/ControlPanel'));
const LogsPanel = React.lazy(() => import('@/components/interface/LogsPanel'));
const MainInterface = React.lazy(() => import('@/components/interface/MainInterface'));
const ConnectionStatus = React.lazy(() => import('@/components/interface/ConnectionStatus'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

export default function LiveAPIConsole() {
  const [showConsole, setShowConsole] = useState(true);
  const [showLogs, setShowLogs] = useState(false);

  return (
    <LiveAPIProvider>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Left Panel - Controls */}
        <Suspense fallback={<div className="w-80 bg-black animate-pulse" />}>
          <ControlPanel 
            onToggleConsole={setShowConsole}
            showConsole={showConsole}
          />
        </Suspense>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<div className="h-16 bg-gray-800 animate-pulse" />}>
            <ConnectionStatus 
              onToggleLogs={setShowLogs}
              showLogs={showLogs}
            />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <MainInterface />
          </Suspense>
        </div>

        {/* Right Panel - Logs (only when toggled) */}
        {showLogs && (
          <Suspense fallback={<div className="w-96 bg-black animate-pulse" />}>
            <LogsPanel onClose={() => setShowLogs(false)} />
          </Suspense>
        )}
      </div>
    </LiveAPIProvider>
  );
}
