"use client";

import { useState, useCallback, useEffect } from "react";
import type { PersonalInfo } from "@/server/resumes/resume.schemas";

type PersonalInfoSectionProps = {
  resumeId: string;
  initialData: PersonalInfo;
  onSave?: (data: PersonalInfo) => void;
};

/**
 * Personal Info Section Component
 * 
 * This is like a form for filling out your contact information.
 * As you type, it automatically saves to the database (after you stop for 1 second).
 */
export function PersonalInfoSection({
  resumeId,
  initialData,
  onSave,
}: PersonalInfoSectionProps) {
  // Store the form data in memory (state)
  const [data, setData] = useState<PersonalInfo>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Save the data to database
   * Called automatically by the debounce timer
   */
  const handleSave = useCallback(
    async (dataToSave: PersonalInfo) => {
      try {
        setIsSaving(true);
        setSaveError(null);

        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentJson: {
              personalInfo: dataToSave,
            },
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to save");
        }

        setLastSavedAt(new Date());
        onSave?.(dataToSave);
      } catch (error) {
        console.error("Save error:", error);
        setSaveError(error instanceof Error ? error.message : "Save failed");
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, onSave]
  );

  /**
   * Handle field change - when user types in any input
   * Just updates the local state (doesn't save yet)
   */
  const handleFieldChange = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setSaveError(null);

      // Clear old timeout if user keeps typing
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout - save after user stops typing for 1 second
      const timeout = setTimeout(() => {
        handleSave({ ...data, [field]: value });
      }, 1000);

      setSaveTimeout(timeout);
    },
    [data, saveTimeout, handleSave]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [saveTimeout]);

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
        <p className="mt-1 text-sm text-slate-600">
          Your contact details. Changes auto-save as you type.
        </p>
      </div>

      {/* Show status messages */}
      {saveError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          ⚠️ {saveError}
        </div>
      )}
      {isSaving && <div className="text-xs text-slate-500">💾 Saving...</div>}
      {lastSavedAt && !isSaving && (
        <div className="text-xs text-slate-500">
          ✓ Saved at {lastSavedAt.toLocaleTimeString()}
        </div>
      )}

      {/* Form Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={data.fullName ?? ""}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email ?? ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone ?? ""}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="New York, USA"
            value={data.location ?? ""}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label htmlFor="linkedIn" className="block text-sm font-medium text-slate-700">
            LinkedIn URL
          </label>
          <input
            id="linkedIn"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            value={data.linkedIn ?? ""}
            onChange={(e) => handleFieldChange("linkedIn", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* GitHub */}
        <div>
          <label htmlFor="github" className="block text-sm font-medium text-slate-700">
            GitHub URL
          </label>
          <input
            id="github"
            type="url"
            placeholder="https://github.com/johndoe"
            value={data.github ?? ""}
            onChange={(e) => handleFieldChange("github", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Portfolio */}
        <div className="md:col-span-2">
          <label htmlFor="portfolio" className="block text-sm font-medium text-slate-700">
            Portfolio URL
          </label>
          <input
            id="portfolio"
            type="url"
            placeholder="https://johndoe.com"
            value={data.portfolio ?? ""}
            onChange={(e) => handleFieldChange("portfolio", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
