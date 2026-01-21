
import { GoogleGenAI, Type } from "@google/genai";
import { InsightResponse } from "../types.ts";

/**
 * Fetches cultural and traditional Chinese insights based on age details using Gemini AI.
 * Uses gemini-3-flash-preview for fast and relevant text generation.
 */
export const getCulturalInsight = async (
  birthDate: string, 
  zhousui: number, 
  xusui: number, 
  zodiac: string
): Promise<InsightResponse> => {
  // Always initialize with the latest API key from environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    用户出生日期为 ${birthDate}。
    当前周岁为 ${zhousui} 岁，虚岁为 ${xusui} 岁，属相为 ${zodiac}。
    请根据中国传统文化和现代视角，提供以下内容：
    1. 虚岁与周岁在这个特定年龄的文化意义（例如：而立之年、不惑之年等称谓）。
    2. 该属相在今年的简要运势或性格特质。
    3. 给该人生阶段的一句富有诗意的建议。
    请以 JSON 格式返回。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            culturalSignificance: { type: Type.STRING },
            zodiacReading: { type: Type.STRING },
            lifeStageAdvice: { type: Type.STRING }
          },
          required: ["culturalSignificance", "zodiacReading", "lifeStageAdvice"]
        }
      }
    });

    // Access .text property directly as per @google/genai guidelines
    const text = response.text;
    if (!text) {
      throw new Error("Gemini API returned an empty response.");
    }
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Cultural Insight Error:", error);
    // Provide graceful fallback content
    return {
      culturalSignificance: "年龄不仅是数字，更是生命的积淀。在中国传统中，不同的岁数承载着不同的社会责任与期待。",
      zodiacReading: `属${zodiac}的人通常具有独特的魅力与坚韧的品质。`,
      lifeStageAdvice: "凡是过往，皆为序章。愿你历经千帆，归来仍是少年。"
    };
  }
};
