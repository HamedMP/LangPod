"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { env } from "@/env.mjs";

// More specific error types
type ConversationError =
  | { type: "MICROPHONE_ACCESS"; message: string }
  | { type: "CONNECTION"; message: string }
  | { type: "GENERAL"; message: string };

interface ConversationMessage {
  content: string;
  source: string;
}

export function Conversation() {
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState<ConversationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("[Conversation] Connected");
      setError(null);
      setIsLoading(false);
    },
    onDisconnect: () => {
      console.log("[Conversation] Disconnected");
      setIsLoading(false);
      setError({
        type: "CONNECTION",
        message: "Connection lost. Please try reconnecting.",
      });
    },
    onError: (error: Error) => {
      console.error("[Conversation] Error:", error);
      setError({ type: "GENERAL", message: error.toString() });
      setIsLoading(false);
    },
    onMessage: (message: ConversationMessage) => {
      console.log("[Conversation] Message:", message);
    },
  });

  const startConversation = useCallback(async () => {
    console.log("[Conversation] Starting...");
    setError(null);
    setIsLoading(true);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation
      await conversation.startSession({
        agentId: env.NEXT_PUBLIC_AGENT_ID,
      });

      // Set initial volume if needed
      if (volume !== 0.5) {
        await conversation.setVolume({ volume });
      }
    } catch (error) {
      console.error("[Conversation] Start error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setError({
        type:
          error instanceof Error &&
          (error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError")
            ? "MICROPHONE_ACCESS"
            : "CONNECTION",
        message: errorMessage,
      });
      setIsLoading(false);
    }
  }, [conversation, volume]);

  const endConversation = useCallback(async () => {
    console.log("[Conversation] Ending...");
    await conversation.endSession();
  }, [conversation]);

  const handleVolumeChange = useCallback(
    async (value: number) => {
      setVolume(value);
      if (conversation.status === "connected") {
        try {
          await conversation.setVolume({ volume: value });
        } catch (error) {
          console.error("[Conversation] Volume error:", error);
        }
      }
    },
    [conversation]
  );

  return (
    <div className="flex justify-center items-center gap-x-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoading
              ? "Connecting..."
              : conversation.status === "connected"
                ? conversation.isSpeaking
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
                conversation.isSpeaking
                  ? "animate-orb"
                  : conversation.status === "connected" && "animate-orb-slow",
                conversation.status === "connected"
                  ? "orb-active"
                  : "orb-inactive"
              )}
            />

            {/* Volume control */}
            {conversation.status === "connected" && (
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
              disabled={conversation.status === "connected" || isLoading}
              onClick={startConversation}
            >
              {isLoading ? "Connecting..." : "Start conversation"}
            </Button>

            <Button
              variant="outline"
              className="rounded-full"
              size="lg"
              disabled={conversation.status !== "connected"}
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
