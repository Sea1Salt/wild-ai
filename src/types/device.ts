import type { LucideIcon } from "lucide-react";

export type DeviceStatus = "online" | "waiting" | "offline";

export type SoundGroup = "Bird" | "Frog" | "Insect" | "Noise" | "Unknown";

export type IndicatorLevel = "High" | "Moderate" | "Low" | "Unknown";

export type NoiseLevel = "Low" | "Moderate" | "High" | "Unknown";

export type SignalStrength = "Strong" | "Moderate" | "Weak" | "Unknown";

export interface TimelineEntry {
  timePeriod: string;
  groups: SoundGroup[];
  dominantSound: SoundGroup | "Waiting for data";
  noiseLevel: NoiseLevel;
}

export interface ActivityPoint {
  time: string;
  activity: number;
  confidence: number;
}

export interface UnknownReview {
  timePeriod: string;
  label: "Unknown Sound" | "Low Confidence";
}

export interface PeakActivity {
  timeWindow: string;
  dominantGroup: SoundGroup | "Waiting for data";
  secondaryGroup: SoundGroup | "None";
}

export interface Device {
  id: string;
  name: string;
  location: string;
  description: string;
  status: DeviceStatus;
  battery: number;
  signal: SignalStrength;
  storage: number;
  pendingUploads: number;
  lastUpload: string;
  latestSounds: SoundGroup[];
  indicator: IndicatorLevel;
  indicatorScore: number | null;
  noise: NoiseLevel;
  confidence: number | null;
  image: string;
  timeline: TimelineEntry[];
  activitySeries: ActivityPoint[];
  unknownReviews: UnknownReview[];
  peakActivity: PeakActivity;
}

export interface MetricCardTone {
  background: string;
  icon: string;
}

export interface MetricDefinition {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: MetricCardTone;
}
