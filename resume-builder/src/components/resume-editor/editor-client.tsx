"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import type { PersonalInfo } from "@/server/resumes/resume.schemas";
import {
  CertificationsForm,
  EducationForm,
  PersonalInfoForm,
  ProjectsForm,
  SkillsForm,
  SummaryForm,
  WorkExperienceForm,
  type CertificationEntry,
  type EducationEntry,
  type ProjectEntry,
  type SkillEntry,
  type WorkExperienceEntry,
} from "@/components/resume-editor/resume-sections";

type SaveState = "idle" | "saving" | "saved" | "error";

export type EditorInitialData = {
  personalInfo: PersonalInfo;
  headline?: string;
  summary?: string;
  workExperiences: WorkExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
};

type EditorClientProps = {
  resumeId: string;
  initialData: EditorInitialData;
};

const AUTO_SAVE_DELAY_MS = 1200;

function todayAsDateInput() {
  return new Date().toISOString().slice(0, 10);
}

function sanitizePersonalInfo(input: PersonalInfo): PersonalInfo {
  return {
    fullName: input.fullName && input.fullName.trim().length >= 2 ? input.fullName.trim() : undefined,
    email: input.email?.trim() || "",
    phone: input.phone?.trim() || "",
    location: input.location?.trim() || "",
    linkedIn: input.linkedIn?.trim() || "",
    github: input.github?.trim() || "",
    portfolio: input.portfolio?.trim() || "",
  };
}

/**
 * Rich resume editor with debounced autosave and live preview.
 */
