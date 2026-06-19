export const APPOINTMENT_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
} as const;

export const EMAIL_TYPE = {
  BOOKING_CONFIRMATION: "BOOKING_CONFIRMATION",
  PROFESSIONAL_NOTIFICATION: "PROFESSIONAL_NOTIFICATION",
  CANCELLATION: "CANCELLATION",
} as const;

export const EMAIL_STATUS = {
  SENT: "SENT",
  FAILED: "FAILED",
  SKIPPED: "SKIPPED",
} as const;

export type AppointmentStatusValue =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];
export type EmailTypeValue = (typeof EMAIL_TYPE)[keyof typeof EMAIL_TYPE];
export type EmailStatusValue = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];
