import OpenAI from "openai";
import { env } from "../config/env.js";
import { CalculatorInput } from "../utils/carbon.js";

let openaiClient: OpenAI | null = null;

function getOpenAI() {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return openaiClient;
}

function createFallbackAdvisorPlan(input: CalculatorInput & { monthlyEmissionKg: number }) {
  const recommendations = [
    input.carKm > input.publicTransportKm
      ? "Shift 2 to 3 weekly car trips to public transport or shared rides to reduce transport emissions."
      : "Keep strengthening your lower-emission commute mix and batch longer trips where possible.",
    input.electricityKwh > 150
      ? "Reduce peak electricity use by tightening AC hours, switching off idle appliances, and using efficient lighting."
      : "Your energy profile is relatively efficient. Focus on consistency and seasonal AC optimization.",
    input.foodType === "NON_VEGETARIAN"
      ? "Replace one or two meat-heavy meals each week with lower-carbon alternatives."
      : "Your food profile is already lower-carbon. Focus next on shopping and home energy habits."
  ];

  return [
    "Personalized eco-friendly suggestions",
    `- ${recommendations[0]}`,
    `- ${recommendations[1]}`,
    `- ${recommendations[2]}`,
    "",
    "Weekly sustainability plan",
    "- Choose one commute day to go car-free.",
    "- Track AC and appliance runtime for one week.",
    "- Plan meals and shopping to reduce avoidable waste.",
    "",
    "Monthly improvement goal",
    `- Target a 5-8% reduction from your current monthly footprint of ${input.monthlyEmissionKg} kg CO2e.`
  ].join("\n");
}

export async function generateAdvisorPlan(input: CalculatorInput & { monthlyEmissionKg: number }) {
  const openai = getOpenAI();
  if (!openai) {
    return createFallbackAdvisorPlan(input);
  }

  const prompt = `
You are an expert sustainability coach. Based on the user's monthly footprint profile, produce:
1. Three personalized eco-friendly suggestions.
2. Two reduction strategies with approximate impact percentages.
3. A weekly sustainability plan.
4. A monthly improvement goal.

User profile:
${JSON.stringify(input, null, 2)}

Keep the tone practical, optimistic, and concise. Return plain text with headings.
`;

  try {
    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: prompt
    });

    return response.output_text;
  } catch {
    return createFallbackAdvisorPlan(input);
  }
}

export async function answerEcoQuestion(question: string, context?: string) {
  const openai = getOpenAI();
  const fallback = `A practical starting point is to reduce the highest-emission recurring habit first, then make it repeatable. ${context ?? ""}`.trim();
  if (!openai) {
    return fallback;
  }

  try {
    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: `
You are EcoTrack AI's sustainability assistant. Answer clearly and accurately.
${context ? `Context: ${context}` : ""}

Question: ${question}
`
    });

    return response.output_text;
  } catch {
    return fallback;
  }
}
