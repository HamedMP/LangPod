"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Conversation as ConversationClient } from "@11labs/client";

// Define our own Message type based on the docs
interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

// More specific error types
type ConversationError =
  | { type: "MICROPHONE_ACCESS"; message: string }
  | { type: "CONNECTION"; message: string }
  | { type: "GENERAL"; message: string };

async function requestMicrophonePermission() {
  try {
    // First check if the browser supports getUserMedia
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error("Your browser doesn't support microphone access");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Important: Stop the stream immediately after permission check
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific permission errors
      if (
        (error as any).name === "NotAllowedError" ||
        (error as any).name === "PermissionDeniedError"
      ) {
        throw new Error(
          "Microphone access was denied. Please allow microphone access in your browser settings and try again."
        );
      } else if ((error as any).name === "NotFoundError") {
        throw new Error(
          "No microphone found. Please connect a microphone and try again."
        );
      }
    }
    throw error;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  if (data.error) {
    throw Error(data.error);
  }
  return data.signedUrl;
}

export function Conversation() {
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ConversationError | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<ConversationClient | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  async function startConversation() {
    setError(null);
    setIsLoading(true);

    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        throw new Error("Microphone permission denied");
      }

      const signedUrl = await getSignedUrl();

      const conv = await ConversationClient.startSession({
        signedUrl: signedUrl,
        onConnect: () => {
          setIsConnected(true);
          setIsSpeaking(true);
          setError(null);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsSpeaking(false);
        },
        onError: (error) => {
          setError({ type: "GENERAL", message: error.toString() });
          console.error("Conversation error:", error);
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === "speaking");
        },
      });

      setConversation(conv);

      // Set initial volume
      if (volume !== 0.5) {
        await conv.setVolume(volume);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setError({
        type:
          error instanceof Error && error.name === "NotAllowedError"
            ? "MICROPHONE_ACCESS"
            : "CONNECTION",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVolumeChange(value: number) {
    setVolume(value);
    await conversation?.setVolume(value);
  }

  async function endConversation() {
    if (!conversation) return;
    await conversation.endSession();
    setConversation(null);
  }

  return (
    <div className="flex justify-center items-center gap-x-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoading
              ? "Connecting..."
              : isConnected
                ? isSpeaking
                  ? "Agent is speaking"
                  : "Agent is listening"
                : "Disconnected"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-4 text-center">
            {/* Error display with specific handling */}
            {error && (
              <div className="text-red-500 text-sm px-4">
                {error.message}
                {error.type === "MICROPHONE_ACCESS" && (
                  <Button
                    variant="link"
                    className="text-blue-500 underline ml-1"
                    onClick={() => {
                      // Open browser settings for Chrome/Edge
                      if (navigator.userAgent.includes("Chrome")) {
                        window.open("chrome://settings/content/microphone");
                      }
                      // For Firefox
                      else if (navigator.userAgent.includes("Firefox")) {
                        window.open("about:preferences#privacy");
                      }
                      // For Safari
                      else if (navigator.userAgent.includes("Safari")) {
                        window.open(
                          "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone"
                        );
                      }
                    }}
                  >
                    Open browser settings
                  </Button>
                )}
              </div>
            )}

            <div
              className={cn(
                "orb my-16 mx-12",
                isSpeaking ? "animate-orb" : isConnected && "animate-orb-slow",
                isConnected ? "orb-active" : "orb-inactive"
              )}
            />

            {/* Volume control */}
            {isConnected && (
              <div className="px-4 py-2">
                <label className="text-sm text-gray-500">Volume</label>
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => handleVolumeChange(value)}
                />
              </div>
            )}

            <Button
              variant="outline"
              className="rounded-full"
              size="lg"
              disabled={isConnected || isLoading}
              onClick={startConversation}
            >
              {isLoading ? "Connecting..." : "Start conversation"}
            </Button>

            <Button
              variant="outline"
              className="rounded-full"
              size="lg"
              disabled={!isConnected}
              onClick={endConversation}
            >
              End conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
