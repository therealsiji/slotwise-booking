# Product Requirements Document: SlotWise

## Product Name and Description

**SlotWise** is an appointment scheduling platform that helps business professionals and freelancers manage availability, book meetings, and send automated email confirmations.

## Problem Statement

Business professionals and freelancers often lose time coordinating appointments through back-and-forth messages, manually checking availability, confirming bookings, and handling reschedules. Existing tools can feel too complex, too expensive, or poorly suited for solo operators and small professional workflows.

SlotWise solves this by giving users a simple calendar-based scheduling experience where they can define availability, share booking links, receive appointments, and automatically send confirmations without manual follow-up.

## Target User Profile

### Primary Users

- Business professionals, consultants, coaches, service providers, and freelancers aged 25-50.
- Users who regularly take client calls, consultations, discovery sessions, interviews, or service appointments.
- Users who need a polished scheduling experience but do not need a full enterprise scheduling suite.

### User Goals

- Avoid manual appointment coordination.
- Show only available time slots to clients.
- Reduce no-shows through email confirmations.
- Manage upcoming appointments from a clear calendar view.
- Maintain a professional booking experience.

### User Pain Points

- Too much back-and-forth when finding meeting times.
- Missed or double-booked appointments.
- Manual calendar checks before confirming availability.
- Forgetting to send confirmation details.
- Difficulty managing different availability windows.

## Product Goals

- Make appointment booking simple for both the professional and the client.
- Help users define and manage their availability with minimal setup.
- Provide a clean calendar view of upcoming appointments.
- Automatically send clear email confirmations after bookings.
- Deliver a reliable v1 that can later support payments, team scheduling, reminders, and calendar integrations.

## Success Metrics

- Users can create availability and publish a booking link within 10 minutes.
- At least 80% of test users can book an appointment without assistance.
- Confirmation emails are delivered successfully for 95% or more of bookings.
- Appointment creation, cancellation, and rescheduling flows complete without calendar conflicts.
- Users can clearly understand their upcoming appointments from the calendar view.

## Core Features for v1

### 1. User Account and Profile Setup

Users can create an account, configure their professional profile, and set basic appointment information.

#### User Stories

- As a professional, I want to create an account so that I can manage my appointments securely.
- As a professional, I want to add my name, business name, timezone, and contact email so that clients know who they are booking with.
- As a professional, I want to define my default appointment duration so that bookings follow my preferred meeting length.
- As a client, I want to see the professional's basic profile before booking so that I know I am scheduling with the right person.

#### Acceptance Criteria

- User can sign up, log in, and log out.
- User can edit profile details.
- User timezone is stored and used when displaying availability.
- Booking page displays the professional's name, business name, and appointment details.

### 2. Availability Management

Users can define weekly availability windows and block off unavailable times.

#### User Stories

- As a professional, I want to set my available days and hours so that clients only book times that work for me.
- As a professional, I want to mark specific dates as unavailable so that I can block holidays, travel days, or personal time.
- As a professional, I want to set buffer time between appointments so that I have time between meetings.
- As a client, I want to see only valid appointment slots so that I do not accidentally book an unavailable time.

#### Acceptance Criteria

- User can configure weekly recurring availability.
- User can block one-off dates or time ranges.
- System prevents bookings outside availability windows.
- System prevents overlapping bookings.
- Availability respects user timezone.

### 3. Public Booking Page

Each user gets a shareable booking page where clients can view available slots and schedule appointments.

#### User Stories

- As a professional, I want to share a booking link so that clients can schedule appointments without contacting me first.
- As a client, I want to choose an available date and time so that I can book an appointment quickly.
- As a client, I want to enter my name, email, and optional notes so that the professional has the details they need.
- As a professional, I want new bookings to appear in my appointment list so that I can track upcoming meetings.

#### Acceptance Criteria

- Each user has a unique public booking URL.
- Booking page shows available dates and time slots.
- Client can submit name, email, and appointment notes.
- System creates appointment only if the selected slot is still available.
- Client receives a success message after booking.

