import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InfluencerParams, PromptOutput } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const outputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fullBody: { type: Type.STRING, description: "A dense, descriptive prompt for a full body shot." },
    extremeCloseUp: { type: Type.STRING, description: "A dense, descriptive prompt for an extreme close-up focusing on face and details." },
    viewFromBehind: { type: Type.STRING, description: "A dense, descriptive prompt for a view from behind, atmospheric." },
    sideProfile: { type: Type.STRING, description: "A dense, descriptive prompt for a sharp side profile view." },
    actionShot: { type: Type.STRING, description: "A dynamic medium shot focused 100% on the specific action." },
  },
  required: ["fullBody", "extremeCloseUp", "viewFromBehind", "sideProfile", "actionShot"],
};

export const generatePrompts = async (params: InfluencerParams): Promise<PromptOutput> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const inputContent = `
    Genera 5 prompts basados en estos datos:
    - Sexo/Edad: ${params.sexAge}
    - Fisonomía: ${params.physique}
    - Pelo: ${params.hair}
    - Extras: ${params.extras}
    - Vestimenta: ${params.clothing}
    - Entorno: ${params.environment}
    - Acción: ${params.action}
    - Estilo General: ${params.style}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: outputSchema,
        temperature: 0.7, // Slightly creative but adherent to instructions
      },
      contents: inputContent,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    return JSON.parse(text) as PromptOutput;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};