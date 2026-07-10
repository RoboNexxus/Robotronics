export function generateRegId(count: number): string {
  return `RN-${String(count + 1).padStart(3, "0")}`;
}
