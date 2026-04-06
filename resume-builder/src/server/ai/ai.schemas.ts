import { z } from "zod";

export const generateSummarySchema = z.object({
  jobTitle: z.string().trim().min(3, "Target Job Title must be at least 3 characters long."),
  skills: z.array(z.string().trim().min(1, "Skill cannot be empty.")).min(1, "At least one skill is required to contextualize the summary."),
  experienceLevel: z.string().trim().min(1, "Experience level is required (e.g. '0-1 years')."),
  tone: z.enum(["professional", "energetic", "executive"]).optional().default("professional"),
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

export const improveBulletsSchema = z.object({
  role: z.string().trim().min(2, "Job title/role is required to contextualize the bullet points."),
  bullets: z.array(z.string().trim().min(2, "Bullet points must be at least 2 characters long."))
    .min(1, "At least one valid bullet point is required to improve."),
});

export type ImproveBulletsInput = z.infer<typeof improveBulletsSchema>;

export const tailorResumeSchema = z.object({
  jobDescription: z.string().trim().min(20, "Please paste a complete job description (at least 20 characters)."),
  resumeData: z.record(z.string(), z.unknown()).refine((data) => Object.keys(data).length > 0, {
    message: "Resume data is required to tailor the resume.",
  }),
});

export type TailorResumeInput = z.infer<typeof tailorResumeSchema>;

export const coverLetterSchema = z.object({
  resumeId: z.string().trim().min(3, "You must select a resume to build a cover letter around."),
  jobTitle: z.string().trim().min(2, "Job Title is required."),
  companyName: z.string().trim().min(2, "Company name is required."),
  jobDescription: z.string().trim().min(20, "Please provide the target job description (at least 20 chars)."),
});

export type GenerateCoverLetterPayload = z.infer<typeof coverLetterSchema>;
