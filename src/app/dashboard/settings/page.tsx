import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { demoUser } from "@/lib/demo-data";
import { hasDatabaseConfig } from "@/lib/env";
import { updateProfile } from "@/server/actions";
import { getCurrentSlotWiseUser } from "@/server/user";

async function loadSettingsData() {
  if (!hasDatabaseConfig()) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return {
      user: demoUser,
      bookingUrl: `${appUrl}/book/${demoUser.bookingSlug}`,
      isDemo: true,
    };
  }

  try {
    const user = await getCurrentSlotWiseUser();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const bookingUrl = `${appUrl}/book/${user.bookingSlug}`;
    return { user, bookingUrl };
  } catch (error) {
    console.warn("Settings data unavailable, using demo data.", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return {
      user: demoUser,
      bookingUrl: `${appUrl}/book/${demoUser.bookingSlug}`,
      isDemo: true,
    };
  }
}

export default async function SettingsPage() {
  const data = await loadSettingsData();

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
          {"isDemo" in data ? <Badge variant="secondary">Local demo data</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Keep your public booking profile and appointment defaults up to date.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={data.user.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  defaultValue={data.user.businessName || ""}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Notification email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={data.user.email}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  defaultValue={data.user.timezone}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="bookingSlug">Booking slug</Label>
                <Input
                  id="bookingSlug"
                  name="bookingSlug"
                  defaultValue={data.user.bookingSlug}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="defaultAppointmentDuration">Duration</Label>
                <Input
                  id="defaultAppointmentDuration"
                  name="defaultAppointmentDuration"
                  type="number"
                  min="15"
                  step="15"
                  defaultValue={data.user.defaultAppointmentDuration}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bufferMinutes">Buffer minutes</Label>
                <Input
                  id="bufferMinutes"
                  name="bufferMinutes"
                  type="number"
                  min="0"
                  step="5"
                  defaultValue={data.user.bufferMinutes}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-fit">
              Save profile
            </Button>
          </form>
          <Separator className="my-6" />
          <div className="grid gap-3">
            <Label>Public booking link</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={data.bookingUrl} readOnly />
              <Button type="button" variant="outline">
                <Copy className="size-4" />
                Copy
              </Button>
              <Link
                href={`/book/${data.user.bookingSlug}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <ExternalLink className="size-4" />
                Open
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
