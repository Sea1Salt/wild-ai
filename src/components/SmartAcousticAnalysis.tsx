import {
  Activity,
  CheckCircle2,
  FileAudio,
  Loader2,
  Radio,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SoundGroup } from "../types/device";
import type { InferenceResult, InferenceSegment } from "../types/inference";
import { SoundChip } from "./SoundChip";

const acceptedAudioTypes = ".wav,.mp3,.m4a,.ogg,audio/*";

const mockPattern: Array<Pick<InferenceSegment, "soundGroup" | "confidence" | "status">> = [
  { soundGroup: "Bird", confidence: 0.88, status: "Detected" },
  { soundGroup: "Frog", confidence: 0.76, status: "Detected" },
  { soundGroup: "Insect", confidence: 0.81, status: "Detected" },
  { soundGroup: "Noise", confidence: 0.69, status: "Disturbance" },
  { soundGroup: "Unknown", confidence: 0.54, status: "Review Needed" },
];

export function SmartAcousticAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setDurationSeconds(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    const audio = new Audio(objectUrl);

    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration)) {
        setDurationSeconds(audio.duration);
      }
    });

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError("");
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      setError("Please upload an audio file before analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    window.setTimeout(() => {
      const analysisDuration = Math.max(
        12,
        Math.min(30, Math.round(durationSeconds ?? 18)),
      );
      const segments = createMockSegments(analysisDuration);

      setResult({
        fileName: selectedFile.name,
        durationSeconds: analysisDuration,
        summary: {
          dominantGroup: getDominantGroup(segments),
          highestConfidence: Math.max(
            ...segments.map((segment) => segment.confidence),
          ),
          reviewSegments: segments.filter(
            (segment) => segment.status === "Review Needed",
          ).length,
          detectedGroups: Array.from(
            new Set(segments.map((segment) => segment.soundGroup)),
          ),
        },
        segments,
      });
      setIsAnalyzing(false);
    }, 1400);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setDurationSeconds(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="bg-forest-900 p-6 text-cream sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Smart Acoustic Analysis
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-normal sm:text-4xl">
              Analyze forest audio across time segments.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-200">
              Upload a forest audio file and let AWiSBA identify detected sound
              groups with confidence scores for each time segment.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <InsightTile
                icon={FileAudio}
                label="Input"
                value={selectedFile ? selectedFile.name : "Audio file"}
              />
              <InsightTile
                icon={Activity}
                label="Mode"
                value="Segment analysis"
              />
              <InsightTile
                icon={Radio}
                label="Output"
                value="Sound groups"
              />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <label
              className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-forest-300 bg-forest-50/60 p-6 text-center transition hover:bg-forest-50"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const file = event.dataTransfer.files[0];

                if (file) {
                  setSelectedFile(file);
                  setResult(null);
                  setError("");
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedAudioTypes}
                onChange={handleFileChange}
                className="sr-only"
              />
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-forest-700 shadow-sm">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-stone-950">
                Upload Forest Audio
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
                Select or drop a WAV, MP3, M4A, or OGG file for sound-group
                timeline analysis.
              </p>
            </label>

            {selectedFile ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-forest-700">
                    <FileAudio className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {formatFileSize(selectedFile.size)}
                      {durationSeconds ? ` • ${formatSeconds(durationSeconds)}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              </div>
            ) : null}

            {error ? (
              <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isAnalyzing ? "Analyzing acoustic patterns..." : "Analyze Sound"}
              </button>
            </div>
          </div>
        </div>

        {result ? <InferenceResults result={result} /> : null}
      </div>
    </section>
  );
}

function InferenceResults({ result }: { result: InferenceResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border-t border-stone-200 bg-cream/55 p-6 sm:p-8"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Dominant Group">
          <SoundChip sound={result.summary.dominantGroup} />
        </SummaryCard>
        <SummaryCard label="Highest Confidence">
          {Math.round(result.summary.highestConfidence * 100)}%
        </SummaryCard>
        <SummaryCard label="Review Segments">
          {result.summary.reviewSegments}
        </SummaryCard>
        <SummaryCard label="Detected Groups">
          {result.summary.detectedGroups.length}
        </SummaryCard>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-stone-950">
              Detected Sound Timeline
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {result.fileName} • {formatSeconds(result.durationSeconds)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.summary.detectedGroups.map((sound) => (
              <SoundChip key={sound} sound={sound} />
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Time Segment</th>
                <th className="px-4 py-3 font-semibold">Detected Sound Group</th>
                <th className="px-4 py-3 font-semibold">Confidence</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {result.segments.map((segment) => (
                <tr key={segment.id}>
                  <td className="px-4 py-4 font-semibold text-stone-800">
                    {formatSegment(segment.startSecond, segment.endSecond)}
                  </td>
                  <td className="px-4 py-4">
                    <SoundChip sound={segment.soundGroup} />
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {Math.round(segment.confidence * 100)}%
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        segment.status,
                      )}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {segment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function InsightTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileAudio;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <Icon className="h-5 w-5 text-cream" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-300">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-cream">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <div className="mt-3 text-2xl font-semibold text-stone-950">{children}</div>
    </div>
  );
}

function createMockSegments(durationSeconds: number): InferenceSegment[] {
  const segmentLength = 3;
  const segmentCount = Math.ceil(durationSeconds / segmentLength);

  return Array.from({ length: segmentCount }, (_, index) => {
    const pattern = mockPattern[index % mockPattern.length];
    const startSecond = index * segmentLength;
    const endSecond = Math.min(durationSeconds, startSecond + segmentLength);

    return {
      id: `segment-${index}`,
      startSecond,
      endSecond,
      ...pattern,
    };
  });
}

function getDominantGroup(segments: InferenceSegment[]): SoundGroup {
  const totals = segments.reduce<Record<SoundGroup, number>>(
    (accumulator, segment) => {
      accumulator[segment.soundGroup] += segment.confidence;
      return accumulator;
    },
    {
      Bird: 0,
      Frog: 0,
      Insect: 0,
      Noise: 0,
      Unknown: 0,
    },
  );

  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0] as SoundGroup;
}

function getStatusClass(status: InferenceSegment["status"]) {
  const classes: Record<InferenceSegment["status"], string> = {
    Detected: "bg-emerald-50 text-emerald-700",
    Disturbance: "bg-rose-50 text-rose-700",
    "Review Needed": "bg-amber-50 text-amber-700",
  };

  return classes[status];
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatSeconds(seconds: number) {
  return `${Math.round(seconds)} sec`;
}

function formatSegment(startSecond: number, endSecond: number) {
  return `${startSecond.toFixed(0)}s - ${endSecond.toFixed(0)}s`;
}
