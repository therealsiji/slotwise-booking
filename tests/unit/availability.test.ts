import { describe, expect, it } from "vitest";
import {
  generateAvailabilitySlots,
  isSlotAvailable,
  rangesOverlap,
} from "@/lib/availability";

describe("availability", () => {
  it("detects overlapping appointment ranges", () => {
    expect(
      rangesOverlap(
        {
          startDateTime: new Date("2026-06-08T10:00:00.000Z"),
          endDateTime: new Date("2026-06-08T10:30:00.000Z"),
        },
        {
          startDateTime: new Date("2026-06-08T10:15:00.000Z"),
          endDateTime: new Date("2026-06-08T10:45:00.000Z"),
        },
      ),
    ).toBe(true);
  });

  it("generates slots from active weekly rules", () => {
    const slots = generateAvailabilitySlots({
      rules: [
        {
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "10:00",
          isActive: true,
        },
      ],
      blocks: [],
      appointments: [],
      from: new Date("2027-06-07T00:00:00.000Z"),
      days: 1,
      durationMinutes: 30,
      bufferMinutes: 0,
      timezone: "UTC",
    });

    expect(slots).toHaveLength(2);
  });

  it("rejects slots blocked by an active appointment", () => {
    const start = new Date("2027-06-07T09:00:00.000Z");
    const end = new Date("2027-06-07T09:30:00.000Z");

    expect(
      isSlotAvailable({
        start,
        end,
        timezone: "UTC",
        rules: [
          {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "10:00",
            isActive: true,
          },
        ],
        blocks: [],
        appointments: [{ startDateTime: start, endDateTime: end }],
      }),
    ).toBe(false);
  });
});
