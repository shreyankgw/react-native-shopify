export default function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  // E.g., "2024-06-09T15:30:00Z"
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}
