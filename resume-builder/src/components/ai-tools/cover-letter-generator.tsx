"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/button";

interface ResumeMinimal {
  id: string;
  title: string;
}

interface CoverLetterGeneratorProps {
  resumes: ResumeMinimal[];
}

export function CoverLetterGenerator({ resumes }: CoverLetterGeneratorProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    resumes.length > 0 ? resumes[0].id : ""
  );
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      setError("Please select a resume base first.");
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError("Please provide a valid job description (at least 20 characters).");
      return;
    }

    setError(null);
    setLoading(true);
    setCoverLetter(null);

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobTitle,
          companyName,
          jobDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Failed to generate cover letter");
      }

      toast.success("Cover letter generated!");
      setCoverLetter(data.coverLetter);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (coverLetter) {
      const element = document.createElement("a");
      const file = new Blob([coverLetter], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${companyName.replace(/\s+/g, '_')}_Cover_Letter.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Downloaded successfully!");
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Resumes Found</h3>
        <p className="text-slate-500 mb-6">You need to create a resume first before you can generate a tailored cover letter.</p>
        <a href="/dashboard/resume-builder" className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition">
          Go to Resume Builder
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Side */}
      <div className="col-span-1 lg:col-span-4 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Target Details</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Source Profile</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">Select the resume to build your narrative around.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Target Role</label>
              <input
                type="text"
                placeholder="e.g. Senior Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Target Company</label>
              <input
                type="text"
                placeholder="e.g. Google, Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Job Description</label>
              <textarea
                placeholder="Paste the full job posting here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                className="w-full h-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full py-6 bg-violet-600 hover:bg-violet-700 shadow-md transition-all mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Crafting Letter...
                </span>
              ) : "✨ Generate Cover Letter"}
            </Button>
          </form>
        </div>
      </div>

      {/* Output Side */}
      <div className="col-span-1 lg:col-span-8">
        <div className="rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-sm p-2 shadow-sm min-h-[600px] flex flex-col items-center justify-center relative">
          
          {!coverLetter ? (
            <div className="text-center p-8 max-w-sm">
              <div className="mx-auto w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-4 border border-violet-200/50 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Ready to Impress</h3>
              <p className="text-sm text-slate-500">Provide your target details on the left, and our AI will weave your work history into a compelling narrative.</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3 flex justify-between items-center shrink-0">
                <span className="text-sm font-semibold text-slate-600">Generated Cover Letter</span>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm">
                    ↓ Download TXT
                  </button>
                  <button onClick={handleCopy} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">
                    Copy to Clipboard
                  </button>
                </div>
              </div>
              <div className="p-8 overflow-y-auto flex-1 prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {coverLetter}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
