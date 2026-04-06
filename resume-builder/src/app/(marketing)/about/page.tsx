import Link from "next/link";

const values = [
  {
    title: "Clarity First",
    description:
      "We design every editing and preview screen to keep writing simple and understandable.",
  },
  {
    title: "Practical AI",
    description:
      "AI suggestions are focused on real hiring outcomes, not generic filler text.",
  },
  {
    title: "Professional Output",
    description:
      "Templates are tuned for readability so your resume looks polished in export and print.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-8 shadow-sm backdrop-blur-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">About</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Built to help people get hired faster</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            AI Resume Builder was created for students, job-switchers, and professionals who need a high-quality resume
            without spending days on formatting. We combine clean templates with focused AI assistance so you can
            present your experience confidently.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{value.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">What you can expect</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>A straightforward editor designed to reduce friction while writing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Resume templates that balance modern design with recruiter-friendly structure.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Continuous improvements focused on real-world job application workflows.</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">
              Create Account
            </Link>
            <Link href="/features" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Explore Features
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}