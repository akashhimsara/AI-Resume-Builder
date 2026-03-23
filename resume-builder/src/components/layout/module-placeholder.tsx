type ModulePlaceholderProps = {
  moduleName: string;
  summary: string;
};

export function ModulePlaceholder({ moduleName, summary }: ModulePlaceholderProps) {
  return (
    <div className="space-y-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-slate-900">{moduleName}</h2>
      <p className="text-sm text-slate-600">{summary}</p>
      <p className="text-sm text-slate-500">
        This module is scaffolded and ready for feature implementation with service, route handler, and UI layers.
      </p>
    </div>
  );
}
