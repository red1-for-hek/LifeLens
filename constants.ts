import { Type, Schema } from "@google/genai";

export const MODEL_NAME = "gemini-2.5-flash";

export const SAFETY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overall_safety_score: {
      type: Type.INTEGER,
      description: "A score from 1 to 10, where 10 is perfectly safe and 1 is extremely dangerous.",
    },
    summary: {
      type: Type.STRING,
      description: "A one-sentence summary of the safety situation.",
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short title of the risk." },
          severity: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High"],
            description: "Severity level of the risk.",
          },
          solution: { type: Type.STRING, description: "Immediate solution or mitigation." },
        },
        required: ["title", "severity", "solution"],
      },
    },
  },
  required: ["overall_safety_score", "summary", "risks"],
};

export const SYSTEM_INSTRUCTION = "Analyze this image for safety hazards. Be critical and observant of environment, objects, and potential dangers.";
