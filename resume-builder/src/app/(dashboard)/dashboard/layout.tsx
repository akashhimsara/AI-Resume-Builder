import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { requireUser } from "@/server/auth/session.service";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await requireUser({ redirectTo: "/sign-in" });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
