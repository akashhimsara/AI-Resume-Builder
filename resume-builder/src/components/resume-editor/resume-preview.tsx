"use client";

import type { PersonalInfo } from "@/server/resumes/resume.schemas";
import type {
  CertificationEntry,
  EducationEntry,
  ProjectEntry,
  SkillEntry,
  WorkExperienceEntry,
} from "@/components/resume-editor/resume-sections";

type ResumePreviewProps = {
  personalInfo?: PersonalInfo;
  headline?: string;
  summary?: string;
  workExperiences: WorkExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
};

type ProfileLink = {
  label: string;
  href: string;
};

function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(date);
}

function formatRange(start?: string, end?: string, current?: boolean) {
  const startLabel = formatDate(start);
  const endLabel = current ? "Present" : formatDate(end);

  if (!startLabel && !endLabel) {
    return "";
  }

  if (!startLabel) {
    return endLabel;
  }

  if (!endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
}

export function ResumePreview({
  personalInfo,
  headline,
  summary,
  workExperiences,
  educations,
  skills,
  projects,
  certifications,
}: ResumePreviewProps) {
  const visibleWork = workExperiences.filter((item) => item.company || item.role);
  const visibleEducation = educations.filter((item) => item.institution || item.degree);
  const visibleSkills = skills.filter((item) => item.name.trim().length > 0);
  const visibleProjects = projects.filter((item) => item.name.trim().length > 0);
  const visibleCertifications = certifications.filter((item) => item.name.trim().length > 0);

  const contactLine = [personalInfo?.email, personalInfo?.phone, personalInfo?.location]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join("  |  ");

  const profileLinks: ProfileLink[] = [
    personalInfo?.linkedIn ? { label: "LinkedIn", href: personalInfo.linkedIn } : null,
    personalInfo?.github ? { label: "GitHub", href: personalInfo.github } : null,
    personalInfo?.portfolio ? { label: "Portfolio", href: personalInfo.portfolio } : null,
  ].filter((item): item is ProfileLink => item !== null);

  const sectionHeadingClass =
    "border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700";

  return (
    <article className="mx-auto max-w-[850px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <header className="border-b-2 border-slate-300 pb-6">
        {personalInfo?.fullName && (
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {personalInfo.fullName}
          </h1>
        )}

        {headline && (
          <p className="mt-2 text-base font-medium text-slate-700 sm:text-lg">{headline}</p>
        )}

        {(contactLine || profileLinks.length > 0) && (
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {contactLine && <p className="leading-relaxed">{contactLine}</p>}
            {profileLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="mt-8 space-y-8">
        {summary && (
          <section className="space-y-4">
            <h2 className={sectionHeadingClass}>Summary</h2>
            <p className="text-[15px] leading-7 text-slate-700">{summary}</p>
          </section>
        )}

        {visibleWork.length > 0 && (
          <section className="space-y-5">
            <h2 className={sectionHeadingClass}>Experience</h2>
            <div className="space-y-5">
              {visibleWork.map((item, index) => {
                const dateRange = formatRange(item.startDate, item.endDate, item.isCurrent);

                return (
                  <article key={`${item.id ?? "work"}-${index}`} className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">
                          {item.role || "Role"}
                        </h3>
                        <p className="text-sm font-medium text-slate-700">
                          {item.company || "Company"}
                          {item.location ? `, ${item.location}` : ""}
                        </p>
                      </div>
                      {dateRange && (
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {dateRange}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                    )}

                    {item.achievements.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                        {item.achievements.map((achievement, achievementIndex) => (
                          <li key={`${item.id ?? "work-ach"}-${index}-${achievementIndex}`}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {visibleEducation.length > 0 && (
          <section className="space-y-5">
            <h2 className={sectionHeadingClass}>Education</h2>
            <div className="space-y-5">
              {visibleEducation.map((item, index) => {
                const dateRange = formatRange(item.startDate, item.endDate);

                return (
                  <article key={`${item.id ?? "edu"}-${index}`} className="space-y-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">
                          {item.degree || "Degree"}
                        </h3>
                        <p className="text-sm font-medium text-slate-700">
                          {item.institution || "Institution"}
                        </p>
                      </div>
                      {dateRange && (
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {dateRange}
                        </p>
                      )}
                    </div>

                    {item.fieldOfStudy && (
                      <p className="text-sm text-slate-700">Field: {item.fieldOfStudy}</p>
                    )}
                    {item.grade && <p className="text-sm text-slate-700">Grade: {item.grade}</p>}
                    {item.description && (
                      <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {visibleSkills.length > 0 && (
          <section className="space-y-4">
            <h2 className={sectionHeadingClass}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {visibleSkills.map((item, index) => (
                <span
                  key={`${item.id ?? "skill"}-${index}`}
                  className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-sm text-slate-800"
                >
                  {item.name}
                  {item.proficiency ? ` (${item.proficiency})` : ""}
                </span>
              ))}
            </div>
          </section>
        )}

        {visibleProjects.length > 0 && (
          <section className="space-y-5">
            <h2 className={sectionHeadingClass}>Projects</h2>
            <div className="space-y-5">
              {visibleProjects.map((item, index) => {
                const dateRange = formatRange(item.startDate, item.endDate);

                return (
                  <article key={`${item.id ?? "project"}-${index}`} className="space-y-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-[15px] font-semibold text-slate-900">{item.name}</h3>
                      {dateRange && (
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {dateRange}
                        </p>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                    )}
                    {item.technologies && (
                      <p className="text-sm text-slate-700">Tech: {item.technologies}</p>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900"
                      >
                        View Project
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {visibleCertifications.length > 0 && (
          <section className="space-y-5">
            <h2 className={sectionHeadingClass}>Certifications</h2>
            <div className="space-y-4">
              {visibleCertifications.map((item, index) => {
                const dateRange = formatRange(item.issueDate, item.expiryDate);

                return (
                  <article key={`${item.id ?? "cert"}-${index}`} className="space-y-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-[15px] font-semibold text-slate-900">{item.name}</h3>
                      {dateRange && (
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {dateRange}
                        </p>
                      )}
                    </div>
                    {item.issuer && <p className="text-sm text-slate-700">{item.issuer}</p>}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900"
                      >
                        View Credential
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
