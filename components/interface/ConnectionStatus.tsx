'use client';

/**
 * Optimized Connection Status Component
 * Minimal header showing connection state and session info
 */

import React, { memo } from 'react';
import { useLiveAPI } from '@/contexts/LiveAPIProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface ConnectionStatusProps {
  onToggleLogs?: (show: boolean) => void;
  showLogs?: boolean;
}

const ConnectionStatus = memo(({ onToggleLogs, showLogs = false }: ConnectionStatusProps) => {
  const { state } = useLiveAPI();

  return (
    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex gap-2 items-center">
          <Badge variant={state.isConnected ? "default" : "destructive"}>
            {state.isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Badge variant="default" className="text-xs">
            {state.audioEnabled ? '🔊 Audio' : '📝 Text'}
          </Badge>
          {state.sessionId && (
            <Badge variant="default" className="text-xs">
              {state.sessionId}
            </Badge>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-gray-400 hover:text-white ${
          showLogs ? 'text-blue-400' : ''
        }`}
        onClick={() => onToggleLogs?.(!showLogs)}
        title={showLogs ? "Hide logs panel" : "Show logs panel"}
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';

export default ConnectionStatus;
