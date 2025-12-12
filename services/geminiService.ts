import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";
import { MODEL_NAME, SAFETY_SCHEMA, SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;

try {
  // @ts-ignore
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Gemini API Key is missing! Please set GEMINI_API_KEY in your environment.");
  }
} catch (error) {
  console.error("Error initializing Gemini client:", error);
}

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const isConfigured = (): boolean => {
  return !!ai;
};

export const analyzeImage = async (file: File, apiKey?: string): Promise<AnalysisResult> => {
  try {
    let client = ai;
    if (apiKey) {
      client = new GoogleGenAI({ apiKey });
    }

    if (!client) {
      throw new Error("Gemini API is not initialized. Check your API key configuration.");
    }

    const imagePart = await fileToGenerativePart(file);

    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: "user",
        parts: [
          imagePart,
          { text: "Analyze this image for safety hazards." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: SAFETY_SCHEMA,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing image:", error);
    
    let errorMessage = "Failed to analyze image. Please try again.";
    let solution = "Check connection and try again.";

    if (error instanceof Error && error.message.includes("API key")) {
        errorMessage = "Gemini API Key is missing or invalid.";
        solution = "Please check your Vercel environment variables.";
    }

    // Fallback error result
    return {
      overall_safety_score: 0,
      summary: errorMessage,
      risks: [{ title: "Analysis Error", severity: "High", solution: solution }]
    };
  }
};
