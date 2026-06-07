import { DEFAULT_DEVICE_IMAGE } from "../data/deviceDefaults";
import { supabase } from "../lib/supabase";
import type {
  ActivityPoint,
  Device,
  DeviceStatus,
  IndicatorLevel,
  NoiseLevel,
  PeakActivity,
  SignalStrength,
  SoundGroup,
  TimelineEntry,
  UnknownReview,
} from "../types/device";

interface DeviceRow {
  id: string;
  name: string;
  location: string;
  description: string | null;
  image_url: string | null;
  status: string;
  battery: number;
  signal_strength: string;
  storage_available: number;
  pending_uploads: number;
  last_upload_at: string | null;
  latest_sounds: unknown;
  indicator: string;
  indicator_score: number | null;
  noise: string;
  confidence: number | null;
  created_at?: string;
  updated_at?: string;
}

interface DeviceInsert {
  name: string;
  location: string;
  description: string;
  image_url: string;
  status: DeviceStatus;
  battery: number;
  signal_strength: SignalStrength;
  storage_available: number;
  pending_uploads: number;
  last_upload_at: string | null;
  latest_sounds: SoundGroup[];
  indicator: IndicatorLevel;
  indicator_score: number | null;
  noise: NoiseLevel;
  confidence: number | null;
}

export async function getDevices() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("devices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toDevice);
}

export async function createDevice(device: Device) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("devices")
    .insert(toDeviceInsert(device))
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDevice(data);
}

export async function updateDevice(deviceId: string, device: Device) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("devices")
    .update({
      name: device.name,
      location: device.location,
      description: device.description,
      image_url: device.image,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deviceId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDevice(data);
}

export async function deleteDevice(deviceId: string) {
  const client = getSupabaseClient();
  const { error } = await client.from("devices").delete().eq("id", deviceId);

  if (error) {
    throw new Error(error.message);
  }
}

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  return supabase;
}

function toDeviceInsert(device: Device): DeviceInsert {
  return {
    name: device.name,
    location: device.location,
    description: device.description,
    image_url: device.image,
    status: "waiting",
    battery: 100,
    signal_strength: "Unknown",
    storage_available: 100,
    pending_uploads: 0,
    last_upload_at: null,
    latest_sounds: [],
    indicator: "Unknown",
    indicator_score: null,
    noise: "Unknown",
    confidence: null,
  };
}

function toDevice(row: DeviceRow): Device {
  const latestSounds = parseLatestSounds(row.latest_sounds);
  const status = toDeviceStatus(row.status);
  const indicatorScore = row.indicator_score;
  const noise = toNoiseLevel(row.noise);
  const confidence = row.confidence;
  const hasDashboardData =
    status !== "waiting" && latestSounds.length > 0 && indicatorScore !== null;

  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description ?? "",
    image: row.image_url || DEFAULT_DEVICE_IMAGE,
    status,
    battery: row.battery,
    signal: toSignalStrength(row.signal_strength),
    storage: row.storage_available,
    pendingUploads: row.pending_uploads,
    lastUpload: formatLastUpload(row.last_upload_at),
    latestSounds,
    indicator: toIndicatorLevel(row.indicator),
    indicatorScore,
    noise,
    confidence,
    timeline: hasDashboardData ? buildTimeline(latestSounds, noise) : [],
    activitySeries: hasDashboardData
      ? buildActivitySeries(indicatorScore, confidence)
      : [],
    unknownReviews: hasDashboardData
      ? buildUnknownReviews(latestSounds, confidence)
      : [],
    peakActivity: hasDashboardData
      ? buildPeakActivity(latestSounds)
      : buildWaitingPeakActivity(),
  };
}

function parseLatestSounds(value: unknown): SoundGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((sound): sound is SoundGroup => {
    return typeof sound === "string" && isSoundGroup(sound);
  });
}

function formatLastUpload(lastUploadAt: string | null) {
  if (!lastUploadAt) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(lastUploadAt));
}

function toDeviceStatus(status: string): DeviceStatus {
  if (status === "online" || status === "offline" || status === "waiting") {
    return status;
  }

  return "waiting";
}

