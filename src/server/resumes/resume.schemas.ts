import { z } from "zod";

const optionalTrimmedString = z.string().trim().min(1).max(4000).optional();
const optionalUrl = z.string().trim().max(500).optional().or(z.literal(""));

// Personal Info validation - for contact details
export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(2).max(200).optional(),
  email: z.string().trim().max(320).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  linkedIn: optionalUrl,
  github: optionalUrl,
  portfolio: optionalUrl,
  photoUrl: optionalUrl,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// ──────────────────────────────────────────────────────────────────────
// WORK EXPERIENCE SCHEMA
// ──────────────────────────────────────────────────────────────────────
export const workExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().trim().max(200),
  role: z.string().trim().max(200),
  location: z.string().trim().max(200).optional(),
  startDate: z.string().date(),
  endDate: z.string().date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(4000).optional(),
  achievements: z.array(z.string().trim().max(500)).default([]),
});

export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;

// ──────────────────────────────────────────────────────────────────────
// EDUCATION SCHEMA
// ──────────────────────────────────────────────────────────────────────
export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().trim().max(200),
  degree: z.string().trim().max(200),
  fieldOfStudy: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  grade: z.string().trim().max(50).optional(),
  description: z.string().trim().max(4000).optional(),
});

export type EducationInput = z.infer<typeof educationSchema>;

// ──────────────────────────────────────────────────────────────────────
// SKILLS SCHEMA
// ──────────────────────────────────────────────────────────────────────
export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().max(100),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
});

export type SkillInput = z.infer<typeof skillSchema>;

// ──────────────────────────────────────────────────────────────────────
// PROJECTS SCHEMA
// ──────────────────────────────────────────────────────────────────────
export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().max(200),
  description: z.string().trim().max(4000).optional(),
  technologies: z.string().trim().max(500).optional(),
  url: optionalUrl,
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ──────────────────────────────────────────────────────────────────────
// CERTIFICATIONS SCHEMA
// ──────────────────────────────────────────────────────────────────────
export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().max(200),
  issuer: z.string().trim().max(200).optional(),
  issueDate: z.string().date().optional(),
  expiryDate: z.string().date().optional(),
  url: optionalUrl,
});

export type CertificationInput = z.infer<typeof certificationSchema>;

// ──────────────────────────────────────────────────────────────────────
// TEMPLATE & MAIN SCHEMAS
// ──────────────────────────────────────────────────────────────────────
export const resumeTemplateValues = ["modern", "professional", "minimal"] as const;
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
    template: resumeTemplateSchema.optional(),
    // New fields for autosave
    personalInfo: personalInfoSchema.optional(),
    workExperiences: z.array(workExperienceSchema).optional(),
    educations: z.array(educationSchema).optional(),
    skills: z.array(skillSchema).optional(),
    projects: z.array(projectSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
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
