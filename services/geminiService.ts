import { GoogleGenAI } from "@google/genai";
import { CalculatedOption } from "../types";
import { BATTERY_CAPACITY_KWH } from "../constants";

const getSystemInstruction = () => `
You are an expert EV Charging Assistant for a BYD electric vehicle owner in Singapore.
Your goal is to analyze charging options and recommend the best one based on:
1. Battery health (slower is generally better, but not always practical).
2. Convenience (finishing before 7 AM is usually good for morning commutes).
3. "Stretching" the charge: The user explicitly wants to know how to time the charge so it finishes exactly when they need it.

Keep your advice short, punchy, and helpful. Maximum 2 sentences.
Focus on the calculated 'End Time'.
`;

export const getChargingAdvice = async (
  currentBattery: number,
  options: CalculatedOption[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI advice unavailable: API Key not configured.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare a summary of the options for the AI
    const optionsSummary = options.map(opt => 
      `- ${opt.currentAmps}A (${opt.powerKW}kW): Finishes at ${opt.endTime.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}`
    ).join('\n');

    const prompt = `
      Vehicle Specs: BYD EV with ${BATTERY_CAPACITY_KWH} kWh Battery
      Current Battery Level: ${currentBattery}%
      Current Time: ${new Date().toLocaleTimeString('en-SG')}
      
      Available Charging Options:
      ${optionsSummary}
      
      Which setting should I choose to optimize for a morning departure (approx 7-8 AM) or to stretch the charge duration?
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for simple advice
      },
    });

    return response.text || "Could not generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to AI assistant.";
  }
};
