import { z } from "zod";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  businessName: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.email("Enter a valid email address."),
  timezone: z.string().trim().min(1, "Choose a timezone."),
  bookingSlug: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens."),
  defaultAppointmentDuration: z.coerce.number().int().min(15).max(240),
  bufferMinutes: z.coerce.number().int().min(0).max(120),
});

export const availabilityRuleSchema = z.object({
  id: z.string().optional(),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(timePattern),
  endTime: z.string().regex(timePattern),
  isActive: z.coerce.boolean(),
});

export const availabilityRulesSchema = z.object({
  rules: z.array(availabilityRuleSchema).min(1),
});

export const availabilityBlockSchema = z.object({
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  reason: z.string().trim().max(120).optional().or(z.literal("")),
});

export const bookingSchema = z.object({
  userId: z.string().min(1),
  startDateTime: z.coerce.date(),
  clientName: z.string().trim().min(2, "Enter your name."),
  clientEmail: z.email("Enter a valid email address."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const cancellationSchema = z.object({
  appointmentId: z.string().min(1),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
