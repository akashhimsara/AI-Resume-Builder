import OpenAI from "openai";
import { env } from "@/lib/env";

export type ResumeGenerationInput = {
  fullName: string;
  targetRole: string;
  yearsOfExperience: number;
  keySkills: string[];
  careerHighlights: string[];
  jobDescription: string;
};

let openAiClient: OpenAI | null = null;

function getClient() {
  if (!openAiClient) {
    openAiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return openAiClient;
}

export async function generateResumeDraft(input: ResumeGenerationInput) {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume writer. Produce concise, impact-focused content with measurable outcomes. Return valid JSON with keys: title, summary, sections.",
      },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return JSON.parse(content) as {
    title: string;
    summary: string;
    sections: Array<{ heading: string; bullets: string[] }>;
  };
}
