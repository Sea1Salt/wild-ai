import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, Save, Trash2, X } from "lucide-react";
import type { Device } from "../types/device";
import { DEFAULT_DEVICE_IMAGE } from "../data/mockDevices";

interface AddDeviceModalProps {
  isOpen: boolean;
  editingDevice: Device | null;
  onClose: () => void;
  onDelete: (deviceId: string) => void;
  onSave: (device: Device) => void;
}

interface DeviceFormState {
  name: string;
  id: string;
  location: string;
  description: string;
  image: string;
}

const emptyForm: DeviceFormState = {
  name: "",
  id: "",
  location: "",
  description: "",
  image: "",
};

export function AddDeviceModal({
  isOpen,
  editingDevice,
  onClose,
  onDelete,
  onSave,
}: AddDeviceModalProps) {
  const [form, setForm] = useState<DeviceFormState>(emptyForm);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isEditing = Boolean(editingDevice);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingDevice) {
      setForm({
        name: editingDevice.name,
        id: editingDevice.id,
        location: editingDevice.location,
        description: editingDevice.description,
        image: editingDevice.image,
      });
      setUploadedImageUrl("");
      setIsConfirmingDelete(false);
      return;
    }

    setForm({
      ...emptyForm,
      id: `WAI-${Date.now().toString().slice(-6)}`,
    });
    setUploadedImageUrl("");
    setIsConfirmingDelete(false);
  }, [editingDevice, isOpen]);

  useEffect(() => {
    return () => {
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  const previewImage = useMemo(
    () => uploadedImageUrl || form.image || DEFAULT_DEVICE_IMAGE,
    [form.image, uploadedImageUrl],
  );

  if (!isOpen) {
    return null;
  }

  const handleFieldChange =
    (field: keyof DeviceFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const result = reader.result;

      if (typeof result === "string") {
        setForm((current) => ({
          ...current,
          image: result,
        }));
      }
    });

    reader.readAsDataURL(file);
    setUploadedImageUrl(objectUrl);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedId = form.id.trim();
    const trimmedLocation = form.location.trim();

    if (!trimmedName || !trimmedId || !trimmedLocation) {
      return;
    }

    const savedDevice: Device = editingDevice
      ? {
          ...editingDevice,
          name: trimmedName,
          id: trimmedId,
          location: trimmedLocation,
          description: form.description.trim(),
          image: form.image || DEFAULT_DEVICE_IMAGE,
        }
      : {
          id: trimmedId,
          name: trimmedName,
          location: trimmedLocation,
          description: form.description.trim(),
          image: form.image || DEFAULT_DEVICE_IMAGE,
          status: "waiting",
          battery: 100,
          signal: "Unknown",
          storage: 100,
          pendingUploads: 0,
          lastUpload: "—",
          latestSounds: [],
          indicator: "Unknown",
          indicatorScore: null,
          noise: "Unknown",
          confidence: null,
          timeline: [],
          activitySeries: [],
          unknownReviews: [],
          peakActivity: {
            timeWindow: "Waiting for data",
            dominantGroup: "Waiting for data",
            secondaryGroup: "None",
          },
        };

    onSave(savedDevice);
  };

  const handleDelete = () => {
    if (!editingDevice) {
      return;
    }

    onDelete(editingDevice.id);
    setIsConfirmingDelete(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-900/65 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full overflow-hidden rounded-[1.75rem] border border-white/40 bg-cream shadow-soft"
        >
          <div className="flex items-center justify-between border-b border-stone-200 bg-white/65 px-6 py-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest-500">
                Device Profile
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-stone-950">
                {isEditing ? "Edit Device" : "Add Device"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-stone-600 transition hover:bg-stone-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[240px_1fr]">
            <div>
              <div className="overflow-hidden rounded-[1.25rem] border border-stone-200 bg-white">
                <img
                  className="h-56 w-full object-cover"
                  src={previewImage}
                  alt="Device preview"
                />
              </div>
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-forest-300 bg-white px-4 py-3 text-sm font-semibold text-forest-700 transition hover:bg-forest-50">
                <ImagePlus className="h-4 w-4" />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              <p className="mt-3 text-xs leading-5 text-stone-500">
                If no image is selected, a default forest image is used.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-stone-700">
                  Device Name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={handleFieldChange("name")}
                  className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-100"
                  placeholder="Forest Device 04"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-stone-700">
                  Location
                </span>
                <input
                  required
                  value={form.location}
                  onChange={handleFieldChange("location")}
                  className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-100"
                  placeholder="Forest region, country"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-stone-700">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={handleFieldChange("description")}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-100"
                  placeholder="Deployment notes, terrain, or monitoring context"
                />
              </label>
            </div>
          </div>

          {isConfirmingDelete && editingDevice ? (
            <div className="mx-6 mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                Delete {editingDevice.name}?
              </p>
              <p className="mt-1 text-sm leading-6 text-red-700">
                This removes the device profile from the dashboard. Please confirm
                so it does not happen by mistake.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Keep Device
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                  Yes, Delete Device
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-white/65 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Device
              </button>
            ) : (
              <span />
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700"
              >
                <Save className="h-4 w-4" />
                Save Device
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
