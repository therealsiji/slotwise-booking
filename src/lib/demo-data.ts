import { addDays, addHours } from "date-fns";
import { AppointmentStatus } from "@prisma/client";

const now = new Date();

export const demoUser = {
  id: "demo-user",
  clerkUserId: "demo-clerk-user",
  name: "Siji Olaifa",
  email: "siji@example.com",
  businessName: "SlotWise Studio",
  timezone: "Africa/Lagos",
  bookingSlug: "slotwise-demo",
  defaultAppointmentDuration: 30,
  bufferMinutes: 10,
  createdAt: now,
  updatedAt: now,
};

export const demoAppointments = [
  {
    id: "demo-appointment-1",
    userId: demoUser.id,
    clientName: "Ada Johnson",
    clientEmail: "ada@example.com",
    notes: "Discovery call for a consulting project.",
    startDateTime: addHours(addDays(now, 1), 2),
    endDateTime: addHours(addDays(now, 1), 2.5),
    timezone: demoUser.timezone,
    status: AppointmentStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-appointment-2",
    userId: demoUser.id,
    clientName: "Michael Chen",
    clientEmail: "michael@example.com",
    notes: "Portfolio review session.",
    startDateTime: addHours(addDays(now, 2), 4),
    endDateTime: addHours(addDays(now, 2), 4.5),
    timezone: demoUser.timezone,
    status: AppointmentStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
  },
];

export const demoAvailabilityRules = [
  { id: "sun", userId: demoUser.id, dayOfWeek: 0, startTime: "09:00", endTime: "17:00", isActive: false, createdAt: now, updatedAt: now },
  { id: "mon", userId: demoUser.id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true, createdAt: now, updatedAt: now },
  { id: "tue", userId: demoUser.id, dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true, createdAt: now, updatedAt: now },
  { id: "wed", userId: demoUser.id, dayOfWeek: 3, startTime: "10:00", endTime: "16:00", isActive: true, createdAt: now, updatedAt: now },
  { id: "thu", userId: demoUser.id, dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true, createdAt: now, updatedAt: now },
  { id: "fri", userId: demoUser.id, dayOfWeek: 5, startTime: "09:00", endTime: "14:00", isActive: true, createdAt: now, updatedAt: now },
  { id: "sat", userId: demoUser.id, dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isActive: false, createdAt: now, updatedAt: now },
];

export const demoAvailabilityBlocks = [
  {
    id: "demo-block-1",
    userId: demoUser.id,
    startDateTime: addDays(now, 5),
    endDateTime: addHours(addDays(now, 5), 3),
    reason: "Focus time",
    createdAt: now,
    updatedAt: now,
  },
];
