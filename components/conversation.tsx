"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define types for the conversation
interface ConversationSession {
  startSession: (config: SessionConfig) => Promise<void>;
  endSession: () => Promise<void>;
}

interface SessionConfig {
  signedUrl: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (error: unknown) => void;
  onModeChange: (params: { mode: string }) => void;
}

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
  const [conversation, setConversation] = useState<ConversationSession | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  async function startConversation() {
    setPermissionError(null); // Reset any previous errors

    try {
      await requestMicrophonePermission();

      const signedUrl = await getSignedUrl();
      const conv = {
        startSession: async (config: SessionConfig) => {
          // Implementation will depend on your actual conversation service
          setIsConnected(true);
          setIsSpeaking(true);
        },
        endSession: async () => {
          setIsConnected(false);
          setIsSpeaking(false);
        },
      };

      await conv.startSession({
        signedUrl,
        onConnect: () => {
          setIsConnected(true);
          setIsSpeaking(true);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.error(error);
          alert("An error occurred during the conversation");
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === "speaking");
        },
      });

      setConversation(conv);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to access microphone. Please check your browser settings.";

      setPermissionError(errorMessage);
      console.error("Microphone permission error:", error);
      return;
    }
  }

  async function endConversation() {
    if (!conversation) return;
    await conversation.endSession();
    setConversation(null);
  }

  return (
    <div className="flex justify-center items-center gap-x-4">
      <Card className="rounded-3xl">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-center">
              {isConnected
                ? isSpeaking
                  ? "Agent is speaking"
                  : "Agent is listening"
                : "Disconnected"}
            </CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-y-4 text-center">
            {permissionError && (
              <div className="text-red-500 text-sm px-4">
                {permissionError}
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
              </div>
            )}

            <div
              className={cn(
                "orb my-16 mx-12",
                isSpeaking ? "animate-orb" : conversation && "animate-orb-slow",
                isConnected ? "orb-active" : "orb-inactive"
              )}
            />

            <Button
              variant="outline"
              className="rounded-full"
              size="lg"
              disabled={conversation !== null && isConnected}
              onClick={startConversation}
            >
              Start conversation
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              size="lg"
              disabled={conversation === null && !isConnected}
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
