import type { ResumePreviewData } from "@/components/resume-editor/preview-sections";
import { formatRange } from "@/components/resume-editor/preview-sections";
import React from "react";

function SectionRow({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row items-start mb-6 gap-2 sm:gap-0">
      <div className="w-full sm:w-[20%] shrink-0 sm:pr-4 pt-0.5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
          {title}
        </h2>
      </div>
      <div className="w-full sm:w-[80%] min-w-0">{children}</div>
    </div>
  );
}

export function MinimalResumeTemplate({ data }: { data: ResumePreviewData }) {
  const { personalInfo, headline, summary, workExperiences, educations, skills, projects, certifications } = data;

  const contactItems = [
    personalInfo?.email,
    personalInfo?.phone,
    personalInfo?.location,
    personalInfo?.linkedIn,
    personalInfo?.portfolio,
  ].filter((v): v is string => Boolean(v && v.trim().length > 0));

  return (
    <article className="mx-auto w-full min-w-0 max-w-[850px] bg-white p-10 text-slate-900 shadow-sm print:max-w-none print:p-0 print:shadow-none font-sans">
      {/* Header */}
      <header className="mb-8 border-b-2 border-emerald-800 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
        <div className="min-w-0 flex-1 pr-2">
          {personalInfo?.fullName && <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-slate-900 break-words">{personalInfo.fullName}</h1>}
          {headline && <div className="text-sm font-semibold text-emerald-800 tracking-wide mt-1.5">{headline}</div>}
        </div>
        <div className="w-full sm:w-[38%] min-w-0 shrink-0 text-left sm:text-right text-[10px] leading-4 text-slate-600 font-medium space-y-1">
            {contactItems.map((item, idx) => (
              <div key={idx} className="break-words [overflow-wrap:anywhere]">{item}</div>
            ))}
        </div>
      </header>

      <div className="space-y-1">
        {summary && (
          <SectionRow title="Summary">
            <p className="text-[11px] leading-relaxed text-slate-800 text-justify">{summary}</p>
          </SectionRow>
        )}

        {workExperiences.filter(x => x.company || x.role).length > 0 && (
          <SectionRow title="Experience">
            <div className="space-y-5">
              {workExperiences.filter(x => x.company || x.role).map((exp, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-0.5">
                    <span className="font-bold text-[12px] text-slate-900 min-w-0 flex-1 basis-[220px] break-words">{exp.company || "Company"}</span>
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase shrink-0 ml-auto">{formatRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                  </div>
                  <div className="italic text-slate-600 mb-1.5">{exp.role || "Role"} {exp.location && <span>— {exp.location}</span>}</div>
                  
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed text-slate-700">
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </SectionRow>
        )}

        {educations.filter(x => x.institution || x.degree).length > 0 && (
          <SectionRow title="Education">
            <div className="space-y-4">
              {educations.filter(x => x.institution || x.degree).map((edu, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-0.5">
                    <span className="font-bold text-[12px] text-slate-900 min-w-0 flex-1 basis-[220px] break-words">{edu.institution || "Institution"}</span>
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase shrink-0 ml-auto">{formatRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  <div className="text-slate-800">{edu.degree || "Degree"}</div>
                  {edu.grade && <div className="text-slate-500 mt-0.5">Grade: {edu.grade}</div>}
                </div>
              ))}
            </div>
          </SectionRow>
        )}

        {skills.filter(x => x.name).length > 0 && (
          <SectionRow title="Skills">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-[11px] text-slate-800">
              {skills.filter(x => x.name).map((skill, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-bold">{skill.name}</span>
                  {skill.proficiency && (
                    <div className="w-full bg-slate-100 h-1 mt-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: skill.proficiency === 'Expert' ? '100%' : skill.proficiency === 'Advanced' ? '75%' : skill.proficiency === 'Intermediate' ? '50%' : '25%' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionRow>
        )}

        {projects.filter(x => x.name).length > 0 && (
          <SectionRow title="Projects">
            <div className="space-y-4">
              {projects.filter(x => x.name).map((proj, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-0.5">
                    <span className="font-bold text-[12px] text-slate-900 min-w-0 flex-1 basis-[220px] break-words">{proj.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase shrink-0 ml-auto">{formatRange(proj.startDate, proj.endDate)}</span>
                  </div>
                  <div className="leading-relaxed text-slate-700 text-justify mb-1">{proj.description}</div>
                  {proj.technologies && <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tech: {proj.technologies}</div>}
                </div>
              ))}
            </div>
          </SectionRow>
        )}

        {certifications.filter(x => x.name).length > 0 && (
          <SectionRow title="Certifications">
            <div className="space-y-4">
              {certifications.filter(x => x.name).map((cert, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-0.5">
                    <span className="font-bold text-[12px] text-slate-900 min-w-0 flex-1 basis-[220px] break-words">{cert.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase shrink-0 ml-auto">{formatRange(cert.issueDate, cert.expiryDate)}</span>
                  </div>
                  {cert.issuer && <div className="text-slate-800">{cert.issuer}</div>}
                  {cert.url && <div className="text-slate-500 truncate mt-0.5">{cert.url.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                </div>
              ))}
            </div>
          </SectionRow>
        )}

      </div>
    </article>
  );
}
