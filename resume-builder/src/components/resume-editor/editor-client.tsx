"use client";

import { useState } from "react";
import { PersonalInfoSection } from "@/components/resume-editor/personal-info-section";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import type { PersonalInfo } from "@/server/resumes/resume.schemas";

type EditorClientProps = {
  resumeId: string;
  initialPersonalInfo: PersonalInfo;
  headline?: string;
  summary?: string;
};

/**
 * Editor Client Component
 * 
 * This is the "glue" that connects the form on the left
 * with the preview on the right. It manages the state
 * of what the user is editing.
 */
export function EditorClient({
  resumeId,
  initialPersonalInfo,
  headline,
  summary,
}: EditorClientProps) {
  // Keep personal info in state so preview updates in real-time
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo);
  const [currentHeadline, setCurrentHeadline] = useState(headline);
  const [currentSummary, setCurrentSummary] = useState(summary);

  const handlePersonalInfoSave = (data: PersonalInfo) => {
    setPersonalInfo(data);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column: Form Inputs */}
      <div className="space-y-6">
        <PersonalInfoSection
          resumeId={resumeId}
          initialData={initialPersonalInfo}
          onSave={handlePersonalInfoSave}
        />

        {/* Headline Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <label htmlFor="headline" className="block text-sm font-medium text-slate-700">
            Professional Title (Headline)
          </label>
          <input
            id="headline"
            type="text"
            placeholder="e.g., Senior Software Engineer"
            defaultValue={headline ?? ""}
            onChange={(e) => setCurrentHeadline(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-slate-500">
            This appears as your job title on the resume
          </p>
        </div>

        {/* Summary Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <label htmlFor="summary" className="block text-sm font-medium text-slate-700">
            Professional Summary
          </label>
          <textarea
            id="summary"
            placeholder="Write a brief summary of who you are and what you do..."
            defaultValue={summary ?? ""}
            onChange={(e) => setCurrentSummary(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-slate-500">
            Keep it under 150 words for best results
          </p>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className="sticky top-6 h-fit">
        <ResumePreview
          personalInfo={personalInfo}
          headline={currentHeadline}
          summary={currentSummary}
        />
      </div>
    </div>
  );
}
