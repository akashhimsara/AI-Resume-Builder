"use client";

import type { PersonalInfo } from "@/server/resumes/resume.schemas";

type ResumePreviewProps = {
  personalInfo?: PersonalInfo;
  headline?: string;
  summary?: string;
};

/**
 * Resume Preview Component
 * 
 * Shows how the resume looks on the right side of the screen.
 * Updates in real-time as the user types!
 */
export function ResumePreview({ personalInfo, headline, summary }: ResumePreviewProps) {
  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-8">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-6">
        {personalInfo?.fullName && (
          <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName}</h1>
        )}
        {headline && <p className="mt-1 text-lg text-slate-600">{headline}</p>}

        {/* Contact Info */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
          {personalInfo?.email && (
            <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600">
              📧 {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo?.location && <span>📍 {personalInfo.location}</span>}
        </div>

        {/* Links */}
        <div className="mt-3 flex flex-wrap gap-3">
          {personalInfo?.linkedIn && (
            <a
              href={personalInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
          {personalInfo?.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              GitHub
            </a>
          )}
          {personalInfo?.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{summary}</p>
        </div>
      )}

      {/* Placeholder for other sections */}
      <div className="space-y-2 pt-4 text-center text-sm text-slate-500">
        <p>📝 More sections coming (Work Experience, Education, Skills...)</p>
      </div>
    </div>
  );
}
