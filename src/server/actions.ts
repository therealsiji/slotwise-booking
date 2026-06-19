"use server";

import { addMinutes } from "date-fns";
import { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { bookingWindow, generateAvailabilitySlots, isSlotAvailable } from "@/lib/availability";
import { getDb } from "@/lib/db";
import { sendBookingEmails, sendCancellationEmail } from "@/lib/email";
import {
  availabilityBlockSchema,
  bookingSchema,
  cancellationSchema,
  profileSchema,
} from "@/lib/validators";
import { getCurrentSlotWiseUser } from "@/server/user";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function updateProfile(formData: FormData) {
  const user = await getCurrentSlotWiseUser();
  const parsed = profileSchema.parse({
    name: stringValue(formData, "name"),
    businessName: stringValue(formData, "businessName"),
    email: stringValue(formData, "email"),
    timezone: stringValue(formData, "timezone"),
    bookingSlug: stringValue(formData, "bookingSlug"),
    defaultAppointmentDuration: stringValue(formData, "defaultAppointmentDuration"),
    bufferMinutes: stringValue(formData, "bufferMinutes"),
  });

  await getDb().user.update({
    where: { id: user.id },
    data: parsed,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/book/${parsed.bookingSlug}`);
}

export async function updateAvailabilityRules(formData: FormData) {
  const user = await getCurrentSlotWiseUser();
  const rules = Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    isActive: formData.get(`day-${dayOfWeek}-active`) === "on",
    startTime: stringValue(formData, `day-${dayOfWeek}-start`) || "09:00",
    endTime: stringValue(formData, `day-${dayOfWeek}-end`) || "17:00",
  }));

  await getDb().$transaction([
    getDb().availabilityRule.deleteMany({ where: { userId: user.id } }),
    getDb().availabilityRule.createMany({
      data: rules.map((rule) => ({
        ...rule,
        userId: user.id,
      })),
    }),
  ]);

  revalidatePath("/dashboard/availability");
  revalidatePath(`/book/${user.bookingSlug}`);
}

export async function createAvailabilityBlock(formData: FormData) {
  const user = await getCurrentSlotWiseUser();
  const parsed = availabilityBlockSchema.parse({
    startDateTime: stringValue(formData, "startDateTime"),
    endDateTime: stringValue(formData, "endDateTime"),
    reason: stringValue(formData, "reason"),
  });

  await getDb().availabilityBlock.create({
    data: {
      ...parsed,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/availability");
  revalidatePath(`/book/${user.bookingSlug}`);
}

export async function deleteAvailabilityBlock(formData: FormData) {
  const user = await getCurrentSlotWiseUser();
  const blockId = stringValue(formData, "blockId");

  await getDb().availabilityBlock.delete({
    where: {
      id: blockId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/availability");
  revalidatePath(`/book/${user.bookingSlug}`);
}

export async function createAppointment(formData: FormData) {
  const parsed = bookingSchema.parse({
    userId: stringValue(formData, "userId"),
    startDateTime: stringValue(formData, "startDateTime"),
    clientName: stringValue(formData, "clientName"),
    clientEmail: stringValue(formData, "clientEmail"),
    notes: stringValue(formData, "notes"),
  });
  const db = getDb();
  const professional = await db.user.findUnique({
    where: { id: parsed.userId },
    include: {
      availabilityRules: true,
      availabilityBlocks: true,
    },
  });

  if (!professional) {
    throw new Error("Booking page not found.");
  }

  const startDateTime = parsed.startDateTime;
  const endDateTime = addMinutes(
    startDateTime,
    professional.defaultAppointmentDuration,
  );
  const window = bookingWindow(startDateTime);

  const activeAppointments = await db.appointment.findMany({
    where: {
      userId: professional.id,
      status: AppointmentStatus.ACTIVE,
      startDateTime: { lte: window.end },
      endDateTime: { gte: window.start },
    },
  });

  const available = isSlotAvailable({
    start: startDateTime,
    end: endDateTime,
    rules: professional.availabilityRules,
    blocks: professional.availabilityBlocks,
    appointments: activeAppointments,
    timezone: professional.timezone,
  });

  if (!available) {
    throw new Error("This time is no longer available.");
  }

  const appointment = await db.$transaction(async (tx) => {
    const conflicts = await tx.appointment.count({
      where: {
        userId: professional.id,
        status: AppointmentStatus.ACTIVE,
        startDateTime: { lt: endDateTime },
        endDateTime: { gt: startDateTime },
      },
    });

    if (conflicts > 0) {
      throw new Error("This time was just booked by someone else.");
    }

    return tx.appointment.create({
      data: {
        userId: professional.id,
        clientName: parsed.clientName,
        clientEmail: parsed.clientEmail,
        notes: parsed.notes,
        startDateTime,
        endDateTime,
        timezone: professional.timezone,
      },
      include: { user: true },
    });
  });

  await sendBookingEmails(appointment);
  revalidatePath(`/book/${professional.bookingSlug}`);
  redirect(`/book/${professional.bookingSlug}?booked=1`);
}

export async function cancelAppointment(formData: FormData) {
  const user = await getCurrentSlotWiseUser();
  const parsed = cancellationSchema.parse({
    appointmentId: stringValue(formData, "appointmentId"),
  });

  const appointment = await getDb().appointment.update({
    where: {
      id: parsed.appointmentId,
      userId: user.id,
    },
    data: { status: AppointmentStatus.CANCELLED },
    include: { user: true },
  });

  await sendCancellationEmail(appointment);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/appointments");
  revalidatePath(`/book/${user.bookingSlug}`);
}

export async function getPublicSlots(userId: string) {
  const user = await getDb().user.findUnique({
    where: { id: userId },
    include: {
      availabilityRules: true,
      availabilityBlocks: true,
      appointments: {
        where: { status: AppointmentStatus.ACTIVE },
      },
    },
  });

  if (!user) {
    return [];
  }

  return generateAvailabilitySlots({
    rules: user.availabilityRules,
    blocks: user.availabilityBlocks,
    appointments: user.appointments,
    from: new Date(),
    durationMinutes: user.defaultAppointmentDuration,
    bufferMinutes: user.bufferMinutes,
    timezone: user.timezone,
  });
}
