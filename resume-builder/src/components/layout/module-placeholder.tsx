type ModulePlaceholderProps = {
  moduleName: string;
  summary: string;
};

const starterItems = [
  "UI ready for module expansion",
  "Server/service structure scaffolded",
  "API route entry points prepared",
];

export function ModulePlaceholder({ moduleName, summary }: ModulePlaceholderProps) {
  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{moduleName}</h2>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">In Progress</span>
      </div>

      <p className="text-sm text-slate-600">{summary}</p>

      <ul className="space-y-2">
        {starterItems.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Add Feature
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          View API Plan
        </button>
      </div>
    </div>
  );
}
