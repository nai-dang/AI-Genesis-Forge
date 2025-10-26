
import { GoogleGenAI, Modality } from "@google/genai";
import { Phase, Personality } from "../types";
import { PERSONALITIES } from "../constants";

const getAi = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateText = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  phase: Phase,
  personality: Personality
) => {
  const ai = getAi();
  const model = phase === Phase.Development ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  const systemInstruction = `${PERSONALITIES[personality].systemInstruction}\n\nYou are currently in the '${phase}' phase of app development. Tailor your response accordingly. When providing code, wrap it in markdown-style triple backticks.`;

  const chat = ai.chats.create({
    model: model,
    config: { systemInstruction },
    history,
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAi();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return Promise.reject("No audio data received.");
  } catch (error) {
    console.error("Error generating speech:", error);
    return Promise.reject(error);
  }
};
