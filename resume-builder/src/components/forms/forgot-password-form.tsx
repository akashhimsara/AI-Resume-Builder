"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/common/button";

type FormState = {
  email: string;
};

export function ForgotPasswordForm() {
  const [form, setForm] = useState<FormState>({ email: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const responseText = await response.text();
      let payload: { data?: { message?: string }; error?: { message?: string } } = {};

      try {
        payload = responseText
          ? (JSON.parse(responseText) as { data?: { message?: string }; error?: { message?: string } })
          : {};
      } catch {
        payload = {};
      }

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to process request");
      }

      setSuccess(
        payload.data?.message ??
          "If an account exists for that email, we sent a password reset link. Please check your inbox.",
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to process request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={form.email}
          onChange={(event) => setForm({ email: event.target.value })}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <Button type="submit" isLoading={loading} className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
