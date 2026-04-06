import OpenAI from "openai";
import { getOpenAIEnv } from "@/lib/env";

export type ResumeGenerationInput = {
  fullName: string;
  targetRole: string;
  yearsOfExperience: number;
  keySkills: string[];
  careerHighlights: string[];
  jobDescription: string;
};

// --- Config & Client ---
let openAiClient: OpenAI | null = null;

function getClient() {
  if (!openAiClient) {
    const openAIEnv = getOpenAIEnv();
    openAiClient = new OpenAI({ 
      apiKey: openAIEnv.OPENAI_API_KEY,
      baseURL: openAIEnv.OPENAI_BASE_URL,
    });
  }
  return openAiClient;
}

// --- Prompts ---
const PROMPTS = {
  summary: `You are an expert resume writer. Generate a professional summary. 
It must be 2-3 sentences, impact-oriented, and tailored to the provided details.
Avoid generic buzzwords. Produce valid JSON with a 'summary' string field.`,
  
  bullets: `You are an expert resume writer. Improve the provided experience bullet points.
Make them action-driven, quantifiable, and impactful. 
Produce valid JSON with a 'bullets' string array field.`,
  
  tailor: `You are an expert career coach. Tailor the applicant's resume data to the target job description.
Highlight relevant skills, reframe experiences to match the job's keywords, and improve the professional summary.
Produce valid JSON with 'summary' (string), 'skills' (string array), and 'experienceHighlights' (string array) fields.`,
  
  coverLetter: `You are an expert career coach. Generate a professional, energetic, and concise cover letter.
Match the applicant's background to the job description and company. Do not use generic placeholders like [Company Name] if the real name is provided.
Produce valid JSON with a 'coverLetter' string field.`
};

// --- Base Generation Helper ---
async function generateJsonCompletion<T>(
  systemPrompt: string, 
  userContent: string, 
  temperature = 0.5
): Promise<T> {
  const client = getClient();
  const openAIEnv = getOpenAIEnv();

  try {
    const completion = await client.chat.completions.create({
      model: openAIEnv.OPENAI_MODEL,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI provider returned an empty response.");
    }
    
    return JSON.parse(content) as T;
  } catch (error) {
    console.error("AI Generation Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate AI content: ${msg}`);
  }
}

// --- Features ---

export async function generateResumeDraft(input: ResumeGenerationInput) {
  const prompt = "You are an expert resume writer. Produce concise, impact-focused content with measurable outcomes. Return valid JSON with keys: title, summary, sections.";
  return generateJsonCompletion<{
    title: string;
    summary: string;
    sections: Array<{ heading: string; bullets: string[] }>;
  }>(prompt, JSON.stringify(input), 0.4);
}

export type SummaryGenerationInput = {
  jobTitle: string;
  skills: string[];
  experienceLevel: string;
  tone?: "professional" | "energetic" | "executive";
};

export async function generateProfessionalSummary(input: SummaryGenerationInput) {
  const response = await generateJsonCompletion<{ summary: string }>(
    PROMPTS.summary, 
    JSON.stringify(input)
  );
  return response.summary;
}

export type BulletImprovementInput = {
  role: string;
  bullets: string[];
};

export async function improveExperienceBulletPoints(input: BulletImprovementInput) {
  const response = await generateJsonCompletion<{ bullets: string[] }>(
    PROMPTS.bullets, 
    JSON.stringify(input)
  );
  return response.bullets;
}

export type TailorResumeInput = {
  resumeData: Record<string, unknown>;
  jobDescription: string;
};

export async function tailorResumeToJobDescription(input: TailorResumeInput) {
  return generateJsonCompletion<{
    summary: string;
    skills: string[];
    experienceHighlights: string[];
    keywords: string[];
    missingStrengths: string[];
  }>(PROMPTS.tailor, JSON.stringify(input), 0.4);
}

export type CoverLetterInput = {
  resumeData: Record<string, unknown>;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
};

export async function generateCoverLetter(input: CoverLetterInput) {
  const response = await generateJsonCompletion<{ coverLetter: string }>(
    PROMPTS.coverLetter, 
    JSON.stringify(input),
    0.6
  );
  return response.coverLetter;
}
