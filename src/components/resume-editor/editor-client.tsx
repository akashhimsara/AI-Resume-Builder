"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ResumePreview } from "./resume-preview";
import type { PersonalInfo, ResumeTemplate } from "@/server/resumes/resume.schemas";
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
import { AITailorModule } from "./ai-tailor-module";

type SaveState = "idle" | "saving" | "saved" | "error";

export type EditorInitialData = {
  template: ResumeTemplate;
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
    photoUrl: input.photoUrl?.trim() || "",
  };
}

/**
 * Rich resume editor with debounced autosave and live preview.
 */
export function EditorClient({ resumeId, initialData }: EditorClientProps) {
  const [template, setTemplate] = useState<ResumeTemplate>(initialData.template ?? "professional");
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

    const seenSkills = new Set<string>();
    const normalizedSkills = skills
      .map((item) => ({ ...item, name: item.name.trim() }))
      .filter((item) => item.name.length > 0)
      .filter((item) => {
        const key = item.name.toLowerCase();
        if (seenSkills.has(key)) {
          return false;
        }
        seenSkills.add(key);
        return true;
      });

    const normalizedProjects = projects
      .filter((item) => item.name.trim().length > 0)
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        description: item.description?.trim() || undefined,
        technologies: item.technologies?.trim() || undefined,
        startDate: item.startDate || undefined,
        endDate: item.endDate || undefined,
        url: item.url?.trim() || "",
      }));

    const normalizedCertifications = certifications
      .filter((item) => item.name.trim().length > 0)
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        issuer: item.issuer?.trim() || undefined,
        issueDate: item.issueDate || undefined,
        expiryDate: item.expiryDate || undefined,
        url: item.url?.trim() || "",
      }));

    return {
      template,
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
  }, [template, personalInfo, headline, summary, workExperiences, educations, skills, projects, certifications]);

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
      toast.error("Autosave failed. Check your connection or keep editing to retry.", { id: "autosave-error" });
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
    <div className="mx-auto mt-6 grid w-full max-w-[1480px] gap-8 lg:grid-cols-12 print:mt-0 print:block print:max-w-none">
      <div className="lg:col-span-12 rounded-3xl border border-slate-200 glass-panel p-6 shadow-sm mb-2 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Resume Studio</h1>
            <p className="mt-1.5 text-sm text-slate-500">Professional editing mode with deep AI integration and live preview.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> Auto-Saving Enabled
            </span>
            <AITailorModule 
              resumeData={payload}
              currentSkills={skills}
              onApplySummary={setSummary}
              onApplySkills={setSkills}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-7 print:hidden">
        {/* Template Selector UI */}
        <div className="flex flex-col gap-4 rounded-2xl glass-panel p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Choose Template</h2>
            <p className={`text-sm ${saveMessageClass}`}>{saveMessage}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3">
            {[
              {
                id: "modern",
                label: "Modern",
                desc: "Clean and vibrant",
                // Placeholder thumbnail, replace with real image if available
                thumb: (
                  <div className="h-20 w-full rounded bg-gradient-to-br from-sky-200 to-sky-50 flex items-center justify-center">
                    <span className="text-sky-600 text-lg font-bold">M</span>
                  </div>
                ),
              },
              {
                id: "professional",
                label: "Professional",
                desc: "Structured and classic",
                thumb: (
                  <div className="h-20 w-full rounded bg-gradient-to-br from-slate-200 to-slate-50 flex items-center justify-center">
                    <span className="text-slate-600 text-lg font-bold">P</span>
                  </div>
                ),
              },
              {
                id: "minimal",
                label: "Minimal",
                desc: "Simple and elegant",
                thumb: (
                  <div className="h-20 w-full rounded bg-gradient-to-br from-gray-200 to-white flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-bold">Min</span>
                  </div>
                ),
              },
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setTemplate(tpl.id as ResumeTemplate)}
                className={`group flex flex-col items-stretch rounded-xl border-2 p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  template === tpl.id
                    ? "border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-200"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
                aria-pressed={template === tpl.id}
              >
                <div className="mb-2">{tpl.thumb}</div>
                  <span className={`font-semibold ${template === tpl.id ? "text-indigo-700" : "text-slate-700"}`}>
                  {tpl.label}
                </span>
                <span className="mt-1 text-xs text-slate-500">{tpl.desc}</span>
                {template === tpl.id && (
                  <span className="mt-2 inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 font-medium self-end">Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />

        <SummaryForm
          headline={headline}
          professionalSummary={summary}
          skillsContext={skills.map(s => s.name).filter(Boolean)}
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

      <div className="min-w-0 lg:col-span-5 print:col-span-12 print:m-0 print:p-0">
        <div className="sticky top-6 print:static">
          {/* PDF Download Button and Preview */}
          <PDFDownloadableResume
            template={template}
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

// --- PDF Download Button Wrapper ---
import { exportResumeToPDF } from "./export-pdf";

interface PDFDownloadableResumeProps {
  template: ResumeTemplate;
  personalInfo: PersonalInfo;
  headline?: string;
  summary?: string;
  workExperiences: WorkExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
}

// (removed duplicate useState import)


// (removed duplicate useEffect import)

function PDFDownloadableResume(props: PDFDownloadableResumeProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    setError(null);
    if (previewRef.current) {
      setLoading(true);
      try {
        await exportResumeToPDF(previewRef.current, "resume.pdf");
        toast.success("PDF generated successfully!");
      } catch (error: unknown) {
        console.error("PDF export failed:", error);
        toast.error("PDF export failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isClient) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className={`mb-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-white text-sm font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all hover:shadow-xl active:scale-[0.99] print:hidden ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Preparing PDF...
          </span>
        ) : "Download PDF"}
      </button>

      <div ref={previewRef} className="bg-white print:bg-white">
        <ResumePreview {...props} />
      </div>
    </div>
  );
}
