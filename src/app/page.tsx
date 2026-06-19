import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MailCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const highlights = [
  {
    title: "Calendar view",
    description: "See your week, day, and month at a glance.",
    icon: CalendarDays,
  },
  {
    title: "Availability rules",
    description: "Publish only the working windows clients can book.",
    icon: Clock,
  },
  {
    title: "Email confirmations",
    description: "Send booking and cancellation details automatically.",
    icon: MailCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto grid min-h-screen max-w-7xl content-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_520px] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            SlotWise appointment scheduling
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
            A calmer way to manage client bookings.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            SlotWise gives professionals and freelancers a booking page,
            availability controls, a calendar dashboard, and confirmation emails
            without enterprise scheduling clutter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
              Open dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
