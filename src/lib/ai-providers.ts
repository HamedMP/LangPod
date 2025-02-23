import Anthropic from "@anthropic-ai/sdk";
import { PostHog } from "posthog-node";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { env } from "@/env.mjs";

export interface AIProvider {
  generateCompletion(
    messages: Array<{ role: string; content: string }>
  ): Promise<string | null>;
}

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  phClient = new PostHog("phc_LX0KpOpv5LIZDFKCpuiTi2BAnqUK72poTQ1fA0f2IOT", {
    host: "https://eu.i.posthog.com",
  });

  constructor() {
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key is required");
    }
    this.client = new Anthropic({ apiKey });
    this.model = "claude-3-5-sonnet-20240620";
  }

  async generateCompletion(
    messages: Array<{ role: string; content: string }>,
    options: Partial<Anthropic.MessageCreateParams> = {}
  ): Promise<string | null> {
    try {
      // Convert OpenAI-style messages to Anthropic format
      const systemMessage =
        messages.find((m) => m.role === "system")?.content || "";
      const userMessages = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("\n\n");

      const modelName = options.model || this.model;

      // Track LLM request in PostHog
      this.phClient.capture({
        distinctId: "system",
        event: "llm_request",
        properties: {
          provider: "anthropic",
          model: modelName,
          messageCount: messages.length,
          hasSystemMessage: !!systemMessage,
        },
      });

      const { text } = await generateText({
        model: anthropic(modelName),
        system: systemMessage,
        prompt: userMessages,
        maxTokens: options.max_tokens || 1500,
        temperature: options.temperature || 0.7,
      });

      // Track LLM response in PostHog
      this.phClient.capture({
        distinctId: "system",
        event: "llm_response",
        properties: {
          provider: "anthropic",
          model: modelName,
          responseLength: text.length,
        },
      });

      return text;
    } catch (error) {
      // Track LLM error in PostHog
      this.phClient.capture({
        distinctId: "system",
        event: "llm_error",
        properties: {
          provider: "anthropic",
          model: options.model || this.model,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      console.error("Anthropic API Error:", error);
      throw error;
    }
  }
}
