import Link from "next/link";

const featureGroups = [
  {
    title: "AI Writing Assistant",
    description:
      "Generate stronger summaries, achievements, and role-focused bullets in seconds.",
    points: [
      "AI summary generator",
      "AI bullet improver",
      "Tailor content to job descriptions",
    ],
  },
  {
    title: "Professional Templates",
    description:
      "Choose from recruiter-friendly templates designed for readability and ATS scanning.",
    points: [
      "Modern, Professional, and Minimal layouts",
      "Live visual preview while editing",
      "Consistent spacing and typography",
    ],
  },
  {
    title: "Fast Export and Sharing",
    description:
      "Publish polished resumes quickly with clean formatting across devices.",
    points: [
      "One-click PDF export",
      "Reliable print layout",
      "Optional links for portfolio and social profiles",
    ],
  },
  {
    title: "Career Workflow",
    description:
      "Manage multiple resume versions for different applications without losing track.",
    points: [
      "Create unlimited variants on Pro",
      "Edit and preview in one workspace",
      "Organized dashboard",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-100 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-8 shadow-sm backdrop-blur-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Features</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            Everything you need to build a job-winning resume
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            AI Resume Builder helps you write faster, format better, and tailor every resume to the role you want.
            From first draft to final export, the workflow is built for speed and clarity.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {featureGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
            >
              <h2 className="text-xl font-semibold text-slate-900">{group.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>
              <ul className="mt-4 space-y-2">
                {group.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Ready to build your next resume?</h3>
              <p className="mt-1 text-sm text-slate-600">Start free and upgrade when you need advanced AI tools and unlimited versions.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up" className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500">
                Start Free
              </Link>
              <Link href="/pricing" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}