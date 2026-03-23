import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(10).max(2000),
  contentJson: z.any(),
});

export const generateResumeSchema = z.object({
  targetRole: z.string().trim().min(2).max(120),
  yearsOfExperience: z.number().int().min(0).max(50),
  keySkills: z.array(z.string().trim().min(1)).min(1).max(30),
  careerHighlights: z.array(z.string().trim().min(3)).min(1).max(20),
  jobDescription: z.string().trim().min(30).max(8000),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type GenerateResumeInput = z.infer<typeof generateResumeSchema>;
