import type { ResumePreviewData } from "@/components/resume-editor/preview-sections";
import { formatRange } from "@/components/resume-editor/preview-sections";

// Define local tiny SVGs for contact if icons don't exist
const IconMail = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconPhone = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const IconLocation = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconLink = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;

export function ModernResumeTemplate({ data }: { data: ResumePreviewData }) {
  const { personalInfo, headline, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <article className="mx-auto w-full min-w-0 max-w-[850px] shadow-sm print:max-w-none print:shadow-none font-sans flex min-h-[1100px] bg-white">
      {/* LEFT COLUMN: Sidebar */}
      <aside className="w-[34%] shrink-0 bg-[#0f345a] text-slate-100 p-8 flex flex-col gap-8 print:bg-[#0f345a] print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        
        {personalInfo?.photoUrl && (
          <div className="flex justify-center pt-2">
            <img src={personalInfo.photoUrl} alt="Profile" className="w-[140px] h-[140px] shrink-0 aspect-square rounded-full object-cover border-4 border-slate-100/20 shadow-lg" />
          </div>
        )}

        <section>
          <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] border-b border-slate-100/20 pb-2 mb-4 text-white">Contact</h2>
          <div className="space-y-3.5 text-[12px] font-medium tracking-wide">
            {personalInfo?.email && <div className="flex items-center gap-3 min-w-0"><span className="opacity-80 shrink-0"><IconMail /></span> <span className="min-w-0 flex-1 truncate" title={personalInfo.email}>{personalInfo.email}</span></div>}
            {personalInfo?.phone && <div className="flex items-center gap-3 min-w-0"><span className="opacity-80 shrink-0"><IconPhone /></span> <span className="min-w-0 flex-1 truncate" title={personalInfo.phone}>{personalInfo.phone}</span></div>}
            {personalInfo?.location && <div className="flex items-center gap-3 min-w-0"><span className="opacity-80 shrink-0"><IconLocation /></span> <span className="min-w-0 flex-1 truncate" title={personalInfo.location}>{personalInfo.location}</span></div>}
            {personalInfo?.linkedIn && <div className="flex items-center gap-3 min-w-0"><span className="opacity-80 shrink-0"><IconLink /></span> <span className="min-w-0 flex-1 truncate" title={personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}>{personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}</span></div>}
            {personalInfo?.portfolio && <div className="flex items-center gap-3 min-w-0"><span className="opacity-80 shrink-0"><IconLink /></span> <span className="min-w-0 flex-1 truncate" title={personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}>{personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span></div>}
          </div>
        </section>

        {summary && ( // Moved summary back to main if it's too long? No, left is fine if we justify. Let's make it look clean.
          <section>
            <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] border-b border-slate-100/20 pb-2 mb-4 text-white">Profile</h2>
            <p className="text-[12px] leading-relaxed text-slate-200 text-justify">{summary}</p>
          </section>
        )}

        {skills.filter(x => x.name).length > 0 && (
          <section>
            <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] border-b border-slate-100/20 pb-2 mb-4 text-white">Skills</h2>
            <div className="flex flex-col gap-2.5 text-[12px] font-medium tracking-wide">
              {skills.filter(x => x.name).map((skill, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span>{skill.name}</span>
                    {skill.proficiency && <span className="opacity-70 text-[9px] uppercase tracking-widest">{skill.proficiency}</span>}
                  </div>
                  {skill.proficiency && (
                    <div className="w-full bg-slate-100/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full" style={{ width: skill.proficiency === 'Expert' ? '100%' : skill.proficiency === 'Advanced' ? '75%' : skill.proficiency === 'Intermediate' ? '50%' : '25%' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* RIGHT COLUMN: Main Content */}
      <main className="w-[66%] p-10 text-slate-800 flex flex-col gap-8">
        <header className="mb-2">
          {personalInfo?.fullName && <h1 className="text-[42px] font-bold text-slate-900 tracking-tight leading-none mb-2">{personalInfo.fullName}</h1>}
          {headline && <div className="text-[15px] font-semibold tracking-[0.15em] text-[#0f345a] uppercase">{headline}</div>}
        </header>

        {workExperiences.filter(x => x.company || x.role).length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
               <h2 className="text-[15px] font-bold uppercase tracking-widest text-[#0f345a]">Experience</h2>
               <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="space-y-6">
              {workExperiences.filter(x => x.company || x.role).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-col mb-1.5">
                    <span className="text-[15px] font-bold text-slate-900">{exp.role || "Role"}</span>
                    <div className="flex justify-between items-center text-[12px] mt-0.5">
                      <span className="font-semibold text-[#0f345a]">{exp.company || "Company"} {exp.location && <span className="text-slate-500 font-normal">| {exp.location}</span>}</span>
                      <span className="text-slate-500 font-semibold tracking-wide uppercase text-[10px]">{formatRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                    </div>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-[12px] leading-relaxed text-slate-700 mt-2">
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
            <div className="flex items-center gap-4 mb-4">
               <h2 className="text-[15px] font-bold uppercase tracking-widest text-[#0f345a]">Education</h2>
               <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="space-y-5">
              {educations.filter(x => x.institution || x.degree).map((edu, idx) => (
                <div key={idx} className="text-[13px]">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-slate-900 text-[14px]">{edu.degree || "Degree"}</span>
                    <span className="text-slate-500 font-semibold tracking-wide uppercase text-[10px]">{formatRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  <div className="text-[12px] font-semibold text-[#0f345a]">
                    {edu.institution || "Institution"} {edu.location && <span className="text-slate-500 font-normal">| {edu.location}</span>}
                  </div>
                  {edu.grade && <div className="text-[11px] text-slate-600 mt-1">Grade: {edu.grade}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.filter(x => x.name).length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
               <h2 className="text-[15px] font-bold uppercase tracking-widest text-[#0f345a]">Projects</h2>
               <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="space-y-5">
              {projects.filter(x => x.name).map((proj, idx) => (
                <div key={idx} className="text-[12px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[14px] text-slate-900">{proj.name}</span>
                    <span className="text-slate-500 font-semibold tracking-wide uppercase text-[10px]">{formatRange(proj.startDate, proj.endDate)}</span>
                  </div>
                  <div className="leading-relaxed text-slate-700 text-justify mb-1.5">{proj.description}</div>
                  {proj.technologies && <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Tech: {proj.technologies}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NEW: Certifications section added to Modern Template! */}
        {certifications.filter(x => x.name).length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
               <h2 className="text-[15px] font-bold uppercase tracking-widest text-[#0f345a]">Certifications</h2>
               <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="space-y-4">
              {certifications.filter(x => x.name).map((cert, idx) => (
                <div key={idx} className="text-[13px] flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    {cert.issuer && <div className="text-[12px] font-semibold text-[#0f345a]">{cert.issuer}</div>}
                    {cert.url && <div className="text-[11px] text-slate-500 truncate mt-0.5 border-b border-transparent hover:border-slate-400 inline-block">{cert.url.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                  </div>
                  <span className="text-slate-500 font-semibold tracking-wide uppercase text-[10px] text-right shrink-0 ml-4">{formatRange(cert.issueDate, cert.expiryDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </article>
  );
}