### 4. Calendar View and Appointment Management

Users can view upcoming appointments in a calendar interface and manage appointment status.

#### User Stories

- As a professional, I want to see my appointments in a calendar view so that I can understand my schedule visually.
- As a professional, I want to click an appointment to see client details so that I can prepare for the meeting.
- As a professional, I want to cancel an appointment so that I can manage changes when needed.
- As a professional, I want to see appointment status so that I can distinguish active and cancelled bookings.

#### Acceptance Criteria

- User can view appointments by month, week, or day.
- User can open appointment details from the calendar.
- User can cancel an appointment.
- Cancelled appointments are clearly marked and no longer block availability if cancellation rules allow it.
- Calendar view loads appointments for the authenticated user only.

### 5. Email Confirmations

The system sends automated email confirmations to clients and professionals after a booking is created or cancelled.

#### User Stories

- As a client, I want to receive a confirmation email so that I have the appointment details saved.
- As a professional, I want to receive a booking notification so that I know when someone schedules with me.
- As a client, I want cancellation details by email so that I know when an appointment has changed.
- As a professional, I want emails to include appointment date, time, timezone, and client information so that I do not need to search for details manually.

#### Acceptance Criteria

- Confirmation email is sent to the client after successful booking.
- Notification email is sent to the professional after successful booking.
- Cancellation email is sent when an appointment is cancelled.
- Email includes appointment date, time, timezone, professional name, client name, and relevant notes.
- Email delivery failures are logged for debugging.

## Explicitly Out of Scope for v1

- Payment collection.
- SMS reminders.
- Native mobile apps.
- Multi-user teams or organization accounts.
- Round-robin scheduling.
- Two-way Google Calendar, Outlook, or Apple Calendar sync.
- Video conferencing link generation.
- Advanced analytics dashboards.
- Recurring appointments.
- Waitlists.
- Custom form builders.
- Client accounts.
- Marketplace discovery of professionals.

## Recommended Tech Stack

### Frontend

- **Framework:** Next.js with React and TypeScript.
- **Styling:** Tailwind CSS.
- **UI Components:** shadcn/ui.
- **Calendar UI:** FullCalendar or React Big Calendar.
- **Forms:** React Hook Form with Zod validation.

### Backend

- **Runtime:** Next.js API routes or Server Actions.
- **Language:** TypeScript.
- **Authentication:** Clerk or Auth.js.
- **Database ORM:** Prisma.
- **Database:** PostgreSQL.
- **Email Service:** Resend.
- **Background Jobs:** Vercel Cron Jobs or a lightweight queue such as Inngest if reminders and retry logic are added later.

### Infrastructure

- **Hosting:** Vercel.
- **Database Hosting:** Neon, Supabase Postgres, or Railway Postgres.
- **File Storage:** Not required for v1.
- **Analytics:** Vercel Web Analytics or PostHog.
- **Error Tracking:** Sentry.

### Testing

- **Unit and Integration Tests:** Vitest.
- **End-to-End Tests:** Playwright.
- **API Validation:** Zod schemas.

### Why This Stack

This stack is well suited for a fast, reliable scheduling SaaS because it keeps the frontend and backend in one TypeScript codebase, supports server-rendered public booking pages, integrates cleanly with transactional email, and can scale from a solo-founder MVP to a more mature SaaS product without a major rewrite.

## Data Model Overview

### User

- id
- name
- email
- businessName
- timezone
- bookingSlug
- defaultAppointmentDuration
- createdAt
- updatedAt

### AvailabilityRule

- id
- userId
- dayOfWeek
- startTime
- endTime
- isActive
- createdAt
- updatedAt

### AvailabilityBlock

- id
- userId
- startDateTime
- endDateTime
- reason
- createdAt
- updatedAt

### Appointment

- id
- userId
- clientName
- clientEmail
- notes
- startDateTime
- endDateTime
- timezone
- status
- createdAt
- updatedAt

### EmailLog

- id
- appointmentId
- recipientEmail
- emailType
- status
- providerMessageId
- errorMessage
- createdAt

