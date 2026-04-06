import type { ReactNode } from "react";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="mx-auto w-full max-w-6xl px-6 text-sm text-slate-500">
          AI Resume Builder. Built with Next.js, TypeScript, Prisma, and PostgreSQL.
        </p>
      </footer>
    </div>
  );
}
