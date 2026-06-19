import {
  addDays,
  addMinutes,
  endOfDay,
  isBefore,
  isEqual,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

type Rule = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type Range = {
  startDateTime: Date;
  endDateTime: Date;
};

export type AvailabilitySlot = {
  start: Date;
  end: Date;
};

function timeOnDate(date: Date, time: string, timezone: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const zonedDate = toZonedTime(date, timezone);
  zonedDate.setHours(Number(hours), Number(minutes), 0, 0);
  return fromZonedTime(zonedDate, timezone);
}

export function rangesOverlap(a: Range, b: Range) {
  return a.startDateTime < b.endDateTime && a.endDateTime > b.startDateTime;
}

export function generateAvailabilitySlots({
  rules,
  blocks,
  appointments,
  from,
  days = 30,
  durationMinutes,
  bufferMinutes,
  timezone,
}: {
  rules: Rule[];
  blocks: Range[];
  appointments: Range[];
  from: Date;
  days?: number;
  durationMinutes: number;
  bufferMinutes: number;
  timezone: string;
}) {
  const slots: AvailabilitySlot[] = [];
  const unavailable = [...blocks, ...appointments];
  const cursor = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  );

  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(cursor, offset);
    const zonedDay = toZonedTime(date, timezone).getDay();
    const activeRules = rules.filter(
      (rule) => rule.isActive && rule.dayOfWeek === zonedDay,
    );

    for (const rule of activeRules) {
      let slotStart = timeOnDate(date, rule.startTime, timezone);
      const ruleEnd = timeOnDate(date, rule.endTime, timezone);

      while (
        isBefore(addMinutes(slotStart, durationMinutes), ruleEnd) ||
        isEqual(addMinutes(slotStart, durationMinutes), ruleEnd)
      ) {
        const slotEnd = addMinutes(slotStart, durationMinutes);
        const slotRange = { startDateTime: slotStart, endDateTime: slotEnd };
        const isFuture = isBefore(new Date(), slotStart);
        const isOpen = !unavailable.some((range) =>
          rangesOverlap(slotRange, range),
        );

        if (isFuture && isOpen) {
          slots.push({ start: slotStart, end: slotEnd });
        }

        slotStart = addMinutes(slotEnd, bufferMinutes);
      }
    }
  }

  return slots;
}

export function isSlotAvailable({
  start,
  end,
  rules,
  blocks,
  appointments,
  timezone,
}: {
  start: Date;
  end: Date;
  rules: Rule[];
  blocks: Range[];
  appointments: Range[];
  timezone: string;
}) {
  const zonedStart = toZonedTime(start, timezone);
  const dayRules = rules.filter(
    (rule) => rule.isActive && rule.dayOfWeek === zonedStart.getDay(),
  );
  const withinRule = dayRules.some((rule) => {
    const ruleStart = timeOnDate(start, rule.startTime, timezone);
    const ruleEnd = timeOnDate(start, rule.endTime, timezone);
    return (
      (isWithinInterval(start, { start: ruleStart, end: ruleEnd }) ||
        isEqual(start, ruleStart)) &&
      (isWithinInterval(end, { start: ruleStart, end: ruleEnd }) ||
        isEqual(end, ruleEnd))
    );
  });

  if (!withinRule) {
    return false;
  }

  return ![...blocks, ...appointments].some((range) =>
    rangesOverlap({ startDateTime: start, endDateTime: end }, range),
  );
}

export function bookingWindow(from = new Date()) {
  return {
    start: startOfDay(from),
    end: endOfDay(addDays(from, 30)),
  };
}
