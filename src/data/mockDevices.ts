import type { Device } from "../types/device";

export const DEFAULT_DEVICE_IMAGE =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80";

const activeTimeline = [
  {
    timePeriod: "05:00 - 06:00",
    groups: ["Bird", "Insect"],
    dominantSound: "Bird",
    noiseLevel: "Low",
  },
  {
    timePeriod: "12:00 - 13:00",
    groups: ["Insect", "Noise"],
    dominantSound: "Insect",
    noiseLevel: "Moderate",
  },
  {
    timePeriod: "18:00 - 19:00",
    groups: ["Bird", "Frog", "Insect"],
    dominantSound: "Frog",
    noiseLevel: "Low",
  },
  {
    timePeriod: "20:00 - 21:00",
    groups: ["Frog", "Unknown"],
    dominantSound: "Frog",
    noiseLevel: "Low",
  },
] satisfies Device["timeline"];

const activeSeries = [
  { time: "05:00", activity: 62, confidence: 84 },
  { time: "08:00", activity: 44, confidence: 79 },
  { time: "12:00", activity: 58, confidence: 76 },
  { time: "16:00", activity: 51, confidence: 81 },
  { time: "19:00", activity: 78, confidence: 86 },
  { time: "21:00", activity: 66, confidence: 80 },
];

export const mockDevices: Device[] = [
  {
    id: "WAI-0001-7K3A",
    name: "Forest Device 01",
    location: "Western Ghats, India",
    description: "Edge forest acoustic node near a seasonal water source.",
    status: "online",
    battery: 87,
    signal: "Strong",
    storage: 64,
    pendingUploads: 0,
    lastUpload: "2 min ago",
    latestSounds: ["Bird", "Frog", "Insect"],
    indicator: "High",
    indicatorScore: 78,
    noise: "Low",
    confidence: 82,
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80",
    timeline: activeTimeline,
    activitySeries: activeSeries,
    unknownReviews: [
      { timePeriod: "20:12 - 20:13", label: "Unknown Sound" },
      { timePeriod: "20:45 - 20:46", label: "Low Confidence" },
    ],
    peakActivity: {
      timeWindow: "18:00 - 21:00",
      dominantGroup: "Frog",
      secondaryGroup: "Bird",
    },
  },
  {
    id: "WAI-0002-M9ZB",
    name: "Forest Device 02",
    location: "Kanha National Park, India",
    description: "Newly registered device waiting for the first field upload.",
    status: "waiting",
    battery: 63,
    signal: "Unknown",
    storage: 100,
    pendingUploads: 0,
    lastUpload: "—",
    latestSounds: [],
    indicator: "Unknown",
    indicatorScore: null,
    noise: "Unknown",
    confidence: null,
    image: DEFAULT_DEVICE_IMAGE,
    timeline: [],
    activitySeries: [],
    unknownReviews: [],
    peakActivity: {
      timeWindow: "Waiting for data",
      dominantGroup: "Waiting for data",
      secondaryGroup: "None",
    },
  },
  {
    id: "WAI-0003-R4VQ",
    name: "Forest Device 03",
    location: "Buxa Tiger Reserve, India",
    description: "Canopy-edge device with intermittent signal and stored uploads.",
    status: "offline",
    battery: 18,
    signal: "Weak",
    storage: 22,
    pendingUploads: 7,
    lastUpload: "18 hours ago",
    latestSounds: ["Noise", "Insect", "Unknown"],
    indicator: "Low",
    indicatorScore: 42,
    noise: "High",
    confidence: 61,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    timeline: [
      {
        timePeriod: "04:00 - 05:00",
        groups: ["Insect", "Unknown"],
        dominantSound: "Insect",
        noiseLevel: "Moderate",
      },
      {
        timePeriod: "11:00 - 12:00",
        groups: ["Noise"],
        dominantSound: "Noise",
        noiseLevel: "High",
      },
      {
        timePeriod: "18:00 - 19:00",
        groups: ["Insect", "Noise", "Unknown"],
        dominantSound: "Noise",
        noiseLevel: "High",
      },
    ],
    activitySeries: [
      { time: "04:00", activity: 36, confidence: 64 },
      { time: "08:00", activity: 24, confidence: 58 },
      { time: "12:00", activity: 48, confidence: 61 },
      { time: "16:00", activity: 41, confidence: 59 },
      { time: "19:00", activity: 52, confidence: 62 },
      { time: "21:00", activity: 33, confidence: 56 },
    ],
    unknownReviews: [
      { timePeriod: "04:18 - 04:19", label: "Unknown Sound" },
      { timePeriod: "18:42 - 18:43", label: "Low Confidence" },
    ],
    peakActivity: {
      timeWindow: "18:00 - 19:00",
      dominantGroup: "Noise",
      secondaryGroup: "Insect",
    },
  },
];
