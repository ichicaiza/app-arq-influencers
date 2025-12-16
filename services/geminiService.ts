import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InfluencerParams, PromptOutput, ImageGenerationResult, GeneratedImage } from "../types";
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

// Helper to generate a single image
const generateSingleImage = async (ai: GoogleGenAI, prompt: string, aspectRatio: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error(`Failed to generate image for prompt: ${prompt.substring(0, 20)}...`, error);
    return null;
  }
};

export const generateInfluencerImages = async (params: InfluencerParams, onStatusChange?: (status: string) => void): Promise<ImageGenerationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Step 1: Generate the Text Prompts (The "Architect" phase)
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

  if (onStatusChange) onStatusChange('Drafting Prompts...');

  const textResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: outputSchema,
      temperature: 0.7,
    },
    contents: inputContent,
  });

  const text = textResponse.text;
  if (!text) throw new Error("No prompt content generated");
  
  const prompts = JSON.parse(text) as PromptOutput;

  // Step 2: Generate Images in parallel
  if (onStatusChange) onStatusChange('Rendering Images...');

  // Define aspect ratios for different shots
  const shotConfig = {
    fullBody: "9:16",     // Portrait for full body
    extremeCloseUp: "1:1", // Square for face details
    viewFromBehind: "3:4", // Slightly tall for atmosphere
    sideProfile: "1:1",    // Square for profile
    actionShot: "4:3"      // Landscape/Standard for action
  };

  const [fullBodyImg, closeUpImg, behindImg, profileImg, actionImg] = await Promise.all([
    generateSingleImage(ai, prompts.fullBody, shotConfig.fullBody),
    generateSingleImage(ai, prompts.extremeCloseUp, shotConfig.extremeCloseUp),
    generateSingleImage(ai, prompts.viewFromBehind, shotConfig.viewFromBehind),
    generateSingleImage(ai, prompts.sideProfile, shotConfig.sideProfile),
    generateSingleImage(ai, prompts.actionShot, shotConfig.actionShot),
  ]);

  return {
    fullBody: { prompt: prompts.fullBody, imageData: fullBodyImg, aspectRatio: shotConfig.fullBody },
    extremeCloseUp: { prompt: prompts.extremeCloseUp, imageData: closeUpImg, aspectRatio: shotConfig.extremeCloseUp },
    viewFromBehind: { prompt: prompts.viewFromBehind, imageData: behindImg, aspectRatio: shotConfig.viewFromBehind },
    sideProfile: { prompt: prompts.sideProfile, imageData: profileImg, aspectRatio: shotConfig.sideProfile },
    actionShot: { prompt: prompts.actionShot, imageData: actionImg, aspectRatio: shotConfig.actionShot },
  };
};