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

export function formatMinutes(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function generateTimeSlots(
  startHour: number,
  endHour: number,
  intervalMinutes: number
): string[] {
  const slots: string[] = [];
  for (let m = startHour * 60; m < endHour * 60; m += intervalMinutes) {
    slots.push(formatMinutes(m));
  }
  return slots;
}

export const MORNING_SLOTS = generateTimeSlots(5, 12, 30);
export const EVENING_SLOTS = generateTimeSlots(12, 21, 30);

export function todayShort(): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}
