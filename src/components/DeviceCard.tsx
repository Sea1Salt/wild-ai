import { Battery, Edit3, MapPin, Radio, Signal, Waves } from "lucide-react";
import { DEFAULT_DEVICE_IMAGE } from "../data/deviceDefaults";
import type { Device } from "../types/device";
import { formatDeviceId } from "../utils/deviceIdentity";
import { SoundChip } from "./SoundChip";
import { StatusBadge } from "./StatusBadge";

interface DeviceCardProps {
  device: Device;
  onViewDashboard: (device: Device) => void;
  onEdit: (device: Device) => void;
}

export function DeviceCard({ device, onViewDashboard, onEdit }: DeviceCardProps) {
  const displayDeviceId = formatDeviceId(device.id);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-56 overflow-hidden">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={device.image}
          alt={`${device.name} field device`}
          onError={(event) => {
            event.currentTarget.src = DEFAULT_DEVICE_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/75 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <StatusBadge status={device.status} />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-semibold tracking-normal text-white">
            {device.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-stone-100">
            <MapPin className="h-4 w-4" />
            {device.location}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            {displayDeviceId}
          </p>
          <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">
            {device.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-stone-50 p-3">
            <p className="flex items-center gap-2 text-stone-500">
              <Battery className="h-4 w-4" />
              Battery
            </p>
            <p className="mt-2 font-semibold text-stone-950">{device.battery}%</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-3">
            <p className="flex items-center gap-2 text-stone-500">
              <Signal className="h-4 w-4" />
              Last Upload
            </p>
            <p className="mt-2 font-semibold text-stone-950">{device.lastUpload}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
            <Waves className="h-4 w-4 text-forest-500" />
            Latest detected sound groups
          </p>
          <div className="flex min-h-8 flex-wrap gap-2">
            {device.latestSounds.length > 0 ? (
              device.latestSounds.map((sound) => (
                <SoundChip key={`${device.id}-${sound}`} sound={sound} />
              ))
            ) : (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                Waiting for data
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-forest-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-forest-900">
            <Radio className="h-4 w-4" />
            Acoustic Biodiversity Indicator
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="text-2xl font-semibold text-forest-900">
              {device.indicator}
            </p>
            <p className="text-sm font-semibold text-forest-700">
              {device.indicatorScore === null
                ? "Score pending"
                : `${device.indicatorScore}/100`}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onViewDashboard(device)}
            className="flex-1 rounded-full bg-forest-900 px-4 py-3 text-sm font-semibold text-cream transition hover:bg-forest-700"
          >
            View Dashboard
          </button>
          <button
            type="button"
            onClick={() => onEdit(device)}
            className="inline-flex items-center justify-center rounded-full border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-forest-300 hover:text-forest-700"
            aria-label={`Edit ${device.name}`}
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
