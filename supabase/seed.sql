insert into public."User" (
  id,
  "clerkUserId",
  name,
  email,
  "businessName",
  timezone,
  "bookingSlug",
  "defaultAppointmentDuration",
  "bufferMinutes"
) values (
  'demo-user',
  'demo-clerk-user',
  'Siji Olaifa',
  'siji@example.com',
  'SlotWise Studio',
  'Africa/Lagos',
  'slotwise-demo',
  30,
  10
) on conflict (id) do nothing;

insert into public."AvailabilityRule" (
  id,
  "userId",
  "dayOfWeek",
  "startTime",
  "endTime",
  "isActive"
) values
  ('demo-rule-sun', 'demo-user', 0, '09:00', '17:00', false),
  ('demo-rule-mon', 'demo-user', 1, '09:00', '17:00', true),
  ('demo-rule-tue', 'demo-user', 2, '09:00', '17:00', true),
  ('demo-rule-wed', 'demo-user', 3, '10:00', '16:00', true),
  ('demo-rule-thu', 'demo-user', 4, '09:00', '17:00', true),
  ('demo-rule-fri', 'demo-user', 5, '09:00', '14:00', true),
  ('demo-rule-sat', 'demo-user', 6, '09:00', '17:00', false)
on conflict (id) do nothing;

insert into public."Appointment" (
  id,
  "userId",
  "clientName",
  "clientEmail",
  notes,
  "startDateTime",
  "endDateTime",
  timezone,
  status
) values
  (
    'demo-appointment-1',
    'demo-user',
    'Ada Johnson',
    'ada@example.com',
    'Discovery call for a consulting project.',
    now() + interval '1 day 2 hours',
    now() + interval '1 day 2 hours 30 minutes',
    'Africa/Lagos',
    'ACTIVE'
  ),
  (
    'demo-appointment-2',
    'demo-user',
    'Michael Chen',
    'michael@example.com',
    'Portfolio review session.',
    now() + interval '2 days 4 hours',
    now() + interval '2 days 4 hours 30 minutes',
    'Africa/Lagos',
    'ACTIVE'
  )
on conflict (id) do nothing;
