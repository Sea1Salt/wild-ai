import type { Device, DeviceStatus } from "../types/device";
import { formatDeviceId } from "./deviceIdentity";

export type DeviceFilter = "all" | "online" | "offline" | "lowBattery";

export function getStatusLabel(status: DeviceStatus) {
  const labels: Record<DeviceStatus, string> = {
    online: "Online",
    waiting: "Waiting for first upload",
    offline: "Offline",
  };

  return labels[status];
}

export function getStatusClasses(status: DeviceStatus) {
  const classes: Record<DeviceStatus, string> = {
    online: "border-emerald-200 bg-emerald-50 text-emerald-700",
    waiting: "border-amber-200 bg-amber-50 text-amber-700",
    offline: "border-stone-200 bg-stone-100 text-stone-600",
  };

  return classes[status];
}

export function isLowBattery(device: Device) {
  return device.battery <= 25;
}

export function filterDevices(
  devices: Device[],
  searchTerm: string,
  filter: DeviceFilter,
) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return devices.filter((device) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        device.name,
        device.id,
        formatDeviceId(device.id),
        device.location,
        device.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesFilter =
      filter === "all" ||
      (filter === "online" && device.status === "online") ||
      (filter === "offline" && device.status === "offline") ||
      (filter === "lowBattery" && isLowBattery(device));

    return matchesSearch && matchesFilter;
  });
}
