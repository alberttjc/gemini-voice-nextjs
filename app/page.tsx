'use client';

import React, { Suspense, useState } from 'react';
import { LiveAPIProvider } from '@/contexts/LiveAPIProvider';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';

// Lazy load components for better performance
const ConsolePanel = React.lazy(() => import('@/components/interface/ConsolePanel'));
const MainInterface = React.lazy(() => import('@/components/interface/MainInterface'));
const ConnectionStatus = React.lazy(() => import('@/components/interface/ConnectionStatus'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

export default function LiveAPIConsole() {
  const [showConsole, setShowConsole] = useState(true);

  return (
    <LiveAPIProvider>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Console Panel */}
        {showConsole ? (
          <Suspense fallback={<div className="w-80 bg-black animate-pulse" />}>
            <ConsolePanel onToggleConsole={setShowConsole} />
          </Suspense>
        ) : (
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsole(true)}
              className="text-gray-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
              Console
            </Button>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<div className="h-16 bg-gray-800 animate-pulse" />}>
            <ConnectionStatus />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <MainInterface />
          </Suspense>
        </div>
      </div>
    </LiveAPIProvider>
  );
}
