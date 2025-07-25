"use client";

/**
 * Control Panel - Left sidebar with API controls only
 * Extracted from the monolithic ConsolePanel for better separation of concerns
 */

import React, { memo } from "react";
import { useLiveAPI } from "@/contexts/LiveAPIProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minimize2, Maximize2 } from "lucide-react";

interface ControlPanelProps {
  onToggleConsole?: (show: boolean) => void;
  showConsole?: boolean;
}

const ControlPanel = memo(({ 
  onToggleConsole, 
  showConsole = true
}: ControlPanelProps) => {
  const {
    state,
    setApiKey,
    setModel,
    setSystemInstruction,
  } = useLiveAPI();

  if (!showConsole) {
    return (
      <div className="p-4 bg-black border-r border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleConsole?.(true)}
          className="text-gray-400 hover:text-white flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          Console
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-black border-r border-gray-800 transition-all duration-300 flex flex-col">
      <div className="p-4 flex flex-col flex-1">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Controls</h2>
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

        {/* API Controls */}
        <div className="space-y-3 flex-1 flex flex-col">
          <div>
            <Label htmlFor="model-select" className="text-sm text-gray-300 mb-2 block">
              Model
            </Label>
            <Select value={state.selectedModel} onValueChange={setModel}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select model..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="models/gemini-2.0-flash-exp" className="bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700">
                  Gemini 2.0 Flash Experimental
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="api-key" className="text-sm text-gray-300 mb-2 block">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter API Key"
              value={state.apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex-1 flex flex-col pb-4">
            <Label htmlFor="system-instruction" className="text-sm text-gray-300 mb-2 block">
              System Instructions
            </Label>
            <Textarea
              id="system-instruction"
              placeholder="System Instructions"
              value={state.systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;