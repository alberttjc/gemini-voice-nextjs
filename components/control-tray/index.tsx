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

import { FC, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Video, VideoOff, Monitor, MonitorOff } from "lucide-react";
import { useWebcam } from "@/hooks/use-webcam";
import { useScreenCapture } from "@/hooks/use-screen-capture";
import { useLiveAPI } from "@/contexts/LiveAPIProvider";
import { AudioRecorder } from "@/lib/audio-recorder";

interface ControlTrayProps {
  className?: string;
}

export const ControlTray: FC<ControlTrayProps> = ({ className }) => {
  const [inputText, setInputText] = useState<string>("");
  const { state, clientRef, addLog } = useLiveAPI();
  const webcam = useWebcam();
  const screenCapture = useScreenCapture();
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (webcam.isStreaming) webcam.stop();
      if (screenCapture.isStreaming) screenCapture.stop();
      stopRecording();
    };
  }, []);

  const toggleMic = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    if (!state.isConnected) {
      addLog('error', 'Cannot start recording: Not connected to the API');
      return;
    }
    
    try {
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder();
      }
      
      audioRecorderRef.current.on("data", (base64Audio: string) => {
        if (state.isConnected && clientRef.current) {
          // Use the correct API method: sendRealtimeInput instead of sendAudio
          clientRef.current.sendRealtimeInput([{
            mimeType: "audio/pcm;rate=16000",
            data: base64Audio,
          }]);
        }
      });
      
      audioRecorderRef.current.on("volume", (volume: number) => {
        // You can use this volume data to update a UI element if needed
        // console.log("Audio volume:", volume);
      });
      
      await audioRecorderRef.current.start();
      setIsRecording(true);
      addLog('info', 'Started audio recording');
    } catch (error) {
      addLog('error', 'Failed to start recording', error);
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      setIsRecording(false);
      addLog('info', 'Stopped audio recording');
    }
  };

  const toggleWebcam = async () => {
    try {
      if (webcam.isStreaming) {
        webcam.stop();
        addLog('info', 'Webcam stopped');
      } else {
        await webcam.start();
        addLog('info', 'Webcam started');
        // Note: Video frames are automatically processed by useVideoFrameProcessor
        // No need to manually send video stream to client
      }
    } catch (error) {
      addLog('error', 'Failed to toggle webcam', error);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (screenCapture.isStreaming) {
        screenCapture.stop();
        addLog('info', 'Screen sharing stopped');
      } else {
        await screenCapture.start();
        addLog('info', 'Screen sharing started');
        // Note: Video frames are automatically processed by useVideoFrameProcessor
        // No need to manually send video stream to client
      }
    } catch (error) {
      addLog('error', 'Failed to toggle screen sharing', error);
    }
  };

  const sendMessage = () => {
    if (!state.isConnected || !inputText.trim()) return;
    
    try {
      if (clientRef.current) {
        // Use the correct API method: send instead of sendText
        clientRef.current.send([{ text: inputText }], true);
        addLog('info', 'Text message sent', { content: inputText });
        setInputText("");
      }
    } catch (error) {
      addLog('error', 'Failed to send text message', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex flex-col space-y-4 ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          disabled={!state.isConnected}
          onClick={toggleMic}
          className="rounded-full h-10 w-10"
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant={webcam.isStreaming ? "destructive" : "outline"}
          disabled={!state.isConnected || screenCapture.isStreaming}
          onClick={toggleWebcam}
          className="rounded-full h-10 w-10"
        >
          {webcam.isStreaming ? <VideoOff size={20} /> : <Video size={20} />}
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant={screenCapture.isStreaming ? "destructive" : "outline"}
          disabled={!state.isConnected || webcam.isStreaming}
          onClick={toggleScreenShare}
          className="rounded-full h-10 w-10"
        >
          {screenCapture.isStreaming ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </Button>
        
        <div className="flex-1">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!state.isConnected}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              disabled={!state.isConnected || !inputText.trim()}
              onClick={sendMessage}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
