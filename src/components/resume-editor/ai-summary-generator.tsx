"use client";

import { useState } from "react";
import { toast } from "sonner";
import { InputField } from "./form-sections";

interface AISummaryGeneratorProps {
  onSuccess: (summary: string) => void;
  defaultHeadline?: string;
  defaultSkills?: string[];
}

export function AISummaryGenerator({ onSuccess, defaultHeadline, defaultSkills }: AISummaryGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [jobTitle, setJobTitle] = useState(defaultHeadline || "");
  const [skills, setSkills] = useState(defaultSkills?.join(", ") || "");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (3-5 years)");

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          experienceLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error || "Failed to generate summary";
        throw new Error(typeof errorMessage === 'string' ? errorMessage : "Failed to generate summary");
      }

      toast.success("Professional Summary generated successfully!");
      onSuccess(data.summary);
      setIsOpen(false); // Close panel on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 transition-all"
      >
        <span>✨</span> Auto-Generate with AI
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 mt-4 space-y-4 shadow-inner">
      <div className="flex justify-between items-center border-b border-indigo-200/60 pb-3 mb-2">
        <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
          <span>✨</span> AI Summary Generator
        </h4>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 font-bold p-1"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Target Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          value={jobTitle}
          onChange={setJobTitle}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="Entry-level (0-2 years)">Entry-level (0-2 years)</option>
            <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
            <option value="Senior (6-10 years)">Senior (6-10 years)</option>
            <option value="Executive/Director (10+ years)">Executive/Director (10+ years)</option>
            <option value="Career Changer">Career Changer</option>
          </select>
        </div>
      </div>

      <InputField
        label="Top Skills (comma-separated)"
        placeholder="e.g. React, TypeScript, Product Management, Figma"
        value={skills}
        onChange={setSkills}
        required
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleGenerate}
          disabled={loading || !jobTitle || !skills}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </button>
      </div>
    </div>
  );
}
