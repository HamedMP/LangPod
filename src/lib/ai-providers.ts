import OpenAI from "openai";
import { env } from "@/env.mjs";

export interface AIProvider {
  generateCompletion(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<string | null>;
}

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.client = new OpenAI({ apiKey });
  }

  async generateCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], 
    options: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming> = {}
  ): Promise<string | null> {
    try {
      const defaultOptions: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
        model: "gpt-4o-mini",
        max_tokens: 1500,
        temperature: 0.7,
        messages,
        ...options
      };

      const response = await this.client.chat.completions.create(defaultOptions);

      if (!response.choices[0]?.message?.content) {
        throw new Error("No content in OpenAI response");
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  }
} 