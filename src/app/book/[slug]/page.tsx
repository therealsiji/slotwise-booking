import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { BookingForm } from "@/components/booking/booking-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import { getPublicSlots } from "@/server/actions";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ booked?: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicBookingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { booked } = await searchParams;
  const professional = await getDb().user.findUnique({
    where: { bookingSlug: slug },
  });

  if (!professional) {
    notFound();
  }

  const slots = await getPublicSlots(professional.id);
  const slotViewModels = slots.map((slot) => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString(),
    label: new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: professional.timezone,
    }).format(slot.start),
  }));

  return (
    <main className="min-h-screen bg-muted/35 px-4 py-8 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="secondary" className="mb-3">
                {professional.timezone}
              </Badge>
              <h1 className="text-3xl font-semibold tracking-normal">
                Book with {professional.businessName || professional.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a time, add your details, and SlotWise will send the
                confirmation.
              </p>
            </div>
            <div className="rounded-lg border bg-background px-4 py-3 text-sm">
              <div className="font-medium">{professional.defaultAppointmentDuration} min</div>
              <div className="text-muted-foreground">Appointment duration</div>
            </div>
          </CardContent>
        </Card>
        {booked ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
            <CheckCircle2 className="size-4" />
            <AlertTitle>Appointment confirmed</AlertTitle>
            <AlertDescription>
              Confirmation emails are being sent to you and the professional.
            </AlertDescription>
          </Alert>
        ) : null}
        <BookingForm
          userId={professional.id}
          timezone={professional.timezone}
          slots={slotViewModels}
        />
      </div>
    </main>
  );
}
