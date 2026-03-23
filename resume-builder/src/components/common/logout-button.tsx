"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700">
      Log out
    </Button>
  );
}
