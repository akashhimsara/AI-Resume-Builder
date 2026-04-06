import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageContainer({ title, description, actions, children }: PageContainerProps) {
  return (
    <section className="space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-sm sm:p-6 print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{description}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-5 shadow-sm sm:p-6 print:border-none print:bg-transparent print:p-0 print:shadow-none">{children}</div>
    </section>
  );
}
