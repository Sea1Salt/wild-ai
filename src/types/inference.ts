import type { SoundGroup } from "./device";

export type InferenceSegmentStatus =
  | "Detected"
  | "Disturbance"
  | "Review Needed";

export interface InferenceSegment {
  id: string;
  startSecond: number;
  endSecond: number;
  soundGroup: SoundGroup;
  confidence: number;
  status: InferenceSegmentStatus;
}

export interface InferenceSummary {
  dominantGroup: SoundGroup;
  highestConfidence: number;
  reviewSegments: number;
  detectedGroups: SoundGroup[];
}

export interface InferenceResult {
  fileName: string;
  durationSeconds: number;
  summary: InferenceSummary;
  segments: InferenceSegment[];
}
