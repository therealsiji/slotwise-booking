"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CalendarAppointment = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: "ACTIVE" | "CANCELLED";
};

export function AppointmentCalendar({
  appointments,
}: {
  appointments: CalendarAppointment[];
}) {
  const activeCount = appointments.filter((item) => item.status === "ACTIVE").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Schedule</CardTitle>
        <Badge variant="secondary">{activeCount} active</Badge>
      </CardHeader>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          nowIndicator
          events={appointments.map((appointment) => ({
            id: appointment.id,
            title: appointment.title,
            start: appointment.start,
            end: appointment.end,
            classNames:
              appointment.status === "CANCELLED" ? ["opacity-50"] : undefined,
          }))}
        />
      </CardContent>
    </Card>
  );
}
