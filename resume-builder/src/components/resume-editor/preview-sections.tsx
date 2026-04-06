import type { PersonalInfo } from "@/server/resumes/resume.schemas";
import type {
  CertificationEntry,
  EducationEntry,
  ProjectEntry,
  SkillEntry,
  WorkExperienceEntry,
} from "@/components/resume-editor/resume-sections";

export type ResumePreviewData = {
  personalInfo?: PersonalInfo;
  headline?: string;
  summary?: string;
  workExperiences: WorkExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
};

export function formatDate(value?: string) {
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

export function formatRange(start?: string, end?: string, current?: boolean) {
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

type SectionTitleProps = {
  title: string;
};

export function PreviewSectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="h-2 w-2 rounded-full bg-sky-500" />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">
        {title}
      </h2>
    </div>
  );
}

export function PreviewHeaderSection({ personalInfo, headline }: Pick<ResumePreviewData, "personalInfo" | "headline">) {
  const contactLine = [personalInfo?.email, personalInfo?.phone, personalInfo?.location]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join("  |  ");

  const profileLinks = [
    personalInfo?.linkedIn ? { label: "LinkedIn", href: personalInfo.linkedIn } : null,
    personalInfo?.github ? { label: "GitHub", href: personalInfo.github } : null,
    personalInfo?.portfolio ? { label: "Portfolio", href: personalInfo.portfolio } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  if (!personalInfo?.fullName && !headline && !contactLine && profileLinks.length === 0) {
    return null;
  }

  const contactItems = [personalInfo?.email, personalInfo?.phone, personalInfo?.location]
    .filter((value): value is string => Boolean(value && value.trim().length > 0));

  return (
    <header className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {personalInfo?.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt="Profile photo"
            className="h-24 w-24 rounded-full border-2 border-white object-cover shadow-md"
          />
        )}

        <div className="min-w-0">
          {personalInfo?.fullName && (
            <h1 className="text-3xl font-extrabold tracking-tight text-sky-900 sm:text-4xl">
              {personalInfo.fullName}
            </h1>
          )}

          {headline && <p className="mt-1 text-base font-semibold text-slate-700 sm:text-lg">{headline}</p>}

          {(contactItems.length > 0 || profileLinks.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {contactItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800"
                >
                  {item}
                </span>
              ))}

              {profileLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:border-sky-300 hover:text-sky-900"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function PreviewSummarySection({ summary }: Pick<ResumePreviewData, "summary">) {
  if (!summary) {
    return null;
  }

  return (
    <section className="space-y-4">
      <PreviewSectionTitle title="Summary" />
      <p className="text-[15px] leading-7 text-slate-700 whitespace-pre-wrap break-words">
        {summary}
      </p>
    </section>
  );
}

export function PreviewExperienceSection({ workExperiences }: Pick<ResumePreviewData, "workExperiences">) {
  const visibleWork = workExperiences.filter((item) => item.company || item.role);

  if (visibleWork.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <PreviewSectionTitle title="Experience" />
      <div className="space-y-4">
        {visibleWork.map((item, index) => {
          const dateRange = formatRange(item.startDate, item.endDate, item.isCurrent);

          return (
            <article key={`${item.id ?? "work"}-${index}`} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">{item.role || "Role"}</h3>
                  <p className="text-sm font-medium text-slate-700">
                    {item.company || "Company"}
                    {item.location ? `, ${item.location}` : ""}
                  </p>
                </div>
                {dateRange && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{dateRange}</p>
                )}
              </div>

              {item.description && (
                <p className="text-sm leading-6 text-slate-700 break-words">{item.description}</p>
              )}

              {item.achievements.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                  {item.achievements.map((achievement, achievementIndex) => (
                    <li key={`${item.id ?? "work-ach"}-${index}-${achievementIndex}`}>{achievement}</li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PreviewEducationSection({ educations }: Pick<ResumePreviewData, "educations">) {
  const visibleEducation = educations.filter((item) => item.institution || item.degree);

  if (visibleEducation.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <PreviewSectionTitle title="Education" />
      <div className="space-y-5">
        {visibleEducation.map((item, index) => {
          const dateRange = formatRange(item.startDate, item.endDate);

          return (
            <article key={`${item.id ?? "edu"}-${index}`} className="space-y-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">{item.degree || "Degree"}</h3>
                  <p className="text-sm font-medium text-slate-700">{item.institution || "Institution"}</p>
                </div>
                {dateRange && (
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{dateRange}</p>
                )}
              </div>

              {item.fieldOfStudy && <p className="text-sm text-slate-700">Field: {item.fieldOfStudy}</p>}
              {item.grade && <p className="text-sm text-slate-700">Grade: {item.grade}</p>}
              {item.description && (
                <p className="text-sm leading-6 text-slate-700 break-words">{item.description}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PreviewSkillsSection({ skills }: Pick<ResumePreviewData, "skills">) {
  const visibleSkills = skills.filter((item) => item.name.trim().length > 0);

  if (visibleSkills.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <PreviewSectionTitle title="Skills" />
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
  );
}

export function PreviewProjectsSection({ projects }: Pick<ResumePreviewData, "projects">) {
  const visibleProjects = projects.filter((item) => item.name.trim().length > 0);

  if (visibleProjects.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <PreviewSectionTitle title="Projects" />
      <div className="space-y-5">
        {visibleProjects.map((item, index) => {
          const dateRange = formatRange(item.startDate, item.endDate);

          return (
            <article key={`${item.id ?? "project"}-${index}`} className="space-y-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-[15px] font-semibold text-slate-900">{item.name}</h3>
                {dateRange && (
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{dateRange}</p>
                )}
              </div>
              {item.description && (
                <p className="text-sm leading-6 text-slate-700 break-words">{item.description}</p>
              )}
              {item.technologies && <p className="text-sm text-slate-700 break-words">Tech: {item.technologies}</p>}
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
  );
}

export function PreviewCertificationsSection({ certifications }: Pick<ResumePreviewData, "certifications">) {
  const visibleCertifications = certifications.filter((item) => item.name.trim().length > 0);

  if (visibleCertifications.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <PreviewSectionTitle title="Certifications" />
      <div className="space-y-4">
        {visibleCertifications.map((item, index) => {
          const dateRange = formatRange(item.issueDate, item.expiryDate);

          return (
            <article key={`${item.id ?? "cert"}-${index}`} className="space-y-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-[15px] font-semibold text-slate-900">{item.name}</h3>
                {dateRange && (
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{dateRange}</p>
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
  );
}
