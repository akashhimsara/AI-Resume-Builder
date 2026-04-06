import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Reset password</h1>
      <p className="mt-2 text-sm text-slate-600">Choose a new password for your account.</p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Need another link? <Link href="/forgot-password" className="font-medium text-blue-700">Request reset</Link>
      </p>
    </main>
  );
}
