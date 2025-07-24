'use client';

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FC, useEffect, useRef } from "react";
import { useLoggerStore, StreamingLog } from "@/lib/store-logger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

interface LoggerProps {
  className?: string;
}

export const Logger: FC<LoggerProps> = ({ className }) => {
  const { logs, clearLogs } = useLoggerStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-sm font-medium">Activity Log</h3>
        <Button variant="ghost" size="sm" onClick={clearLogs}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {logs.map((log, i) => (
            <LogEntry key={i} log={log} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

const LogEntry: FC<{ log: StreamingLog }> = ({ log }) => {
  const getBadgeVariant = (type: StreamingLog['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline'; // Map warning to outline variant
      case 'success':
        return 'default'; // Map success to default variant
      case 'info':
      default:
        return 'secondary';
    }
  };

  const getBadgeStyle = (type: StreamingLog['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 text-yellow-400';
      case 'success':
        return 'bg-green-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return '';
    }
  };

  const formattedTime = log.date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="text-xs border-b border-gray-800 pb-2 last:border-b-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-400">{formattedTime}</span>
        <Badge 
          variant={getBadgeVariant(log.type)} 
          className={`px-1.5 py-0 text-[10px] ${getBadgeStyle(log.type)}`}
        >
          {log.type}
        </Badge>
        {log.count && log.count > 1 && (
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            x{log.count}
          </Badge>
        )}
      </div>
      <p className="text-gray-300 break-words">{log.message}</p>
      {log.data && (
        <pre className="mt-1 p-1 text-[10px] bg-gray-900 rounded overflow-auto max-h-24">
          {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
        </pre>
      )}
    </div>
  );
};
