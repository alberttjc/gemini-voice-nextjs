'use client';

/**
 * Voice Audio Test Component with FULL bidirectional audio support
 * Voice input + Audio output responses
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { GenAILiveClient } from '@/lib/genai-live-client';
import { AudioRecorder } from '@/lib/audio-recorder';
import { AudioStreamer } from '@/lib/audio-streamer';
import { initializeAudio, setupAutoAudioInit } from '@/lib/audio-init';
import { audioContext } from '@/lib/audio-utils';
import VolMeterWorket from '@/lib/worklets/vol-meter';
import { Modality } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "error" | "warning" | "success";
  message: string;
  data?: any;
}

interface VoiceAudioTestComponentProps {
  apiKey: string;
}

export default function VoiceAudioTestComponent({ apiKey }: VoiceAudioTestComponentProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [selectedModel, setSelectedModel] = useState('models/gemini-2.0-flash-exp');
  const [audioEnabled, setAudioEnabled] = useState(true); // Default to audio like working project
  
  // Refs for audio and client management
  const clientRef = useRef<GenAILiveClient | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  // Available models that support different features
  const availableModels = [
    { 
      value: 'models/gemini-2.0-flash-exp', 
      label: 'Gemini 2.0 Flash Exp (Text Only)', 
      audioOutput: false 
    },
    { 
      value: 'models/gemini-2.0-flash-exp', 
      label: 'Gemini 2.0 Flash Exp (Audio)',
      audioOutput: true 
    },
    { 
      value: 'models/gemini-2.5-flash-preview-native-audio-dialog', 
      label: 'Gemini 2.5 Native Audio Dialog (Full Audio)', 
      audioOutput: true 
    },
  ];

  const currentModel = availableModels.find(m => m.value === selectedModel);

  // Add a log entry
  const addLog = useCallback((type: LogEntry["type"], message: string, data?: any) => {
    const newLog: LogEntry = {
      id: uuidv4(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data,
    };
    setLogs((prevLogs) => {
      const maxLogs = 100;
      const newLogs = [...prevLogs, newLog];
      return newLogs.length > maxLogs ? newLogs.slice(-maxLogs) : newLogs;
    });
    console.log({ type, message, data });
  }, []);

  // Initialize audio components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize AudioRecorder for input
      audioRecorderRef.current = new AudioRecorder(16000);
      
      // Initialize AudioStreamer for output
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        
        // Try to add volume monitoring worklet
        audioStreamerRef.current
          .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
            setOutputVolume(ev.data.volume * 100);
          })
          .then(() => {
            addLog("success", "Audio components with volume monitoring initialized");
          })
          .catch((err) => {
            addLog("warning", "Audio component initialized but volume monitoring failed", err);
            addLog("success", "Audio output will still work without volume monitoring");
          });
      }).catch((err) => {
        addLog("error", "Failed to initialize audio components", err);
      });
    }
    
    return () => {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };
  }, [addLog]);

  // Handle audio recording events
  useEffect(() => {
    const audioRecorder = audioRecorderRef.current;
    if (!audioRecorder) return;

    const handleAudioData = (base64Data: string) => {
      if (isConnected && !isMuted && clientRef.current) {
        clientRef.current.sendRealtimeInput([
          {
            mimeType: "audio/pcm;rate=16000",
            data: base64Data,
          },
        ]);
      }
    };

    const handleVolumeChange = (volume: number) => {
      setInputVolume(volume * 100);
    };

    audioRecorder.on('data', handleAudioData);
    audioRecorder.on('volume', handleVolumeChange);

    return () => {
      audioRecorder.off('data', handleAudioData);
      audioRecorder.off('volume', handleVolumeChange);
    };
  }, [isConnected, isMuted]);

  // Connection logic with audio support
  const connectToGemini = useCallback(async () => {
    setIsLoading(true);
    addLog("info", `🔄 Attempting to connect to ${currentModel?.label}...`);
    
    const audioInitialized = await initializeAudio();
    if (!audioInitialized) {
      addLog("warning", "Could not initialize audio context");
    }

    try {
      const connectionConfig = {
        apiKey: apiKey,
        debug: true,
        maxReconnects: 20,
        maxAttempts: 15,
      };

      clientRef.current = new GenAILiveClient(connectionConfig);

      // Set up event handlers
      clientRef.current.on("open", () => {
        setIsConnected(true);
        const newSessionId = `session_${Date.now()}`;
        setSessionId(newSessionId);
        addLog("success", `✅ Connected to ${currentModel?.label} - Session: ${newSessionId}`);
      });

      clientRef.current.on("close", (event) => {
        setIsConnected(false);
        addLog("warning", "❌ Connection closed", { 
          code: event?.code, 
          reason: event?.reason || 'Unknown' 
        });
      });

      clientRef.current.on("error", (error) => {
        addLog("error", "Connection error", { 
          message: error.message || 'Unknown error'
        });
      });

      clientRef.current.on("setupcomplete", () => {
        addLog("success", "🎉 Setup completed - ready for voice conversation!");
      });

      clientRef.current.on("content", (content) => {
        if (content.modelTurn?.parts) {
          content.modelTurn.parts.forEach((part: any) => {
            if (part.text) {
              addLog("success", `🤖 Gemini (text): ${part.text}`);
              setTranscript((prev) => prev + `\nGemini: ${part.text}\n`);
            }
          });
        }
      });

      // Handle audio responses (exactly like working project)
      clientRef.current.on("audio", (audioData: ArrayBuffer) => {
        addLog("success", `🔊 Received audio response: ${audioData.byteLength} bytes`);
        
        // Use same audio playback approach as working project
        if (audioStreamerRef.current) {
          audioStreamerRef.current.addPCM16(new Uint8Array(audioData));
          addLog("success", "🎵 Playing audio response (AudioStreamer)");
        } else {
          addLog("error", "AudioStreamer not available - audio won't play");
        }
      });

      // Build configuration EXACTLY like the working project
      const config: any = {
        systemInstruction: {
          parts: [{ 
            text: audioEnabled 
              ? "You are a helpful assistant. You can receive voice input and should respond with audio. Keep your responses concise and friendly. Use a natural, conversational tone when speaking."
              : "You are a helpful assistant. You can receive voice input but will respond with text only. Keep your responses concise and friendly."
          }],
        },
        // Use EXACT structure from working project
        responseModalities: [audioEnabled ? Modality.AUDIO : Modality.TEXT],
        
        // Configure speech DIRECTLY on config object (not nested in generationConfig)
        ...(audioEnabled && {
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede",
              },
            },
          },
        }),
      };

      addLog("info", "Configuration being sent (matching working project):", {
        model: selectedModel,
        responseModalities: config.responseModalities,
        modalityEnum: audioEnabled ? 'Modality.AUDIO' : 'Modality.TEXT',
        hasSpeechConfig: !!config.speechConfig,
        voiceName: config.speechConfig?.voiceConfig?.prebuiltVoiceConfig?.voiceName,
        audioEnabled: audioEnabled,
        configStructure: Object.keys(config)
      });

      const success = await clientRef.current.connect(selectedModel, config);
      if (success) {
        addLog("success", "Connected successfully with working project config!", {
          model: selectedModel,
          audioEnabled: audioEnabled,
          modalityUsed: audioEnabled ? 'Modality.AUDIO' : 'Modality.TEXT',
          expectingAudioResponses: audioEnabled
        });
      } else {
        addLog("warning", "Initial connection failed, retrying...");
      }

    } catch (error) {
      addLog("error", "Failed to connect", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, selectedModel, audioEnabled, addLog]);

  // Disconnect function
  const disconnectFromGemini = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
      setIsConnected(false);
      setSessionId("");
      addLog("info", "🔄 Disconnected");
    }
  }, [addLog]);

  // Recording toggle
  const toggleRecording = useCallback(async () => {
    const audioRecorder = audioRecorderRef.current;
    if (!audioRecorder) {
      addLog("error", "AudioRecorder not initialized");
      return;
    }

    if (!isRecording) {
      if (!isConnected) {
        addLog("error", "Must be connected to use voice recording");
        return;
      }

      try {
        await audioRecorder.start();
        setIsRecording(true);
        addLog("success", "🎤 Voice recording started");
        
      } catch (error) {
        addLog("error", "Failed to start recording", {
          error: error || String(error),
        });
      }
    } else {
      audioRecorder.stop();
      setIsRecording(false);
      setInputVolume(0);
      addLog("info", "🎤 Recording stopped");
    }
  }, [isRecording, isConnected, addLog]);

  // Send text message
  const sendTextMessage = useCallback(() => {
    if (!clientRef.current || !isConnected || !message.trim()) {
      return;
    }

    clientRef.current.send([{ text: message }], true);
    addLog("info", "Sent text message", { content: message });
    setTranscript((prev) => prev + `\nUser: ${message}\n`);
    setMessage("");
  }, [clientRef, isConnected, message, addLog]);

  // Setup on mount
  useEffect(() => {
    setupAutoAudioInit();
    addLog("info", "Voice Audio Test Component initialized");
    
    return () => {
      disconnectFromGemini();
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };
  }, [disconnectFromGemini, addLog]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && isRecording) {
      toggleRecording();
    }
  };

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error": return "text-red-600";
      case "warning": return "text-yellow-600";
      case "success": return "text-green-600";
      default: return "text-blue-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Gemini Live API - Audio Response Test (Working Project Config)
        </h1>
        <p className="text-gray-600 mb-4">
          Using EXACT configuration from working live-api-web-console project for audio responses
        </p>
        
        {/* Audio Mode Selection (like working project settings) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Audio Configuration</h3>
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="responseMode"
                checked={audioEnabled}
                onChange={() => setAudioEnabled(true)}
                disabled={isConnected}
                className="text-blue-600"
              />
              <span className="font-medium text-blue-800">🔊 Audio Responses (Default in working project)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="responseMode"
                checked={!audioEnabled}
                onChange={() => setAudioEnabled(false)}
                disabled={isConnected}
                className="text-blue-600"
              />
              <span className="font-medium text-gray-600">📝 Text Only</span>
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            The working project defaults to audio mode. Try with audio enabled first.
          </p>
        </div>
        
        {/* Model Selection - Simplified */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Model Selection</h3>
          <div className="space-y-2">
            {availableModels.map((model) => (
              <label key={model.value} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50">
                <input
                  type="radio"
                  name="model"
                  value={model.value}
                  checked={selectedModel === model.value}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isConnected}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{model.label}</div>
                  <div className={`text-sm ${model.audioOutput ? 'text-green-600' : 'text-gray-500'}`}>
                    {model.audioOutput ? '🔊 Supports Audio Output' : '📝 Text Output Only'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Select a model before connecting. Models with audio support will provide voice responses.
          </p>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          {audioEnabled && (
            <div className={`text-xs px-2 py-1 rounded bg-green-100 text-green-700`}>
              🔊 Audio Mode: Modality.AUDIO
            </div>
          )}
          
          {!audioEnabled && (
            <div className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-700`}>
              📝 Text Mode: Modality.TEXT
            </div>
          )}
          
          {sessionId && (
            <div className="text-xs text-gray-500">
              Session: {sessionId}
            </div>
          )}
          
          {!isConnected ? (
            <button
              onClick={connectToGemini}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          ) : (
            <button
              onClick={disconnectFromGemini}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Voice Controls */}
        {isConnected && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Voice Interaction
              {audioEnabled && <span className="text-green-600 text-sm"> (Matching Working Project Config)</span>}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Input Controls */}
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-700 mb-2">🎤 Voice Input</h4>
                <div className="space-y-2">
                  <button
                    onClick={toggleRecording}
                    disabled={isMuted}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium ${
                      isRecording
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    } disabled:opacity-50`}
                  >
                    <span>{isRecording ? '🔴' : '🎤'}</span>
                    <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Input Volume:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-100"
                        style={{ width: `${Math.min(inputVolume, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={toggleMute}
                    className={`w-full px-3 py-1 rounded text-sm ${
                      isMuted
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {isMuted ? '🔇 Unmute' : '🔊 Mute'}
                  </button>
                </div>
              </div>

              {/* Output Controls */}
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-700 mb-2">🔊 Audio Output</h4>
                <div className="space-y-2">
                  <div className={`p-2 rounded text-sm text-center ${
                    audioEnabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {audioEnabled 
                      ? '✅ Audio responses enabled (Modality.AUDIO)' 
                      : '❌ Text responses only (Modality.TEXT)'
                    }
                  </div>
                  
                  {audioEnabled && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Output Volume:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-100"
                          style={{ width: `${Math.min(outputVolume, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {audioEnabled 
                      ? 'Gemini should speak back using Aoede voice'
                      : 'Text responses only - enable audio mode for voice'
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recording Status */}
            <div className={`flex items-center justify-center space-x-2 p-3 rounded ${
              isRecording ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isRecording ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className="font-medium">
                {isRecording ? 'Recording Active - Speak Now!' : 'Not Recording'}
              </span>
            </div>
          </div>
        )}

        {/* Text Input Fallback */}
        {isConnected && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💬 Text Input (Backup)</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message to test text interaction..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendTextMessage}
                disabled={!message.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Conversation Log</h3>
            <div className="bg-gray-100 rounded-md p-4 max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{transcript}</pre>
            </div>
            <button
              onClick={() => setTranscript('')}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear transcript
            </button>
          </div>
        )}

        {/* Instructions */}
        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">How to Test Audio Responses (Based on Working Project):</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Keep "Audio Responses" selected (default in working project)</li>
              <li>Use "models/gemini-2.0-flash-exp" (same as working project)</li>
              <li>Click "Connect" and wait for setup completion</li>
              <li>Click "Start Recording" and speak to Gemini</li>
              <li>Listen for audio responses with Aoede voice!</li>
              <li>Check logs for "Received audio response" and "Playing audio response"</li>
            </ol>
          </div>
        )}
      </div>

      {/* Activity Logs */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">🔍 Connection & Audio Logs</h2>
        <div className="bg-white rounded border max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No activity yet. Connect to start seeing logs.
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">{log.timestamp}</span>
                    <span className={getLogColor(log.type)}>{log.type}</span>
                  </div>
                  <p className="text-gray-700">{log.message}</p>
                  {log.data && (
                    <details className="mt-1">
                      <summary className="text-gray-400 cursor-pointer">Details</summary>
                      <pre className="text-xs mt-1 p-1 bg-gray-100 rounded overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
          {logs.length > 0 && (
            <div className="p-2 border-t">
              <button
                onClick={() => setLogs([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear logs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
