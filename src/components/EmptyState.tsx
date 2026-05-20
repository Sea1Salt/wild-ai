import { Plus, Radio } from "lucide-react";

interface EmptyStateProps {
  onAddDevice: () => void;
  title?: string;
  description?: string;
}

export function EmptyState({
  onAddDevice,
  title = "No devices match this view",
  description = "Add a field device profile or adjust the search and filters.",
}: EmptyStateProps) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white/75 p-10 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-forest-50 text-forest-700">
        <Radio className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-stone-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
        {description}
      </p>
      <button
        type="button"
        onClick={onAddDevice}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700"
      >
        <Plus className="h-4 w-4" />
        Add Device
      </button>
    </section>
  );
}
