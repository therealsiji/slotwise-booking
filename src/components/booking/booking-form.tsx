"use client";

import { useState } from "react";
import { CalendarCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAppointment } from "@/server/actions";

type Slot = {
  start: string;
  end: string;
  label: string;
};

export function BookingForm({
  userId,
  timezone,
  slots,
}: {
  userId: string;
  timezone: string;
  slots: Slot[];
}) {
  const [selectedSlot, setSelectedSlot] = useState(slots[0]?.start || "");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Available times
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No appointment times are currently available. Please check back later.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {slots.slice(0, 24).map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setSelectedSlot(slot.start)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition hover:bg-muted ${
                    selectedSlot === slot.start
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="size-5" />
            Your details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAppointment} className="grid gap-4">
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="startDateTime" value={selectedSlot} />
            <div className="grid gap-2">
              <Label htmlFor="clientName">Name</Label>
              <Input id="clientName" name="clientName" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" name="clientEmail" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Anything helpful before the appointment?"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Times are shown in {timezone}. You will receive a confirmation email
              after booking.
            </p>
            <Button type="submit" disabled={!selectedSlot}>
              Confirm appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
