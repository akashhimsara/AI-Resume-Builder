import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Forgot password</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your account email and we will send a reset link if that account exists.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ForgotPasswordForm />
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Remembered your password? <Link href="/sign-in" className="font-medium text-blue-700">Sign in</Link>
      </p>
    </main>
  );
}
