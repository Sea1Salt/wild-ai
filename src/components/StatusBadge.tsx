import type { DeviceStatus } from "../types/device";
import { getStatusClasses, getStatusLabel } from "../utils/deviceStatus";

interface StatusBadgeProps {
  status: DeviceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
