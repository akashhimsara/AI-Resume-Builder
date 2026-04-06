"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";

type FormState = {
  title: string;
  template: string;
};

type ApiResponse = {
  data?: {
    resume?: {
      id: string;
    };
  };
  error?: {
    message?: string;
  };
};

const templateOptions = [
  {
    value: "modern",
    label: "Modern",
    description: "Clean and contemporary styling with stronger visual hierarchy.",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Traditional, polished resume style designed for formal roles.",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Lightweight, distraction-free layout focused on content clarity.",
  },
] as const;

export function CreateResumeForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    template: templateOptions[0].value,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          template: form.template,
          notes: `Initial template: ${form.template}`,
        }),
      });

      const responseText = await response.text();
      let payload: ApiResponse = {};

      try {
        payload = responseText ? (JSON.parse(responseText) as ApiResponse) : {};
      } catch {
        payload = {};
      }

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to create resume");
      }

      const resumeId = payload.data?.resume?.id;
      if (!resumeId) {
        throw new Error("Resume was created, but no id was returned");
      }

      router.push(`/dashboard/resume-builder/${resumeId}`);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to create resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Resume title
        </label>
        <input
          id="title"
          type="text"
          required
          minLength={2}
          maxLength={120}
          placeholder="e.g. Senior Full Stack Engineer"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        />
        <p className="text-xs text-slate-500">Give this resume a clear name so you can find it quickly later.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">Template</legend>
        <div className="grid gap-3">
          {templateOptions.map((template) => {
            const isActive = form.template === template.value;

            return (
              <label
                key={template.value}
                className={[
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                  isActive
                    ? "border-blue-400 bg-blue-50/70 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-slate-300",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="template"
                  className="mt-1"
                  value={template.value}
                  checked={isActive}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      template: event.target.value,
                    }))
                  }
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{template.label}</span>
                  <span className="block text-xs text-slate-600">{template.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" isLoading={loading} className="rounded-xl px-5 py-2.5">
          Create Resume
        </Button>
      </div>
    </form>
  );
}
