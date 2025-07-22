export function formatIsoTimestamp(timestamp: string, dateOnly: boolean) {
  if (timestamp.toUpperCase().charAt(-1) !== "Z") {
    timestamp += "Z";
  }

  const date = new Date(timestamp);
  if (dateOnly) {
    return date.toLocaleDateString("en-GB");
  }

  return date.toLocaleString("en-GB");
}
