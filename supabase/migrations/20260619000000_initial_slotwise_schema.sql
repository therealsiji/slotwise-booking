create type public."AppointmentStatus" as enum ('ACTIVE', 'CANCELLED');
create type public."EmailType" as enum (
  'BOOKING_CONFIRMATION',
  'PROFESSIONAL_NOTIFICATION',
  'CANCELLATION'
);
create type public."EmailStatus" as enum ('SENT', 'FAILED', 'SKIPPED');

create table public."User" (
  id text primary key,
  "clerkUserId" text not null unique,
  name text not null,
  email text not null,
  "businessName" text,
  timezone text not null default 'Africa/Lagos',
  "bookingSlug" text not null unique,
  "defaultAppointmentDuration" integer not null default 30,
  "bufferMinutes" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public."AvailabilityRule" (
  id text primary key,
  "userId" text not null references public."User"(id) on delete cascade,
  "dayOfWeek" integer not null,
  "startTime" text not null,
  "endTime" text not null,
  "isActive" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public."AvailabilityBlock" (
  id text primary key,
  "userId" text not null references public."User"(id) on delete cascade,
  "startDateTime" timestamptz not null,
  "endDateTime" timestamptz not null,
  reason text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public."Appointment" (
  id text primary key,
  "userId" text not null references public."User"(id) on delete cascade,
  "clientName" text not null,
  "clientEmail" text not null,
  notes text,
  "startDateTime" timestamptz not null,
  "endDateTime" timestamptz not null,
  timezone text not null,
  status public."AppointmentStatus" not null default 'ACTIVE',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public."EmailLog" (
  id text primary key,
  "appointmentId" text not null references public."Appointment"(id) on delete cascade,
  "recipientEmail" text not null,
  "emailType" public."EmailType" not null,
  status public."EmailStatus" not null,
  "providerMessageId" text,
  "errorMessage" text,
  "createdAt" timestamptz not null default now()
);

create index "AvailabilityRule_userId_dayOfWeek_idx"
  on public."AvailabilityRule" ("userId", "dayOfWeek");

create index "AvailabilityBlock_userId_startDateTime_endDateTime_idx"
  on public."AvailabilityBlock" ("userId", "startDateTime", "endDateTime");

create index "Appointment_userId_startDateTime_endDateTime_idx"
  on public."Appointment" ("userId", "startDateTime", "endDateTime");

create index "Appointment_userId_status_idx"
  on public."Appointment" ("userId", status);

create index "EmailLog_appointmentId_idx"
  on public."EmailLog" ("appointmentId");

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create trigger set_user_updated_at
before update on public."User"
for each row execute function public.set_updated_at();

create trigger set_availability_rule_updated_at
before update on public."AvailabilityRule"
for each row execute function public.set_updated_at();

create trigger set_availability_block_updated_at
before update on public."AvailabilityBlock"
for each row execute function public.set_updated_at();

create trigger set_appointment_updated_at
before update on public."Appointment"
for each row execute function public.set_updated_at();

alter table public."User" enable row level security;
alter table public."AvailabilityRule" enable row level security;
alter table public."AvailabilityBlock" enable row level security;
alter table public."Appointment" enable row level security;
alter table public."EmailLog" enable row level security;

create policy "Public can read booking profiles"
on public."User"
for select
using (true);

create policy "Public can read active availability"
on public."AvailabilityRule"
for select
using (true);

create policy "Public can read availability blocks"
on public."AvailabilityBlock"
for select
using (true);

create policy "Public can create appointments"
on public."Appointment"
for insert
with check (true);
