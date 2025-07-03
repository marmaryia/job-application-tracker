export function formatIsoTimestamp(timestamp: string, dateOnly: boolean) {
  const date = new Date(timestamp);
  if (dateOnly) {
    return date.toLocaleDateString("en-GB");
  }

  return date.toLocaleString("en-GB");
}
