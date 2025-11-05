
import { GoogleGenAI } from "@google/genai";
import type { FactCheckResult, Source } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function factCheckClaim(youtubeUrl: string, claim: string): Promise<FactCheckResult> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are a meticulous fact-checking expert. Your task is to analyze a claim made in a YouTube Short and determine its veracity.
    
    YouTube Short URL: ${youtubeUrl}
    Claim to investigate: "${claim}"

    Instructions:
    1. Use Google Search to find high-quality, reliable sources (e.g., reputable news organizations, scientific journals, academic institutions, expert analyses).
    2. Evaluate the evidence from these sources to determine if the claim is a fact, a myth, or inconclusive.
    3. Synthesize your findings into a clear and concise explanation.
    4. Start your response with one of three possible markers: "FACT:", "MYTH:", or "INCONCLUSIVE:". This marker is mandatory.
    5. Following the marker, provide your detailed explanation. Be objective and stick to the evidence.

    Example Response:
    MYTH: The claim that you only use 10% of your brain is a long-standing myth. Neurological studies using fMRI and PET scans show that most of the brain is active almost all the time, even during sleep. Different tasks activate different regions, but there are no dormant 90% areas.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text.trim();
    let isFact: boolean | null = null;
    let explanation = '';

    if (text.startsWith('FACT:')) {
      isFact = true;
      explanation = text.substring(5).trim();
    } else if (text.startsWith('MYTH:')) {
      isFact = false;
      explanation = text.substring(5).trim();
    } else if (text.startsWith('INCONCLUSIVE:')) {
      isFact = null;
      explanation = text.substring(13).trim();
    } else {
      // Fallback if the model doesn't follow instructions perfectly
      explanation = text;
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
      .reduce((acc: Source[], current) => {
          if (!acc.some(item => item.uri === current.uri)) {
              acc.push({ uri: current.uri, title: current.title });
          }
          return acc;
      }, []);

    return { isFact, explanation, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI. The service may be overloaded.");
  }
}
