export function getDateFromIsoTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB");
}
