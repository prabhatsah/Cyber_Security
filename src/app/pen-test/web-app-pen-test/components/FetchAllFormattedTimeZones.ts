// // utils/timezones.ts
import moment from "moment-timezone";

export interface TimeZoneOption {
  label: string;
  value: string;
}

export function getFormattedTimeZones(): string[] {
  const allTimeZones = moment.tz.names();

  const formatted: TimeZoneOption[] = allTimeZones.map((tz) => {
    const offset = moment.tz(tz).utcOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
    const label = `(UTC${sign}${hours}:${minutes}) ${tz.replace(/_/g, " ")}`;
    return {
      label,
      value: tz,
    };
  });

  return formatted
    .sort((a, b) => {
      const offsetA = moment.tz(a.value).utcOffset();
      const offsetB = moment.tz(b.value).utcOffset();
      return offsetA - offsetB || a.label.localeCompare(b.label);
    })
    .map((tz) => {
      return tz.label;
    });
}
