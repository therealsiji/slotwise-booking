import { EmailStatus, EmailType, type Appointment, type User } from "@prisma/client";
import { Resend } from "resend";
import { getDb } from "@/lib/db";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

type AppointmentWithUser = Appointment & {
  user: User;
};

async function logEmail({
  appointmentId,
  recipientEmail,
  emailType,
  status,
  providerMessageId,
  errorMessage,
}: {
  appointmentId: string;
  recipientEmail: string;
  emailType: EmailType;
  status: EmailStatus;
  providerMessageId?: string;
  errorMessage?: string;
}) {
  try {
    await getDb().emailLog.create({
      data: {
        appointmentId,
        recipientEmail,
        emailType,
        status,
        providerMessageId,
        errorMessage,
      },
    });
  } catch (error) {
    console.error("Email log failed", error);
  }
}

async function sendAppointmentEmail({
  appointment,
  to,
  subject,
  emailType,
  intro,
}: {
  appointment: AppointmentWithUser;
  to: string;
  subject: string;
  emailType: EmailType;
  intro: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: appointment.timezone,
  }).format(appointment.startDateTime);
  const client = getResend();

  if (!client) {
    console.info("[email skipped]", { to, subject, appointmentId: appointment.id });
    await logEmail({
      appointmentId: appointment.id,
      recipientEmail: to,
      emailType,
      status: EmailStatus.SKIPPED,
      errorMessage: "RESEND_API_KEY is not configured.",
    });
    return;
  }

  try {
    const response = await client.emails.send({
      from: process.env.EMAIL_FROM || "SlotWise <appointments@example.com>",
      to,
      subject,
      text: `${intro}\n\nWhen: ${formattedDate} (${appointment.timezone})\nProfessional: ${appointment.user.name}\nClient: ${appointment.clientName}\nNotes: ${appointment.notes || "None"}`,
    });

    await logEmail({
      appointmentId: appointment.id,
      recipientEmail: to,
      emailType,
      status: EmailStatus.SENT,
      providerMessageId: response.data?.id,
    });
  } catch (error) {
    await logEmail({
      appointmentId: appointment.id,
      recipientEmail: to,
      emailType,
      status: EmailStatus.FAILED,
      errorMessage: error instanceof Error ? error.message : "Unknown email error",
    });
  }
}

export async function sendBookingEmails(appointment: AppointmentWithUser) {
  await Promise.all([
    sendAppointmentEmail({
      appointment,
      to: appointment.clientEmail,
      subject: `Confirmed: appointment with ${appointment.user.name}`,
      emailType: EmailType.BOOKING_CONFIRMATION,
      intro: "Your appointment is confirmed.",
    }),
    sendAppointmentEmail({
      appointment,
      to: appointment.user.email,
      subject: `New booking from ${appointment.clientName}`,
      emailType: EmailType.PROFESSIONAL_NOTIFICATION,
      intro: "A new appointment has been booked.",
    }),
  ]);
}

export async function sendCancellationEmail(appointment: AppointmentWithUser) {
  await sendAppointmentEmail({
    appointment,
    to: appointment.clientEmail,
    subject: `Cancelled: appointment with ${appointment.user.name}`,
    emailType: EmailType.CANCELLATION,
    intro: "This appointment has been cancelled.",
  });
}
