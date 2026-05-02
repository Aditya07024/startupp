import axios from "axios";
import { buildFallbackAIContent } from "./aiFallback.js";

const buildPrompt = (topic) => `You are a viral social media content expert. For the topic: "${topic}", generate:
1. VIRAL HOOK: (one punchy sentence)
2. SCRIPT: (Start -> Problem -> Solution -> Result format)
3. CAPTION: (engaging, under 150 chars)
4. HASHTAGS: (10 relevant hashtags)
Return ONLY JSON: { "hook":"...", "script":"...", "caption":"...", "hashtags":[] }`;

const parseGeneratedJson = (payload) => {
  if (typeof payload !== "string") {
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      if (payload.error) {
        throw new Error(`Hugging Face error: ${payload.error}`);
      }
      return payload;
    }

    throw new Error("Unexpected AI response format");
  }

  const match = payload.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("AI response did not contain JSON");
  }

  return JSON.parse(match[0]);
};

export const generateContentFromAI = async (topic) => {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL}`,
      {
        inputs: buildPrompt(topic),
        parameters: { max_new_tokens: 500, return_full_text: false, temperature: 0.7 },
      },
      {
        timeout: 30000,
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );

    const raw = Array.isArray(response.data) ? response.data[0]?.generated_text : response.data;
    return parseGeneratedJson(raw);
  } catch (error) {
    if (error.response?.data?.error || error.code === "ECONNABORTED") {
      return buildFallbackAIContent(topic);
    }

    return buildFallbackAIContent(topic);
  }
};
