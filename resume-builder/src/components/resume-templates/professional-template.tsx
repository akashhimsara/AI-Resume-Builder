import type { ResumePreviewData } from "@/components/resume-editor/preview-sections";
import { formatRange } from "@/components/resume-editor/preview-sections";

export function ProfessionalResumeTemplate({ data }: { data: ResumePreviewData }) {
  const { personalInfo, headline, summary, workExperiences, educations, skills, projects, certifications } = data;

  const contactItems = [
    personalInfo?.email,
    personalInfo?.phone,
    personalInfo?.location,
    personalInfo?.linkedIn,
    personalInfo?.github,
    personalInfo?.portfolio,
  ].filter((v): v is string => Boolean(v && v.trim().length > 0));

  return (
    <article className="mx-auto w-full min-w-0 max-w-[850px] bg-white p-10 text-slate-900 shadow-sm print:max-w-none print:p-0 print:shadow-none font-serif">
      {/* Header */}
      <header className="mb-6 text-center">
        {personalInfo?.fullName && <h1 className="text-3xl font-bold tracking-wider uppercase mb-1">{personalInfo.fullName}</h1>}
        {(contactItems.length > 0 || headline) && (
          <div className="text-[12px] leading-snug space-y-1.5 mt-2">
            {headline && <div className="uppercase tracking-widest text-[10px] text-slate-600 font-semibold">{headline}</div>}
            {contactItems.length > 0 && <div className="flex flex-wrap justify-center gap-1.5 text-slate-800">
              {contactItems.map((item, idx) => (
                <span key={idx}>
                  {item}
                  {idx < contactItems.length - 1 && <span className="mx-2">•</span>}
                </span>
              ))}
            </div>}
          </div>
        )}
      </header>

      <div className="space-y-6">
        {summary && (
          <section>
            <h2 className="border-b border-slate-900 mb-2 text-center text-[11px] font-bold uppercase tracking-widest pb-1">Professional Summary</h2>
            <p className="text-[12px] leading-relaxed text-slate-800 text-justify">{summary}</p>
          </section>
        )}

        {workExperiences.filter(x => x.company || x.role).length > 0 && (
          <section>
            <h2 className="border-b border-slate-900 mb-3 text-center text-[11px] font-bold uppercase tracking-widest pb-1">Work Experience</h2>
            <div className="space-y-4">
              {workExperiences.filter(x => x.company || x.role).map((exp, idx) => (
                <div key={idx} className="text-[12px] text-slate-800">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold uppercase tracking-wide">{exp.role || "Role"}</span>
                    <span className="text-[11px] font-medium tracking-wider">{formatRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="italic">{exp.company || "Company"}</span>
                    {exp.location && <span className="text-[11px]">{exp.location}</span>}
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc pl-5 mt-1.5 space-y-0.5 text-[12px] leading-relaxed">
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {educations.filter(x => x.institution || x.degree).length > 0 && (
          <section>
            <h2 className="border-b border-slate-900 mb-3 text-center text-[11px] font-bold uppercase tracking-widest pb-1">Education</h2>
            <div className="space-y-3">
              {educations.filter(x => x.institution || x.degree).map((edu, idx) => (
                <div key={idx} className="text-[12px] text-slate-800">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold uppercase tracking-wide">{edu.degree || "Degree"}</span>
                    <span className="text-[11px] font-medium tracking-wider">{formatRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="italic">{edu.institution || "Institution"}</span>
                    {edu.location && <span className="text-[11px]">{edu.location}</span>}
                  </div>
                  {edu.grade && <div className="text-[11px] mt-0.5">Grade: {edu.grade}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.filter(x => x.name).length > 0 && (
          <section>
            <h2 className="border-b border-slate-900 mb-3 text-center text-[11px] font-bold uppercase tracking-widest pb-1">Skills</h2>
            <div className="text-[12px] leading-relaxed text-center text-slate-800">
              {skills.filter(x => x.name).map((skill, idx) => (
                <span key={idx} className="inline-block">
                  <span className="font-medium">{skill.name}</span>
                  {idx < skills.length - 1 && <span className="mx-2">•</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {projects.filter(x => x.name).length > 0 && (
          <section>
            <h2 className="border-b border-slate-900 mb-3 text-center text-[11px] font-bold uppercase tracking-widest pb-1">Projects</h2>
            <div className="space-y-3">
              {projects.filter(x => x.name).map((proj, idx) => (
                <div key={idx} className="text-[12px] text-slate-800">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold uppercase tracking-wide">{proj.name}</span>
                    <span className="text-[11px] font-medium tracking-wider">{formatRange(proj.startDate, proj.endDate)}</span>
                  </div>
                  <div className="leading-relaxed text-justify mb-1">{proj.description}</div>
                  {proj.technologies && <div className="text-[11px]"><strong>Tech:</strong> {proj.technologies}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.filter(x => x.name).length > 0 && (
          <section>
            <h2 className="border-b border-slate-900 mb-3 text-center text-[11px] font-bold uppercase tracking-widest pb-1">Certifications</h2>
            <div className="space-y-2">
              {certifications.filter(x => x.name).map((cert, idx) => (
                <div key={idx} className="text-[12px] text-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{cert.name}</span>
                    {cert.issuer && <span className="italic"> — {cert.issuer}</span>}
                  </div>
                  <div className="text-[11px]">{formatRange(cert.issueDate, cert.expiryDate)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
