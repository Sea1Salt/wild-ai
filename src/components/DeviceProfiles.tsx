import { Filter, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import type { Device } from "../types/device";
import type { DeviceFilter } from "../utils/deviceStatus";
import { DeviceCard } from "./DeviceCard";
import { EmptyState } from "./EmptyState";

const filters: Array<{ label: string; value: DeviceFilter }> = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  { label: "Low Battery", value: "lowBattery" },
];

interface DeviceProfilesProps {
  devices: Device[];
  searchTerm: string;
  activeFilter: DeviceFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: DeviceFilter) => void;
  onAddDevice: () => void;
  onViewDashboard: (device: Device) => void;
  onEditDevice: (device: Device) => void;
}

export function DeviceProfiles({
  devices,
  searchTerm,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onAddDevice,
  onViewDashboard,
  onEditDevice,
}: DeviceProfilesProps) {
  const emptyTitle =
    searchTerm || activeFilter !== "all"
      ? "No matching device profiles"
      : "No field devices yet";

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-forest-500">
            Field Device Profiles
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
            Connected forest listening nodes
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Manage deployment profiles, device health, latest detected sound
            groups, and preliminary acoustic indicators.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddDevice}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700"
        >
          <Plus className="h-4 w-4" />
          Add Device
        </button>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-white/80 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <span className="sr-only">Search devices</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-12 w-full rounded-full border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-forest-500 focus:ring-4 focus:ring-forest-100"
              placeholder="Search by name, ID, location, or description"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-stone-500">
              <Filter className="h-4 w-4" />
              Filter
            </span>
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => onFilterChange(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-forest-900 text-cream"
                    : "bg-stone-100 text-stone-600 hover:bg-forest-50 hover:text-forest-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            onAddDevice={onAddDevice}
            title={emptyTitle}
            description="Add a device profile to begin monitoring uploads and acoustic activity."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
            >
              <DeviceCard
                device={device}
                onViewDashboard={onViewDashboard}
                onEdit={onEditDevice}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