## Key User Flows

### Professional Onboarding

1. User signs up.
2. User adds profile and business details.
3. User sets timezone and default appointment duration.
4. User configures weekly availability.
5. System generates a public booking link.

### Client Booking

1. Client opens professional's booking link.
2. Client selects an available date.
3. Client selects an available time slot.
4. Client enters name, email, and notes.
5. System validates availability.
6. System creates appointment.
7. System sends confirmation emails.

### Appointment Management

1. Professional logs in.
2. Professional opens calendar view.
3. Professional selects appointment.
4. Professional views appointment details.
5. Professional cancels appointment if needed.
6. System updates appointment status and sends cancellation email.

## Non-Functional Requirements

### Performance

- Public booking page should load in under 2 seconds on a standard broadband connection.
- Available slots should generate in under 500 milliseconds for a typical 30-day booking window.
- Calendar view should load appointments without noticeable delay for users with up to 500 appointments.

### Security

- All appointment management views require authentication.
- Public booking pages expose only intentional profile and availability information.
- Users can only access their own appointments and availability settings.
- Client email addresses and notes must not be publicly exposed.
- Input validation is required for all booking and profile forms.

### Reliability

- Appointment creation must use a database transaction or equivalent conflict-prevention mechanism.
- The system must prevent double booking when two clients select the same slot at the same time.
- Email failures should not delete or roll back a confirmed appointment, but they must be logged.

### Accessibility

- Booking flow must be usable by keyboard.
- Calendar and forms must have accessible labels.
- Color cannot be the only indicator of appointment status.
- UI should meet WCAG 2.1 AA contrast standards where practical.

### Responsiveness

- Client booking flow must work well on mobile and desktop.
- Professional dashboard should be optimized for desktop first, with responsive support for tablet and mobile.

## Definition of Done

The v1 product is considered done when:

- A user can sign up, log in, and manage their profile.
- A user can create weekly availability rules.
- A user can block specific unavailable dates or times.
- A public booking page is generated for each user.
- A client can book an available appointment from the public booking page.
- The system prevents overlapping or unavailable bookings.
- A professional can view appointments in a calendar view.
- A professional can view appointment details.
- A professional can cancel an appointment.
- Confirmation emails are sent after booking.
- Cancellation emails are sent after cancellation.
- Core flows are covered by automated tests.
- Basic error states and loading states are implemented.
- The app is deployed to a production environment.
- Production environment variables are configured securely.
- The product has been manually tested on desktop and mobile screen sizes.

## v1 Milestones

### Milestone 1: Foundation

- Set up Next.js project.
- Configure database and Prisma.
- Add authentication.
- Create base layout and dashboard shell.

### Milestone 2: Availability and Booking

- Build availability settings.
- Build public booking page.
- Implement slot generation.
- Add double-booking prevention.

### Milestone 3: Calendar and Appointment Management

- Build calendar dashboard.
- Add appointment detail view.
- Add appointment cancellation.
- Add appointment status handling.

### Milestone 4: Email and Production Readiness

- Integrate transactional email.
- Add email templates and logging.
- Add tests for core flows.
- Configure deployment, monitoring, and analytics.

## Risks and Mitigations

### Risk: Double Booking

Mitigation: Use database-level constraints, transactions, and server-side availability validation immediately before creating appointments.

### Risk: Timezone Confusion

Mitigation: Store appointment times in UTC, store user timezone separately, and clearly display timezone in booking and confirmation emails.

### Risk: Email Deliverability Issues

Mitigation: Use a reputable provider such as Resend, configure domain authentication, and log email delivery status.

### Risk: Calendar UI Complexity

Mitigation: Use a proven calendar library for v1 instead of building a calendar interface from scratch.

## Future Enhancements

- Google Calendar and Outlook sync.
- Payment collection through Stripe.
- SMS and email reminders.
- Video meeting link generation.
- Multiple appointment types.
- Team scheduling.
- Round-robin routing.
- Custom intake forms.
- Recurring appointments.
- Admin analytics.
- Client self-service rescheduling.

