import Link from "next/link";
import { SignInForm } from "@/components/forms/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">Access your dashboard and continue building your resume.</p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SignInForm />
        <p className="mt-4 text-right text-sm text-slate-600">
          <Link href="/forgot-password" className="font-medium text-blue-700">
            Forgot password?
          </Link>
        </p>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        New here? <Link href="/sign-up" className="font-medium text-blue-700">Create an account</Link>
      </p>
    </main>
  );
}
