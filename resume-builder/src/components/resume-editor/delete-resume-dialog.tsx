"use client";

import { useState } from "react";
import { toast } from "sonner";

interface DeleteResumeDialogProps {
  resumeId: string;
  resumeTitle: string;
  onConfirm: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

export function DeleteResumeDialog({ resumeId, resumeTitle, onConfirm, children }: DeleteResumeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      
      await onConfirm(formData);
      toast.success("Resume deleted successfully");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900">Delete Resume</h3>
            
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{resumeTitle}"</span>? 
              This action cannot be undone and you will lose all edits.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => !isDeleting && setIsOpen(false)}
                disabled={isDeleting}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Resume"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
