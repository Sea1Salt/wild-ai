import {
  Activity,
  Battery,
  CalendarDays,
  ChevronLeft,
  Download,
  Gauge,
  HardDrive,
  Info,
  Radio,
  RefreshCw,
  Signal,
  Volume2,
  Waves,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Device, SoundGroup } from "../types/device";
import { getStatusLabel } from "../utils/deviceStatus";
import { MetricCard } from "./MetricCard";
import { SoundChip } from "./SoundChip";
import { StatusBadge } from "./StatusBadge";

interface DashboardProps {
  device: Device;
  onBack: () => void;
}

const soundGroups: SoundGroup[] = ["Bird", "Frog", "Insect", "Noise", "Unknown"];

export function Dashboard({ device, onBack }: DashboardProps) {
  const hasData = device.status !== "waiting" && device.timeline.length > 0;
  const indicatorValue =
    device.indicatorScore === null
      ? "Waiting for data"
      : `${device.indicator} (${device.indicatorScore}/100)`;
  const confidenceValue =
    device.confidence === null ? "Waiting for data" : `${device.confidence}%`;
  const monitoringPeriod = hasData ? "Last 24 hours" : "Waiting for first upload";

  return (
    <main className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-forest-900 text-cream">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-35"
            src={device.image}
            alt={`${device.name} dashboard background`}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-900/90 to-forest-700/70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-cream backdrop-blur transition hover:bg-white/15"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Devices
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-cream backdrop-blur transition hover:bg-white/15"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-sm font-semibold text-forest-900 shadow-soft transition hover:bg-white"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[180px_1fr] lg:items-end">
            <img
              className="h-44 w-full rounded-[1.5rem] border border-white/20 object-cover shadow-soft"
              src={device.image}
              alt={`${device.name} field device`}
            />
            <div>
              <StatusBadge status={device.status} />
              <h1 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                {device.name}
              </h1>
              <p className="mt-3 text-lg text-stone-200">{device.location}</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-stone-300">Battery</p>
                  <p className="mt-1 text-xl font-semibold">{device.battery}%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-stone-300">Last Upload</p>
                  <p className="mt-1 text-xl font-semibold">{device.lastUpload}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-stone-300">Device ID</p>
                  <p className="mt-1 text-xl font-semibold">{device.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Acoustic Biodiversity Indicator"
            value={indicatorValue}
            description="Preliminary acoustic indicator based on detected sound-group activity."
            icon={Gauge}
            tone={{ background: "bg-forest-50", icon: "text-forest-700" }}
          />
          <MetricCard
            title="Noise Disturbance"
            value={device.noise}
            description="Estimated disturbance level from non-biological or human-linked acoustic patterns."
            icon={Volume2}
            tone={{ background: "bg-rose-50", icon: "text-rose-700" }}
          />
          <MetricCard
            title="Average Confidence"
            value={confidenceValue}
            description="Average AI confidence for available sound-group classifications."
            icon={Activity}
            tone={{ background: "bg-sky-50", icon: "text-sky-700" }}
          />
          <MetricCard
            title="Monitoring Period"
            value={monitoringPeriod}
            description="Time range represented by the latest available acoustic metadata."
            icon={CalendarDays}
            tone={{ background: "bg-amber-50", icon: "text-amber-700" }}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-950">
                  Acoustic Activity
                  <Info className="h-4 w-4 text-stone-400" />
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Time-based acoustic activity and average confidence.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {soundGroups.map((sound) => (
                  <SoundChip key={sound} sound={sound} />
                ))}
              </div>
            </div>

            <div className="mt-6 h-72">
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={device.activitySeries}>
                    <defs>
                      <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#667238" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#667238" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="time" stroke="#78716c" />
                    <YAxis stroke="#78716c" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="activity"
                      name="Acoustic activity"
                      stroke="#667238"
                      strokeWidth={3}
                      fill="url(#activityFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <WaitingPanel />
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">
              Peak Sound Activity
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Time window with the strongest acoustic activity.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <PeakItem label="Peak time window" value={device.peakActivity.timeWindow} />
              <PeakItem label="Dominant group" value={device.peakActivity.dominantGroup} />
              <PeakItem label="Secondary group" value={device.peakActivity.secondaryGroup} />
            </div>

            <div className="mt-6 h-48">
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={device.activitySeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="time" stroke="#78716c" />
                    <YAxis stroke="#78716c" />
                    <Tooltip />
                    <Bar
                      dataKey="confidence"
                      name="Confidence"
                      fill="#aab978"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <WaitingPanel compact />
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <section className="overflow-x-auto rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-950">
              Detection Timeline
              <Info className="h-4 w-4 text-stone-400" />
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Hourly summary of detected sound groups and noise levels.
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-stone-50 text-stone-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Time Period</th>
                    <th className="px-4 py-3 font-semibold">Detected Sound Groups</th>
                    <th className="px-4 py-3 font-semibold">Dominant Sound</th>
                    <th className="px-4 py-3 font-semibold">Noise Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {hasData ? (
                    device.timeline.map((entry) => (
                      <tr key={entry.timePeriod}>
                        <td className="px-4 py-4 font-semibold text-stone-800">
                          {entry.timePeriod}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {entry.groups.map((sound) => (
                              <SoundChip
                                key={`${entry.timePeriod}-${sound}`}
                                sound={sound}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-stone-700">
                          {entry.dominantSound}
                        </td>
                        <td className="px-4 py-4 text-stone-700">
                          {entry.noiseLevel}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-center text-stone-500" colSpan={4}>
                        Waiting for data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-950">
                Unknown Sound Review
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Review low-confidence or unknown detections.
              </p>
              <div className="mt-5 space-y-3">
                {device.unknownReviews.length > 0 ? (
                  device.unknownReviews.map((review) => (
                    <div
                      key={`${review.timePeriod}-${review.label}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          {review.timePeriod}
                        </p>
                        <p className="text-sm text-stone-500">{review.label}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-forest-700 ring-1 ring-stone-200 transition hover:bg-forest-50"
                      >
                        Review Audio
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                    Waiting for data
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-950">Device Health</h2>
              <div className="mt-5 grid gap-3">
                <HealthRow icon={Radio} label="Status" value={getStatusLabel(device.status)} />
                <HealthRow icon={Battery} label="Battery" value={`${device.battery}%`} />
                <HealthRow icon={HardDrive} label="Storage Available" value={`${device.storage}%`} />
                <HealthRow icon={Signal} label="Signal Strength" value={device.signal} />
                <HealthRow icon={Waves} label="Pending Uploads" value={`${device.pendingUploads}`} />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function PeakItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-950">{value}</p>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-stone-600">
        <Icon className="h-4 w-4 text-forest-500" />
        {label}
      </p>
      <p className="text-sm font-semibold text-stone-950">{value}</p>
    </div>
  );
}

function WaitingPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl bg-stone-50 text-center">
      <div className={compact ? "p-4" : "p-8"}>
        <Radio className="mx-auto h-8 w-8 text-stone-400" />
        <p className="mt-3 text-sm font-semibold text-stone-700">
          Waiting for data
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Timeline appears after the first upload.
        </p>
      </div>
    </div>
  );
}
