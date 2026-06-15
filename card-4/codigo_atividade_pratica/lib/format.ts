export function formatDateToBrazilian(dateValue: string): string {
  return new Date(dateValue)
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");
}
