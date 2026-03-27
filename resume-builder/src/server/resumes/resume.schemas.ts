import { z } from "zod";

const optionalTrimmedString = z.string().trim().min(1).max(4000).optional();
const optionalUrl = z.string().url().optional().or(z.literal(""));

// Personal Info validation - for contact details
export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(2).max(200).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  linkedIn: optionalUrl,
  github: optionalUrl,
  portfolio: optionalUrl,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

export const resumeTemplateValues = ["modern-clean", "classic-pro", "bold-edge"] as const;
export const resumeTemplateSchema = z.enum(resumeTemplateValues);

export const createResumeSchema = z.object({
  title: z.string().trim().min(2).max(120),
  template: resumeTemplateSchema.optional(),
  slug: z.string().trim().min(2).max(120).optional(),
  headline: optionalTrimmedString,
  professionalSummary: z.string().trim().min(10).max(2000).optional(),
  contentJson: z.unknown().optional(),
  notes: z.string().trim().max(4000).optional(),
});

export const updateResumeSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    slug: z.string().trim().min(2).max(120).nullable().optional(),
    isArchived: z.boolean().optional(),
    headline: optionalTrimmedString.nullable(),
    professionalSummary: z.string().trim().min(10).max(2000).nullable().optional(),
    contentJson: z.unknown().nullable().optional(),
    notes: z.string().trim().max(4000).nullable().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "At least one field is required",
  });

export const resumeIdSchema = z.object({
  resumeId: z.string().trim().min(1),
});

export const generateResumeSchema = z.object({
  targetRole: z.string().trim().min(2).max(120),
  yearsOfExperience: z.number().int().min(0).max(50),
  keySkills: z.array(z.string().trim().min(1)).min(1).max(30),
  careerHighlights: z.array(z.string().trim().min(3)).min(1).max(20),
  jobDescription: z.string().trim().min(30).max(8000),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type GenerateResumeInput = z.infer<typeof generateResumeSchema>;
export type ResumeTemplate = z.infer<typeof resumeTemplateSchema>;
