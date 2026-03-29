"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";

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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-1 text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}
      <div className="space-y-4">{children}</div>
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
    "w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <div>
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
        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <label className="text-sm font-medium text-slate-700">{label}</label>
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
    <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
      {/* Header with title and delete button */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-medium text-slate-900">
          {title || `Entry ${index + 1}`}
        </h4>
        <button
          onClick={onRemove}
          className="rounded text-slate-400 hover:bg-red-50 hover:text-red-600 p-2"
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
  onRemove: (index: number) => void;
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
  onRemove,
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
            <div key={index}>{renderItem(item, index)}</div>
          ))
        )}
      </div>

      {/* Add new item button */}
      {canAdd && !isFull && (
        <button
          onClick={onAdd}
          className="mt-4 flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
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
  const colClass = columns === 3 ? "grid-cols-3" : "grid-cols-2";
  return <div className={`grid gap-3 ${colClass}`}>{children}</div>;
}
