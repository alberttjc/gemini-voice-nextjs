'use client';

/**
 * Optimized Console Panel - Extracted from monolithic component
 * Memoized for performance with proper dependency arrays
 */

import React, { memo, useMemo } from 'react';
import { useLiveAPI } from '@/contexts/LiveAPIProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minimize2 } from 'lucide-react';

interface ConsolePanelProps {
  onToggleConsole?: (show: boolean) => void;
}

const LogEntry = memo(({ log }: { log: any }) => {
  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="text-xs border-b border-gray-800 pb-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-500">{log.timestamp}</span>
        <span className={getLogColor(log.type)}>{log.type}</span>
      </div>
      <p className="text-gray-300">{log.message}</p>
      {log.data && (
        <details className="mt-1">
          <summary className="text-gray-400 cursor-pointer">Details</summary>
          <pre className="text-xs mt-1 p-1 bg-gray-800 rounded overflow-x-auto">
            {JSON.stringify(log.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
});

LogEntry.displayName = 'LogEntry';

const ConsolePanel = memo(({ onToggleConsole }: ConsolePanelProps) => {
  const {
    state,
    setApiKey,
    setModel,
    setSystemInstruction,
    setAudioEnabled,
    connect,
    disconnect,
    clearLogs,
  } = useLiveAPI();

  // Memoize filtered logs for performance
  const filteredLogs = useMemo(() => 
    state.logs.slice(-50), // Only show last 50 logs for performance
    [state.logs]
  );

  // Memoized handlers to prevent re-renders
  const handleConnect = useMemo(() => 
    state.isConnected ? disconnect : connect,
    [state.isConnected, connect, disconnect]
  );

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      console.log('✅ Microphone test successful');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('❌ Microphone test failed:', error);
    }
  };

  return (
    <div className="w-80 bg-black border-r border-gray-800 transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Console</h2>
          {onToggleConsole && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleConsole(false)}
              className="text-gray-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <Select value={state.selectedModel} onValueChange={setModel}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select model..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="models/gemini-2.0-flash-exp">
                Gemini 2.0 Flash Experimental
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="password"
            placeholder="Enter API Key"
            value={state.apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />

          <Textarea
            placeholder="System Instructions"
            value={state.systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
            rows={3}
          />

          <div className="flex items-center space-x-2">
            <Switch 
              id="audio-enabled" 
              checked={state.audioEnabled} 
              onCheckedChange={setAudioEnabled}
              disabled={state.isConnected}
            />
            <Label htmlFor="audio-enabled">
              {state.audioEnabled ? '🔊 Audio Mode' : '📝 Text Mode'}
            </Label>
          </div>

          <Button
            onClick={handleConnect}
            variant={state.isConnected ? "destructive" : "default"}
            className="w-full"
          >
            {state.isConnected ? "Disconnect" : "Connect"}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={testMicrophone}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              🎤 Test Mic
            </Button>
            
            <Button
              onClick={clearLogs}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Clear Logs
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ConsolePanel.displayName = 'ConsolePanel';

export default ConsolePanel;
