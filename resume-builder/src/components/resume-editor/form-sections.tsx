"use client";

/**
 * =============================================================================
 * FORM SECTION COMPONENTS - The Building Blocks
 * 
 * These components handle the common UI patterns:
 * - Single input fields
 * - Repeatable arrays (experience, education, etc.)
 * - Add/remove buttons
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────
// Section Container - The wrapper for a section
// ─────────────────────────────────────────────────────────────────────────
interface SectionContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionContainer({ title, description, children }: SectionContainerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 glass-panel p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-bold tracking-tight text-slate-900">{title}</h3>
      {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}
      <div className="space-y-5">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Input Field - A single input with label
// ─────────────────────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "date" | "textarea";
  required?: boolean;
  error?: string;
}

export function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
  error,
}: InputFieldProps) {
  const baseClasses =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-white/60 px-4 py-2.5 text-sm transition-all focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400";
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "";

  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${errorClasses} h-24 resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${errorClasses}`}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Checkbox Field - For boolean inputs
// ─────────────────────────────────────────────────────────────────────────
interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer h-4 w-4"
      />
      <label className="text-sm font-medium text-slate-700 cursor-pointer">{label}</label>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Array Item Container - One item in a repeatable list
// ─────────────────────────────────────────────────────────────────────────
interface ArrayItemProps {
  index: number;
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}

export function ArrayItem({ index, title, onRemove, children }: ArrayItemProps) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
      {/* Header with title and delete button */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="font-semibold text-slate-800">
          {title || `Entry ${index + 1}`}
        </h4>
        <button
          onClick={onRemove}
          className="rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 p-2 transition-colors"
          aria-label="Remove entry"
        >
          ✕
        </button>
      </div>

      {/* Form fields inside this item */}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Array Section - Container for multiple items with "Add" button
// ─────────────────────────────────────────────────────────────────────────
interface ArraySectionProps<T> {
  title: string;
  description?: string;
  items: T[];
  onAdd: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  canAdd?: boolean;
  minItems?: number;
  maxItems?: number;
}

export function ArraySection<T>({
  title,
  description,
  items,
  onAdd,
  renderItem,
  canAdd = true,
  minItems = 0,
  maxItems = 50,
}: ArraySectionProps<T>) {
  const canRemove = items.length > minItems;
  const isFull = items.length >= maxItems;

  return (
    <SectionContainer title={title} description={description}>
      {/* List of items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">No {title.toLowerCase()} yet.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} data-can-remove={canRemove ? "true" : "false"}>
              {renderItem(item, index)}
            </div>
          ))
        )}
      </div>

      {/* Add new item button */}
      {canAdd && !isFull && (
        <button
          onClick={onAdd}
          className="mt-5 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-indigo-50/50 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-200 active:scale-[0.98]"
        >
          +
          {title.slice(0, -1)} {/* Remove the 's' from plural */}
        </button>
      )}
    </SectionContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row Layout - For side-by-side inputs
// ─────────────────────────────────────────────────────────────────────────
interface RowProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function Row({ children, columns = 2 }: RowProps) {
  const colClass = columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
  return <div className={`grid gap-3 ${colClass}`}>{children}</div>;
}
