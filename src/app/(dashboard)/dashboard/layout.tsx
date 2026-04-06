import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { requireUser } from "@/server/auth/session.service";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireUser({ redirectTo: "/sign-in" });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 print:bg-white print:block">
      <div className="print:hidden">
        <DashboardNavbar />
      </div>
      <div className="flex flex-1 flex-col lg:flex-row print:block">
        <div className="print:hidden">
          <DashboardSidebar role={user.role} />
        </div>
        <main className="flex-1 p-5 sm:p-6 lg:p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
