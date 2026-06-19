import { CalendarDays, Clock, Link2 } from "lucide-react";
import { AppointmentCalendar } from "@/components/calendar/appointment-calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAppointments, demoUser } from "@/lib/demo-data";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import { type AppointmentStatusValue } from "@/lib/constants";
import { getCurrentSlotWiseUser } from "@/server/user";

type DashboardUser = {
  businessName: string | null;
  name: string;
  timezone: string;
  bookingSlug: string;
};

type DashboardAppointment = {
  id: string;
  clientName: string;
  startDateTime: Date;
  endDateTime: Date;
  status: AppointmentStatusValue;
};

type DashboardData = {
  user: DashboardUser;
  appointments: DashboardAppointment[];
  isDemo?: true;
};

async function loadDashboardData(): Promise<DashboardData> {
  if (!hasDatabaseConfig()) {
    return { user: demoUser, appointments: demoAppointments, isDemo: true };
  }

  try {
    const user = await getCurrentSlotWiseUser();
    const appointments = await getDb().appointment.findMany({
      where: { userId: user.id },
      orderBy: { startDateTime: "asc" },
      take: 100,
    });
    return { user, appointments };
  } catch (error) {
    console.warn("Dashboard data unavailable, using demo data.", error);
    return { user: demoUser, appointments: demoAppointments, isDemo: true };
  }
}

export default async function DashboardPage() {
  const data = await loadDashboardData();

  const activeAppointments = data.appointments.filter(
    (appointment: DashboardAppointment) => appointment.status === "ACTIVE",
  );

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-normal">
            {data.user.businessName || data.user.name}
          </h1>
          {"isDemo" in data ? <Badge variant="secondary">Local demo data</Badge> : null}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active bookings</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {activeAppointments.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Timezone</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{data.user.timezone}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Booking link</CardTitle>
            <Link2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="truncate text-sm">
            /book/{data.user.bookingSlug}
          </CardContent>
        </Card>
      </div>
      <AppointmentCalendar
        appointments={data.appointments.map((appointment: DashboardAppointment) => ({
          id: appointment.id,
          title: appointment.clientName,
          start: appointment.startDateTime.toISOString(),
          end: appointment.endDateTime.toISOString(),
          status: appointment.status,
        }))}
      />
    </div>
  );
}
