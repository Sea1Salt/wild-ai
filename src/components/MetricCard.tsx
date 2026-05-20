import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: {
    background: string;
    icon: string;
  };
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = {
    background: "bg-forest-50",
    icon: "text-forest-700",
  },
}: MetricCardProps) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-stone-950">
            {value}
          </p>
        </div>
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone.background}`}
        >
          <Icon className={`h-6 w-6 ${tone.icon}`} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-500">{description}</p>
    </section>
  );
}
