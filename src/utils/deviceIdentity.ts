export function formatDeviceId(id: string) {
  const compactId = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const paddedId = compactId.padEnd(8, "0");

  return `AWB-${paddedId.slice(0, 4)}-${paddedId.slice(-4)}`;
}
