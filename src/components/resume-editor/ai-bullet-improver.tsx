"use client";

import { useState } from "react";
import { toast } from "sonner";

interface AIBulletImproverProps {
  role: string;
  bullets: string[];
  onSuccess: (improvedBullets: string[]) => void;
}

export function AIBulletImprover({ role, bullets, onSuccess }: AIBulletImproverProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We only allow improving if there is at least one non-empty bullet
  const hasValidBullets = bullets.some((b) => b.trim().length > 0);

  const handleImprove = async () => {
    // Basic validation
    if (!role.trim()) {
      setError("Please enter a Job Title for this experience first.");
      return;
    }

    if (!hasValidBullets) {
      setError("Please write at least one draft bullet point to improve.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/improve-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          bullets: bullets.map((b) => b.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || data.error || "Failed to improve bullet points.";
        throw new Error(typeof errorMessage === 'string' ? errorMessage : "Failed to improve bullet points.");
      }

      toast.success("Achievements optimized with AI!");
      onSuccess(data.bullets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleImprove}
        disabled={loading || !hasValidBullets}
        className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-emerald-700 transition-all hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="h-3.5 w-3.5 animate-spin text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Improving...
          </>
        ) : (
          <>
            <span>✨</span> Improve with AI
          </>
        )}
      </button>

      {error && (
        <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
