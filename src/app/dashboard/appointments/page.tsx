import { AppointmentStatus } from "@prisma/client";
import { CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { demoAppointments } from "@/lib/demo-data";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import { cancelAppointment } from "@/server/actions";
import { getCurrentSlotWiseUser } from "@/server/user";

async function loadAppointmentsData() {
  if (!hasDatabaseConfig()) {
    return { appointments: demoAppointments, isDemo: true };
  }

  try {
    const user = await getCurrentSlotWiseUser();
    const appointments = await getDb().appointment.findMany({
      where: { userId: user.id },
      orderBy: { startDateTime: "asc" },
      take: 100,
    });
    return { appointments };
  } catch (error) {
    console.warn("Appointments data unavailable, using demo data.", error);
    return { appointments: demoAppointments, isDemo: true };
  }
}

export default async function AppointmentsPage() {
  const data = await loadAppointmentsData();

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-normal">Appointments</h1>
          {"isDemo" in data ? <Badge variant="secondary">Local demo data</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Review booking details and cancel appointments when needed.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming and recent bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {data.appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              New appointments will appear here after clients book through your
              public page.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{appointment.clientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.clientEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: appointment.timezone,
                      }).format(appointment.startDateTime)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status === AppointmentStatus.ACTIVE
                            ? "default"
                            : "secondary"
                        }
                      >
                        {appointment.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {appointment.status === AppointmentStatus.ACTIVE ? (
                        <form action={cancelAppointment}>
                          <input
                            type="hidden"
                            name="appointmentId"
                            value={appointment.id}
                          />
                          <Button type="submit" variant="outline" size="sm">
                            <CalendarX className="size-4" />
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span className="text-xs text-muted-foreground">Closed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
