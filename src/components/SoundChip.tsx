import { Bird, Bug, CircleHelp, Music2, Volume2 } from "lucide-react";
import type { SoundGroup } from "../types/device";

const soundStyles: Record<SoundGroup, string> = {
  Bird: "bg-sky-50 text-sky-700 ring-sky-100",
  Frog: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Insect: "bg-lime-50 text-lime-700 ring-lime-100",
  Noise: "bg-rose-50 text-rose-700 ring-rose-100",
  Unknown: "bg-stone-100 text-stone-700 ring-stone-200",
};

const soundIcons = {
  Bird,
  Frog: Music2,
  Insect: Bug,
  Noise: Volume2,
  Unknown: CircleHelp,
};

interface SoundChipProps {
  sound: SoundGroup;
}

export function SoundChip({ sound }: SoundChipProps) {
  const Icon = soundIcons[sound];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${soundStyles[sound]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {sound}
    </span>
  );
}
