import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAppSettings } from "./supabase";

export async function getGeminiModel() {
  const settings = await getAppSettings();
  const apiKey = settings.gemini_api_key;
  
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please add it in App Settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function askDesignerQuestions(businessDescription: string, currentBrand: string) {
  const model = await getGeminiModel();
  
  const prompt = `
    You are a professional Brand Strategist and UI Designer. 
    A user wants to design a website for their business.
    Current Brand Name: ${currentBrand}
    Business Description: ${businessDescription}

    Based on this, ask 3-5 short, punchy questions to help define the brand's visual identity, tone, and specific goals.
    Keep the questions conversational and professional.
    Return the questions as a simple array of strings.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Basic parsing to extract questions if the AI returns them in a list format
  return text.split("\n").filter(q => q.trim().length > 5).map(q => q.replace(/^\d+\.\s*/, "").trim());
}

export async function generateSiteDesign(context: {
  description: string;
  answers: string[];
  currentBrand: string;
}) {
  const model = await getGeminiModel();

  const prompt = `
    You are a professional Web Copywriter.
    Business Description: ${context.description}
    User Preferences (from questions): ${context.answers.join(" | ")}
    Original Brand Name: ${context.currentBrand}

    Generate the following for their landing page in a strict JSON format:
    {
      "brand_name": "Suggested Brand Name (catchy and relevant)",
      "hero_headline": "A headline that wows",
      "hero_description": "A compelling 2-sentence description"
    }

    Return ONLY the JSON. No markdown, no extra text.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Clean potential markdown code blocks
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse Gemini JSON:", text);
    throw new Error("AI generated an invalid format. Please try again.");
  }
}
