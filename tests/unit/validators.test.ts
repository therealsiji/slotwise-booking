import { describe, expect, it } from "vitest";
import { bookingSchema, profileSchema } from "@/lib/validators";

describe("validators", () => {
  it("accepts a valid booking payload", () => {
    expect(() =>
      bookingSchema.parse({
        userId: "user_123",
        startDateTime: "2026-06-08T09:00:00.000Z",
        clientName: "Ada Lovelace",
        clientEmail: "ada@example.com",
        notes: "Discovery call",
      }),
    ).not.toThrow();
  });

  it("rejects invalid booking slugs", () => {
    expect(() =>
      profileSchema.parse({
        name: "Ada Lovelace",
        email: "ada@example.com",
        businessName: "Ada Co",
        timezone: "UTC",
        bookingSlug: "Ada Lovelace!",
        defaultAppointmentDuration: 30,
        bufferMinutes: 0,
      }),
    ).toThrow();
  });
});
