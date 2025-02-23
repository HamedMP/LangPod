import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env.mjs";

export interface AIProvider {
  generateCompletion(
    messages: Array<{ role: string; content: string }>
  ): Promise<string | null>;
}

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key is required");
    }
    this.client = new Anthropic({ apiKey });
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

      const defaultOptions: Anthropic.MessageCreateParams = {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1500,
        temperature: 0.7,
        system: systemMessage,
        messages: [{ role: "user", content: userMessages }],
        ...options,
      };

      const response = await this.client.messages.create(defaultOptions);

      if ("content" in response && Array.isArray(response.content)) {
        const block = response.content[0];
        if (block?.type === "text") {
          return block.text;
        }
      }

      throw new Error("No text content in Anthropic response");
    } catch (error) {
      console.error("Anthropic API Error:", error);
      throw error;
    }
  }
}
