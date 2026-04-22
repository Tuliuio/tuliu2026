import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    // Uses VITE_API_KEY as per Vite standards, ensuring the app doesn't crash if env is missing during init
    const apiKey = import.meta.env.VITE_API_KEY || ""; 
    if (apiKey) {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  }
  return aiInstance;
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const ai = getAI();
    
    if (!ai) {
      return "Configuration Error: API Key is missing or invalid.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        // Updated instruction to strictly guide users to WhatsApp
        systemInstruction: "You are an expert Digital Infrastructure Consultant for 'Tuliu'. Your goal is to briefly explain Tuliu's value (Hosting, Domains, Security). IMPORTANT: No matter what the user asks, answer politely and concisely (under 40 words), but YOU MUST ALWAYS conclude the message by telling them that for custom quotes, technical support, or to get started, they need to speak with us on WhatsApp. Provide this link: https://wa.me/554840426597",
      },
    });

    return response.text || "I'm analyzing your infrastructure needs. Please contact us on WhatsApp: https://wa.me/554840426597";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please talk to us directly on WhatsApp: https://wa.me/554840426597";
  }
};