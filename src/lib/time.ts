export function parseTime(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}

export function isMorning(timeStr: string): boolean {
  return parseTime(timeStr) < 720; // before 12:00 PM
}

export function getTimePeriod(timeStr: string): "Morning" | "Evening" {
  return isMorning(timeStr) ? "Morning" : "Evening";
}

export function sortByTime(a: string, b: string): number {
  return parseTime(a) - parseTime(b);
}

export function todayShort(): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}