export function EditorClient({ resumeId, initialData }: EditorClientProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialData.personalInfo);
  const [headline, setHeadline] = useState(initialData.headline ?? "");
  const [summary, setSummary] = useState(initialData.summary ?? "");
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceEntry[]>(initialData.workExperiences);
  const [educations, setEducations] = useState<EducationEntry[]>(initialData.educations);
  const [skills, setSkills] = useState<SkillEntry[]>(initialData.skills);
  const [projects, setProjects] = useState<ProjectEntry[]>(initialData.projects);
  const [certifications, setCertifications] = useState<CertificationEntry[]>(initialData.certifications);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRunRef = useRef(true);

  const payload = useMemo(() => {
    const trimmedHeadline = headline.trim();
    const trimmedSummary = summary.trim();

    const normalizedWorkExperiences = workExperiences
      .filter((item) => item.company.trim().length > 0 || item.role.trim().length > 0)
      .map((item) => ({
        ...item,
        startDate: item.startDate || todayAsDateInput(),
        endDate: item.isCurrent ? null : item.endDate || null,
        achievements: item.achievements
          .map((achievement) => achievement.trim())
          .filter((achievement) => achievement.length > 0),
      }));

    const normalizedEducations = educations
      .filter((item) => item.institution.trim().length > 0 || item.degree.trim().length > 0)
      .map((item) => ({
        ...item,
        startDate: item.startDate || undefined,
        endDate: item.endDate || undefined,
      }));

    const normalizedSkills = skills
      .map((item) => ({ ...item, name: item.name.trim() }))
      .filter((item) => item.name.length > 0);

    const normalizedProjects = projects
      .filter((item) => item.name.trim().length > 0)
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        description: item.description.trim() || undefined,
        technologies: item.technologies.trim() || undefined,
        startDate: item.startDate || undefined,
        endDate: item.endDate || undefined,
        url: item.url.trim() || "",
      }));

    const normalizedCertifications = certifications
      .filter((item) => item.name.trim().length > 0)
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        issuer: item.issuer.trim() || undefined,
        issueDate: item.issueDate || undefined,
        expiryDate: item.expiryDate || undefined,
        url: item.url.trim() || "",
      }));

    return {
      personalInfo: sanitizePersonalInfo(personalInfo),
      headline: trimmedHeadline.length === 0 ? null : trimmedHeadline,
      professionalSummary:
        trimmedSummary.length === 0
          ? null
          : trimmedSummary.length >= 10
            ? trimmedSummary
            : undefined,
      workExperiences: normalizedWorkExperiences,
      educations: normalizedEducations,
      skills: normalizedSkills,
      projects: normalizedProjects,
      certifications: normalizedCertifications,
    };
  }, [personalInfo, headline, summary, workExperiences, educations, skills, projects, certifications]);

  const saveNow = useCallback(async () => {
    setSaveState("saving");

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Save failed with status ${response.status}`);
      }

      setSaveState("saved");
      setLastSavedAt(new Date());
    } catch {
      setSaveState("error");
    }
  }, [payload, resumeId]);

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }

    setSaveState("idle");

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      void saveNow();
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [saveNow]);

  const saveMessage =
    saveState === "saving"
      ? "Saving..."
      : saveState === "saved"
        ? `Saved${lastSavedAt ? ` at ${lastSavedAt.toLocaleTimeString()}` : ""}`
        : saveState === "error"
          ? "Autosave failed. Keep editing and try again."
          : "Changes are saved automatically.";

  const saveMessageClass =
    saveState === "error"
      ? "text-red-600"
      : saveState === "saved"
        ? "text-emerald-600"
        : "text-slate-500";

  const addWorkExperience = () => {
    setWorkExperiences((current) => [
      ...current,
      {
        company: "",
        role: "",
        location: "",
        startDate: todayAsDateInput(),
        endDate: "",
        isCurrent: false,
        description: "",
        achievements: [],
      },
    ]);
  };

  const addEducation = () => {
    setEducations((current) => [
      ...current,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      },
    ]);
  };

  const addSkill = () => {
    setSkills((current) => [
      ...current,
      {
        name: "",
        proficiency: undefined,
      },
    ]);
  };

  const addProject = () => {
    setProjects((current) => [
      ...current,
      {
        name: "",
        description: "",
        technologies: "",
        url: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const addCertification = () => {
    setCertifications((current) => [
      ...current,
      {
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        url: "",
      },
    ]);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-7">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4">
          <p className={`text-sm ${saveMessageClass}`}>{saveMessage}</p>
        </div>

        <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />

        <SummaryForm
          headline={headline}
          professionalSummary={summary}
          onHeadlineChange={setHeadline}
          onSummaryChange={setSummary}
        />

        <WorkExperienceForm
          experiences={workExperiences}
          onAdd={addWorkExperience}
          onRemove={(index) =>
            setWorkExperiences((current) => current.filter((_, i) => i !== index))
          }
          onUpdate={(index, data) =>
            setWorkExperiences((current) =>
              current.map((item, i) => (i === index ? data : item))
            )
          }
        />

        <EducationForm
          educations={educations}
          onAdd={addEducation}
          onRemove={(index) =>
            setEducations((current) => current.filter((_, i) => i !== index))
          }
          onUpdate={(index, data) =>
            setEducations((current) =>
              current.map((item, i) => (i === index ? data : item))
            )
          }
        />

        <SkillsForm
          skills={skills}
          onAdd={addSkill}
          onRemove={(index) => setSkills((current) => current.filter((_, i) => i !== index))}
          onUpdate={(index, data) =>
            setSkills((current) => current.map((item, i) => (i === index ? data : item)))
          }
        />

        <ProjectsForm
          projects={projects}
          onAdd={addProject}
          onRemove={(index) =>
            setProjects((current) => current.filter((_, i) => i !== index))
          }
          onUpdate={(index, data) =>
            setProjects((current) =>
              current.map((item, i) => (i === index ? data : item))
            )
          }
        />

        <CertificationsForm
          certifications={certifications}
          onAdd={addCertification}
          onRemove={(index) =>
            setCertifications((current) => current.filter((_, i) => i !== index))
          }
          onUpdate={(index, data) =>
            setCertifications((current) =>
              current.map((item, i) => (i === index ? data : item))
            )
          }
        />
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-6">
        <ResumePreview
          personalInfo={personalInfo}
          headline={headline}
          summary={summary}
          workExperiences={workExperiences}
          educations={educations}
          skills={skills}
          projects={projects}
          certifications={certifications}
        />
        </div>
      </div>
    </div>
  );
}
