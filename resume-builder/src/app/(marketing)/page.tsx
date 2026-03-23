import Link from "next/link";

const modules = [
  { title: "Authentication", description: "Secure account and session management." },
  { title: "Resume Builder", description: "Structured resume editing and versioning." },
  { title: "Billing", description: "Subscription checkout and invoicing." },
  { title: "AI Tools", description: "AI-assisted drafting, optimization, and scoring." },
  { title: "Admin", description: "Organization controls and platform moderation." },
];

export default function MarketingHomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(2,132,199,0.12),transparent_30%)]" />

      <section className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Production-Ready SaaS Starter</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Build and ship your AI Resume Builder faster with a modular architecture.
          </h1>
          <p className="text-lg text-slate-600">
            App Router structure, reusable UI components, Prisma data access, and scalable module boundaries out of the box.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sign-up" className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500">
            Create account
          </Link>
          <Link href="/dashboard" className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Open dashboard
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">{module.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{module.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
