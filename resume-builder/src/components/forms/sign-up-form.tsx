"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";

type PasswordFieldProps = {
  id: "password" | "confirmPassword";
  label: string;
  value: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onChange: (value: string) => void;
};

type FormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function EyeOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.7 10.7A3 3 0 0012 15a3 3 0 002.3-4.3" />
      <path d="M9.9 4.2A10.9 10.9 0 0112 4c6 0 10 8 10 8a18.7 18.7 0 01-4.1 5.1" />
      <path d="M6.6 6.6A18.7 18.7 0 002 12s4 8 10 8a10.9 10.9 0 005.8-1.7" />
    </svg>
  );
}

function PasswordField({ id, label, value, isVisible, onToggleVisibility, onChange }: PasswordFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {isVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </button>
      </div>
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { fullName, email, password } = form;
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const responseText = await response.text();
      let payload: { error?: { message?: string } } = {};

      try {
        payload = responseText ? (JSON.parse(responseText) as { error?: { message?: string } }) : {};
      } catch {
        payload = {};
      }

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to create account");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
        />
      </div>

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
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </div>

      <PasswordField
        id="password"
        label="Password"
        value={form.password}
        isVisible={isPasswordVisible}
        onToggleVisibility={() => setIsPasswordVisible((prev) => !prev)}
        onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
      />

      <p className="text-xs text-slate-500">Use at least 8 chars with upper/lowercase letters and a number.</p>

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        value={form.confirmPassword}
        isVisible={isConfirmPasswordVisible}
        onToggleVisibility={() => setIsConfirmPasswordVisible((prev) => !prev)}
        onChange={(value) => setForm((prev) => ({ ...prev, confirmPassword: value }))}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" isLoading={loading} className="w-full">
        Create account
      </Button>
    </form>
  );
}
