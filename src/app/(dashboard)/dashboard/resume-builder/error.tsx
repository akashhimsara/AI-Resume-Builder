"use client";

import { useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";

export default function ResumeBuilderErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Resume Builder crashed:", error);
  }, [error]);

  return (
    <PageContainer
      title="Something went wrong"
      description="We encountered an unexpected error while loading your workspace."
    >
      <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center shadow-sm max-w-2xl mx-auto mt-8">
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
          <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-rose-900 mb-2">Connection Interrupted</h2>
        <p className="text-rose-700/80 text-sm mb-8">
          The server failed to process the request. This might be a temporary network issue. 
          Please try again or contact support if the problem persists.
        </p>
        
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition"
        >
          Try again
        </button>
      </div>
    </PageContainer>
  );
}
