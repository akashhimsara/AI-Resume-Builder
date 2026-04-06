import Link from "next/link";
import { SignUpForm } from "@/components/forms/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">Start generating ATS-friendly resumes powered by AI.</p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SignUpForm />
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link href="/sign-in" className="font-medium text-blue-700">Sign in</Link>
      </p>
    </main>
  );
}
