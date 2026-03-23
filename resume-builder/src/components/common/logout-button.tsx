"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { logoutAction } from "@/server/auth/logout.action";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);
    setIsLoading(true);

    try {
      await logoutAction();
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError("Unable to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={handleLogout} isLoading={isLoading} className="bg-slate-800 hover:bg-slate-700">
        Log out
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
