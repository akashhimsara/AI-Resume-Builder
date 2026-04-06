"use client";

import { useCallback } from "react";
import {
  SectionContainer,
  InputField,
  CheckboxField,
  ArraySection,
  ArrayItem,
  Row,
} from "@/components/resume-editor/form-sections";
import { AISummaryGenerator } from "./ai-summary-generator";
import { AIBulletImprover } from "./ai-bullet-improver";

/**
 * =============================================================================
 * RESUME SECTION COMPONENTS - The specific sections
 * 
 * Each section manages its own data and handles add/update/remove logic
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────
// PERSONAL INFO SECTION
// ─────────────────────────────────────────────────────────────────────────
export interface PersonalInfoData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
}

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = useCallback(
    (field: keyof PersonalInfoData, value: string) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  return (
    <SectionContainer title="Personal Information" description="Your contact details and online presence">
      <Row columns={2}>
        <InputField
          label="Full Name"
          value={data.fullName}
          onChange={(val) => handleChange("fullName", val)}
          placeholder="John Doe"
        />
        <InputField
          label="Email"
          type="email"
          value={data.email}
          onChange={(val) => handleChange("email", val)}
          placeholder="john@example.com"
        />
      </Row>
      <Row columns={2}>
        <InputField
          label="Phone"
          value={data.phone}
          onChange={(val) => handleChange("phone", val)}
          placeholder="+1 (555) 123-4567"
        />
        <InputField
          label="Location"
          value={data.location}
          onChange={(val) => handleChange("location", val)}
          placeholder="San Francisco, CA"
        />
      </Row>
      <Row columns={3}>
        <InputField
          label="LinkedIn"
          type="url"
          value={data.linkedIn}
          onChange={(val) => handleChange("linkedIn", val)}
          placeholder="https://linkedin.com/in/..."
        />
        <InputField
          label="GitHub"
          type="url"
          value={data.github}
          onChange={(val) => handleChange("github", val)}
          placeholder="https://github.com/..."
        />
        <InputField
          label="Portfolio"
          type="url"
          value={data.portfolio}
          onChange={(val) => handleChange("portfolio", val)}
          placeholder="https://example.com"
        />
      </Row>
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700">Upload Headshot</div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                handleChange("photoUrl", reader.result);
              }
            };
            reader.readAsDataURL(file);
          }}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {data.photoUrl && (
          <img
            src={data.photoUrl}
            alt="Profile photo preview"
            className="h-24 w-24 rounded-full object-cover border border-slate-300"
          />
        )}
      </div>
    </SectionContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SUMMARY SECTION
// ─────────────────────────────────────────────────────────────────────────
interface SummaryFormProps {
  headline?: string;
  professionalSummary?: string;
  skillsContext?: string[];
  onHeadlineChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
}

export function SummaryForm({
  headline,
  professionalSummary,
  skillsContext,
  onHeadlineChange,
  onSummaryChange,
}: SummaryFormProps) {
  return (
    <SectionContainer title="Professional Summary" description="Your headline and career summary">
      <InputField
        label="Professional Headline"
        placeholder="Senior Software Engineer | Full Stack Developer"
        value={headline}
        onChange={onHeadlineChange}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <div className="flex-1"></div> {/* Spacer to push button right */}
          <AISummaryGenerator 
            onSuccess={onSummaryChange} 
            defaultHeadline={headline} 
            defaultSkills={skillsContext} 
          />
        </div>
        <InputField
          label="Professional Summary"
          type="textarea"
          placeholder="Write a brief summary of your career, skills, and achievements..."
          value={professionalSummary}
          onChange={onSummaryChange}
        />
      </div>
    </SectionContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// WORK EXPERIENCE SECTION
// ─────────────────────────────────────────────────────────────────────────
export interface WorkExperienceEntry {
  id?: string;
  company: string;
  role: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  isCurrent: boolean;
  description?: string;
  achievements: string[];
}

interface WorkExperienceFormProps {
  experiences: WorkExperienceEntry[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: WorkExperienceEntry) => void;
}