function toSignalStrength(signal: string): SignalStrength {
  if (
    signal === "Strong" ||
    signal === "Moderate" ||
    signal === "Weak" ||
    signal === "Unknown"
  ) {
    return signal;
  }

  return "Unknown";
}

function toIndicatorLevel(indicator: string): IndicatorLevel {
  if (
    indicator === "High" ||
    indicator === "Moderate" ||
    indicator === "Low" ||
    indicator === "Unknown"
  ) {
    return indicator;
  }

  return "Unknown";
}

function toNoiseLevel(noise: string): NoiseLevel {
  if (
    noise === "Low" ||
    noise === "Moderate" ||
    noise === "High" ||
    noise === "Unknown"
  ) {
    return noise;
  }

  return "Unknown";
}

function isSoundGroup(value: string): value is SoundGroup {
  return (
    value === "Bird" ||
    value === "Frog" ||
    value === "Insect" ||
    value === "Noise" ||
    value === "Unknown"
  );
}

function buildTimeline(
  latestSounds: SoundGroup[],
  noiseLevel: NoiseLevel,
): TimelineEntry[] {
  const timeWindows = [
    "05:00 - 06:00",
    "09:00 - 10:00",
    "14:00 - 15:00",
    "18:00 - 19:00",
  ];

  return timeWindows.map((timePeriod, index) => {
    const primarySound = latestSounds[index % latestSounds.length];
    const secondarySound = latestSounds[(index + 1) % latestSounds.length];
    const groups = Array.from(new Set([primarySound, secondarySound]));

    return {
      timePeriod,
      groups,
      dominantSound: primarySound,
      noiseLevel: index === 1 && noiseLevel !== "Unknown" ? "Moderate" : noiseLevel,
    };
  });
}

function buildActivitySeries(
  indicatorScore: number,
  confidence: number | null,
): ActivityPoint[] {
  const baseConfidence = confidence ?? 70;
  const baseActivity = Math.max(24, Math.min(88, indicatorScore));

  return [
    {
      time: "05:00",
      activity: clampActivity(baseActivity - 14),
      confidence: clampPercent(baseConfidence - 4),
    },
    {
      time: "08:00",
      activity: clampActivity(baseActivity - 24),
      confidence: clampPercent(baseConfidence - 8),
    },
    {
      time: "12:00",
      activity: clampActivity(baseActivity - 8),
      confidence: clampPercent(baseConfidence - 5),
    },
    {
      time: "16:00",
      activity: clampActivity(baseActivity - 2),
      confidence: clampPercent(baseConfidence - 2),
    },
    {
      time: "19:00",
      activity: clampActivity(baseActivity + 10),
      confidence: clampPercent(baseConfidence + 4),
    },
    {
      time: "21:00",
      activity: clampActivity(baseActivity + 2),
      confidence: clampPercent(baseConfidence - 1),
    },
  ];
}

function buildUnknownReviews(
  latestSounds: SoundGroup[],
  confidence: number | null,
): UnknownReview[] {
  const reviews: UnknownReview[] = [];

  if (latestSounds.includes("Unknown")) {
    reviews.push({ timePeriod: "18:42 - 18:47", label: "Unknown Sound" });
  }

  if (confidence !== null && confidence < 70) {
    reviews.push({ timePeriod: "20:15 - 20:20", label: "Low Confidence" });
  }

  return reviews;
}

function buildPeakActivity(latestSounds: SoundGroup[]): PeakActivity {
  return {
    timeWindow: "18:00 - 21:00",
    dominantGroup: latestSounds[0] ?? "Waiting for data",
    secondaryGroup: latestSounds[1] ?? "None",
  };
}

function buildWaitingPeakActivity(): PeakActivity {
  return {
    timeWindow: "Waiting for data",
    dominantGroup: "Waiting for data",
    secondaryGroup: "None",
  };
}

function clampActivity(value: number) {
  return Math.max(10, Math.min(95, value));
}

function clampPercent(value: number) {
  return Math.max(45, Math.min(96, value));
}
