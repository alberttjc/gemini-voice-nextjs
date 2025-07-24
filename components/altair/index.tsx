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

// Temporarily disabled - Schema import issue with @google/genai
// This component is for Altair chart tool calling and not essential for core functionality

// import { type FunctionDeclaration } from "@google/genai";
// import { useEffect, useRef, useState } from "react";
// import { useLiveAPI } from "@/contexts/LiveAPIProvider";
// import { ToolCall } from "@/lib/types";

/*
export const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: "object",
    properties: {
      json_graph: {
        type: "string",
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

export function Altair() {
  const [jsonString, setJSONString] = useState<string>("");
  const { clientRef } = useLiveAPI();
  
  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      systemInstruction: {
        parts: [
          {
            text: 'You are my helpful assistant. Any time I ask you for a graph call the "render_altair" function I have provided you. Don\'t ask for additional information just make your best judgement.',
          },
        ],
      },
      tools: [{ googleSearch: {} }, { functionDeclarations: [declaration] }],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const str = (fc.args as any).json_graph;
        setJSONString(str);
      }
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && embedRef.current && jsonString) {
      // Dynamically import vega-embed for client-side only usage
      import('vega-embed').then((vegaEmbed) => {
        vegaEmbed.default(embedRef.current!, JSON.parse(jsonString));
      }).catch(error => {
        console.error("Failed to load vega-embed:", error);
      });
    }
  }, [embedRef, jsonString]);

  return <div className="vega-embed" ref={embedRef} />;
}
*/

// Placeholder component to prevent build errors
export function Altair() {
  return (
    <div className="p-4 text-gray-400 text-center">
      <p>Altair component temporarily disabled</p>
      <p className="text-xs">Data visualization features will be restored in future update</p>
    </div>
  );
}
