import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";
import { MODEL_NAME, SAFETY_SCHEMA, SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
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
    // Fallback error result
    return {
      overall_safety_score: 0,
      summary: "Failed to analyze image. Please try again.",
      risks: [{ title: "Analysis Error", severity: "High", solution: "Check connection and try again." }]
    };
  }
};
