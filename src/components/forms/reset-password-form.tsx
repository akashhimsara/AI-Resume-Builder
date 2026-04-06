"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/button";

type FormState = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [form, setForm] = useState<FormState>({ password: "", confirmPassword: "" });
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function validateToken() {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setIsTokenValid(false);
          }
          return;
        }

        const payload = (await response.json()) as { data?: { valid?: boolean } };
        if (!cancelled) {
          setIsTokenValid(Boolean(payload.data?.valid));
        }
      } catch {
        if (!cancelled) {
          setIsTokenValid(false);
        }
      }
    }

    setIsTokenValid(null);
    validateToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
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
        throw new Error(payload.error?.message ?? "Unable to reset password");
      }

      setSuccess(payload.data?.message ?? "Your password has been reset successfully.");
      setTimeout(() => {
        router.replace("/sign-in");
        router.refresh();
      }, 1200);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  if (isTokenValid === null) {
    return <p className="text-sm text-slate-600">Checking reset link...</p>;
  }

  if (!isTokenValid) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">This reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-sm font-medium text-blue-700">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={form.confirmPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
        />
      </div>

      <p className="text-xs text-slate-500">Use at least 8 chars with upper/lowercase letters and a number.</p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <Button type="submit" isLoading={loading} className="w-full">
        Reset password
      </Button>
    </form>
  );
}
