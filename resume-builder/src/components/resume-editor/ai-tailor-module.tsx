"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { SkillEntry } from "./resume-sections";

interface AITailorModuleProps {
  resumeData: Record<string, unknown>;
  currentSkills: SkillEntry[];
  onApplySummary: (summary: string) => void;
  onApplySkills: (skills: SkillEntry[]) => void;
}

type AnalysisResult = {
  summary: string;
  skills: string[];
  experienceHighlights: string[];
  keywords: string[];
  missingStrengths: string[];
};

export function AITailorModule({ 
  resumeData, 
  currentSkills,
  onApplySummary, 
  onApplySkills 
}: AITailorModuleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 20) {
      setError("Please paste a valid job description (at least 20 characters length).");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeData,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        const errorMessage = body.error?.message || body.error || "Failed to analyze job description";
        throw new Error(typeof errorMessage === 'string' ? errorMessage : "Failed to analyze job description");
      }

      toast.success("Analysis complete! Review the suggestions.");
      setAnalysis(body.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = () => {
    if (analysis?.summary) {
      onApplySummary(analysis.summary);
      toast.success("Applied tailored summary!");
    }
  };

  const handleApplySkills = () => {
    if (analysis?.skills) {
      // Merge current skills with new ones, avoiding exact name duplicates
      const newSkills = [...currentSkills];
      const existingNames = new Set(newSkills.map(s => s.name.toLowerCase()));
      
      analysis.skills.forEach((skillName) => {
        if (!existingNames.has(skillName.toLowerCase())) {
          newSkills.push({ name: skillName, proficiency: undefined });
          existingNames.add(skillName.toLowerCase()); // prevent dupes in the same list
        }
      });
      
      onApplySkills(newSkills);
      toast.success("Missing skills appended to your list!");
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setJobDescription("");
    setAnalysis(null);
    setError(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all print:hidden"
      >
        🎯 Tailor to Job
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:hidden">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            🎯 Tailor to Job Description
          </h2>
          <button 
            onClick={resetAndClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!analysis ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Paste Target Job Description
                </label>
                <p className="text-sm text-slate-500 mb-3">
                  We'll extract the core requirements and identify how to position your current resume to match perfectly.
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. We are looking for a Senior Frontend Engineer with 5+ years of React experience. Must have a deep understanding of Next.js, TypeScript, and state management..."
                  className="w-full h-64 rounded-2xl border border-slate-200 p-4 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none resize-none"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || jobDescription.trim().length < 20}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Analyzing Fit...
                    </>
                  ) : "Analyze Profile Fit"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Analytics Sidebar */}
              <div className="col-span-1 lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    🔑 High-Value Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-semibold border border-emerald-200/50">
                        {kw}
                      </span>
                    ))}
                    {analysis.keywords.length === 0 && <span className="text-sm text-slate-500">No specific keywords extracted.</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    📉 Missing Strengths
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">Skills mentioned in the JD that aren't prominent in your resume.</p>
                  <ul className="space-y-2">
                    {analysis.missingStrengths.map((st, i) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-2.5 border border-amber-100/50">
                        <span className="shrink-0">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                    {analysis.missingStrengths.length === 0 && <span className="text-sm text-emerald-600 font-medium">You are a perfect match based on skills!</span>}
                  </ul>
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="col-span-1 lg:col-span-8 space-y-8">
                {/* Summary */}
                <div className="rounded-2xl border border-indigo-100 overflow-hidden bg-white">
                  <div className="bg-indigo-50/50 border-b border-indigo-100 px-5 py-3 flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-900">Tailored Summary</h3>
                    <button 
                      onClick={handleApplySummary}
                      className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Apply Layout
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-slate-700">{analysis.summary}</p>
                  </div>
                </div>

                {/* Additional Skills */}
                <div className="rounded-2xl border border-indigo-100 overflow-hidden bg-white">
                  <div className="bg-indigo-50/50 border-b border-indigo-100 px-5 py-3 flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-900">Suggested Skills to Add</h3>
                    <button 
                      onClick={handleApplySkills}
                      className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Merge Skills
                    </button>
                  </div>
                  <div className="p-5 flex flex-wrap gap-2">
                    {analysis.skills.map((s, i) => (
                      <span key={i} className="inline-flex rounded-lg bg-slate-100 text-slate-700 px-3 py-1.5 text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Wording */}
                <div className="rounded-2xl border border-indigo-100 overflow-hidden bg-white">
                  <div className="bg-indigo-50/50 border-b border-indigo-100 px-5 py-3">
                    <h3 className="font-semibold text-indigo-900">Experience Highlights</h3>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">Copy & paste these into your relevant roles</p>
                  </div>
                  <ul className="p-5 space-y-3">
                    {analysis.experienceHighlights.map((hl, i) => (
                      <li key={i} className="text-sm p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 relative group cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                          onClick={() => { navigator.clipboard.writeText(hl); toast.success("Copied to clipboard!"); }}>
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-indigo-600 text-xs font-bold transition-opacity">
                          Copy
                        </div>
                        {hl}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