export function WorkExperienceForm({
  experiences,
  onAdd,
  onRemove,
  onUpdate,
}: WorkExperienceFormProps) {
  return (
    <ArraySection
      title="Work Experience"
      description="Add your professional work history"
      items={experiences}
      onAdd={onAdd}
      renderItem={(experience, index) => (
        <ArrayItem
          index={index}
          title={`${experience.role} at ${experience.company}`}
          onRemove={() => onRemove(index)}
        >
          <Row columns={2}>
            <InputField
              label="Company Name"
              placeholder="Tech Corp Inc."
              value={experience.company}
              onChange={(val) =>
                onUpdate(index, { ...experience, company: val })
              }
              required
            />
            <InputField
              label="Job Title"
              placeholder="Senior Software Engineer"
              value={experience.role}
              onChange={(val) =>
                onUpdate(index, { ...experience, role: val })
              }
              required
            />
          </Row>

          <InputField
            label="Location"
            placeholder="San Francisco, CA"
            value={experience.location}
            onChange={(val) =>
              onUpdate(index, { ...experience, location: val })
            }
          />

          <Row columns={2}>
            <InputField
              label="Start Date"
              type="date"
              value={experience.startDate}
              onChange={(val) =>
                onUpdate(index, { ...experience, startDate: val })
              }
              required
            />
            <div>
              <InputField
                label="End Date"
                type="date"
                value={experience.endDate}
                onChange={(val) =>
                  onUpdate(index, { ...experience, endDate: val })
                }
              />
              <CheckboxField
                label="I currently work here"
                checked={experience.isCurrent}
                onChange={(checked) =>
                  onUpdate(index, {
                    ...experience,
                    isCurrent: checked,
                    endDate: checked ? undefined : experience.endDate,
                  })
                }
              />
            </div>
          </Row>

          <InputField
            label="Description (optional)"
            type="textarea"
            placeholder="Describe your responsibilities and key achievements..."
            value={experience.description}
            onChange={(val) =>
              onUpdate(index, { ...experience, description: val })
            }
          />

          <AchievementsList
            role={experience.role}
            achievements={experience.achievements}
            onUpdate={(achievements) =>
              onUpdate(index, { ...experience, achievements })
            }
          />
        </ArrayItem>
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ACHIEVEMENTS LIST - A sub-component for work experience
// ─────────────────────────────────────────────────────────────────────────
interface AchievementsListProps {
  role: string;
  achievements: string[];
  onUpdate: (achievements: string[]) => void;
}

function AchievementsList({ role, achievements, onUpdate }: AchievementsListProps) {
  const handleAdd = () => {
    onUpdate([...achievements, ""]);
  };

  const handleRemove = (index: number) => {
    onUpdate(achievements.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    onUpdate(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Key Achievements (optional)
      </label>
      <div className="space-y-2">
        {achievements.map((achievement, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Reduced API latency by 40%"
              value={achievement}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => handleRemove(idx)}
              className="text-slate-400 hover:text-red-600 p-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {achievements.length < 5 && (
        <button
          onClick={handleAdd}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add achievement
        </button>
      )}
      
      <AIBulletImprover 
        role={role} 
        bullets={achievements} 
        onSuccess={onUpdate} 
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EDUCATION SECTION
// ─────────────────────────────────────────────────────────────────────────
export interface EducationEntry {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  grade?: string;
  description?: string;
}

interface EducationFormProps {
  educations: EducationEntry[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: EducationEntry) => void;
}

export function EducationForm({
  educations,
  onAdd,
  onRemove,
  onUpdate,
}: EducationFormProps) {
  return (
    <ArraySection
      title="Education"
      description="Add your educational background"
      items={educations}
      onAdd={onAdd}
      renderItem={(education, index) => (
        <ArrayItem
          index={index}
          title={`${education.degree} from ${education.institution}`}
          onRemove={() => onRemove(index)}
        >
          <Row columns={2}>
            <InputField
              label="Institution"
              placeholder="University of California"
              value={education.institution}
              onChange={(val) =>
                onUpdate(index, { ...education, institution: val })
              }
              required
            />
            <InputField
              label="Degree"
              placeholder="Bachelor of Science"
              value={education.degree}
              onChange={(val) =>
                onUpdate(index, { ...education, degree: val })
              }
              required
            />
          </Row>

          <Row columns={2}>
            <InputField
              label="Field of Study"
              placeholder="Computer Science"
              value={education.fieldOfStudy}
              onChange={(val) =>
                onUpdate(index, { ...education, fieldOfStudy: val })
              }
            />
            <InputField
              label="Location"
              placeholder="Berkeley, CA"
              value={education.location}
              onChange={(val) =>
                onUpdate(index, { ...education, location: val })
              }
            />
          </Row>

          <Row columns={3}>
            <InputField
              label="Start Date"
              type="date"
              value={education.startDate}
              onChange={(val) =>
                onUpdate(index, { ...education, startDate: val })
              }
            />
            <InputField
              label="End Date"
              type="date"
              value={education.endDate}
              onChange={(val) =>
                onUpdate(index, { ...education, endDate: val })
              }
            />
            <InputField
              label="Grade / GPA"
              placeholder="3.8"
              value={education.grade}
              onChange={(val) =>
                onUpdate(index, { ...education, grade: val })
              }
            />
          </Row>

          <InputField
            label="Description (optional)"
            type="textarea"
            placeholder="Notable courses, honors, or activities..."
            value={education.description}
            onChange={(val) =>
              onUpdate(index, { ...education, description: val })
            }
          />
        </ArrayItem>
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SKILLS SECTION
// ─────────────────────────────────────────────────────────────────────────
export interface SkillEntry {
  id?: string;
  name: string;
  proficiency?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface SkillsFormProps {
  skills: SkillEntry[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: SkillEntry) => void;
}

export function SkillsForm({ skills, onAdd, onRemove, onUpdate }: SkillsFormProps) {
  return (
    <ArraySection
      title="Skills"
      description="List your professional skills"
      items={skills}
      onAdd={onAdd}
      maxItems={30}
      renderItem={(skill, index) => (
        <ArrayItem index={index} title={skill.name || "Skill"} onRemove={() => onRemove(index)}>
          <Row columns={2}>
            <InputField
              label="Skill Name"
              placeholder="e.g., React, Python, Project Management"
              value={skill.name}
              onChange={(val) => onUpdate(index, { ...skill, name: val })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Proficiency
              </label>
              <select
                value={skill.proficiency || ""}
                onChange={(e) =>
                  onUpdate(index, {
                    ...skill,
                    proficiency: (e.target.value as SkillEntry['proficiency']) || undefined,
                  })
                }
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select level...</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </Row>
        </ArrayItem>
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PROJECTS SECTION
// ─────────────────────────────────────────────────────────────────────────
export interface ProjectEntry {
  id?: string;
  name: string;
  description?: string;
  technologies?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
}

interface ProjectsFormProps {
  projects: ProjectEntry[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: ProjectEntry) => void;
}

export function ProjectsForm({
  projects,
  onAdd,
  onRemove,
  onUpdate,
}: ProjectsFormProps) {
  return (
    <ArraySection
      title="Projects"
      description="Showcase your portfolio projects"
      items={projects}
      onAdd={onAdd}
      renderItem={(project, index) => (
        <ArrayItem
          index={index}
          title={project.name || "Project"}
          onRemove={() => onRemove(index)}
        >
          <InputField
            label="Project Name"
            placeholder="E-commerce Platform"
            value={project.name}
            onChange={(val) => onUpdate(index, { ...project, name: val })}
            required
          />

          <InputField
            label="Description"
            type="textarea"
            placeholder="Describe what the project does..."
            value={project.description}
            onChange={(val) =>
              onUpdate(index, { ...project, description: val })
            }
          />

          <Row columns={2}>
            <InputField
              label="Technologies Used"
              placeholder="React, Node.js, PostgreSQL"
              value={project.technologies}
              onChange={(val) =>
                onUpdate(index, { ...project, technologies: val })
              }
            />
            <InputField
              label="Project URL"
              type="url"
              placeholder="https://github.com/..."
              value={project.url}
              onChange={(val) =>
                onUpdate(index, { ...project, url: val })
              }
            />
          </Row>

          <Row columns={2}>
            <InputField
              label="Start Date"
              type="date"
              value={project.startDate}
              onChange={(val) =>
                onUpdate(index, { ...project, startDate: val })
              }
            />
            <InputField
              label="End Date"
              type="date"
              value={project.endDate}
              onChange={(val) =>
                onUpdate(index, { ...project, endDate: val })
              }
            />
          </Row>
        </ArrayItem>
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS SECTION
// ─────────────────────────────────────────────────────────────────────────
export interface CertificationEntry {
  id?: string;
  name: string;
  issuer?: string;
  issueDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  url?: string;
}

interface CertificationsFormProps {
  certifications: CertificationEntry[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: CertificationEntry) => void;
}

export function CertificationsForm({
  certifications,
  onAdd,
  onRemove,
  onUpdate,
}: CertificationsFormProps) {
  return (
    <ArraySection
      title="Certifications"
      description="Add your professional certifications"
      items={certifications}
      onAdd={onAdd}
      renderItem={(cert, index) => (
        <ArrayItem
          index={index}
          title={cert.name || "Certification"}
          onRemove={() => onRemove(index)}
        >
          <Row columns={2}>
            <InputField
              label="Certification Name"
              placeholder="AWS Certified Solutions Architect"
              value={cert.name}
              onChange={(val) =>
                onUpdate(index, { ...cert, name: val })
              }
              required
            />
            <InputField
              label="Issuing Organization"
              placeholder="Amazon Web Services"
              value={cert.issuer}
              onChange={(val) =>
                onUpdate(index, { ...cert, issuer: val })
              }
            />
          </Row>

          <Row columns={2}>
            <InputField
              label="Issue Date"
              type="date"
              value={cert.issueDate}
              onChange={(val) =>
                onUpdate(index, { ...cert, issueDate: val })
              }
            />
            <InputField
              label="Expiry Date (optional)"
              type="date"
              value={cert.expiryDate}
              onChange={(val) =>
                onUpdate(index, { ...cert, expiryDate: val })
              }
            />
          </Row>

          <InputField
            label="Credential URL"
            type="url"
            placeholder="https://..."
            value={cert.url}
            onChange={(val) =>
              onUpdate(index, { ...cert, url: val })
            }
          />
        </ArrayItem>
      )}
    />
  );
}
