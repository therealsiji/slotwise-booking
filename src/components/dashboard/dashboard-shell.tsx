import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CalendarDays, Clock, Link2, Settings } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { hasClerkConfig } from "@/lib/env";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/availability", label: "Availability", icon: Clock },
  { href: "/dashboard/appointments", label: "Appointments", icon: Link2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const showClerkUser = hasClerkConfig();

  return (
    <div className="min-h-screen bg-muted/35">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              S
            </span>
            SlotWise
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings"
              className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}
            >
              Booking link
            </Link>
            {showClerkUser ? (
              <UserButton />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                S
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-lg border bg-background p-2">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Separator className="my-2" />
          <p className="px-3 py-2 text-xs leading-5 text-muted-foreground">
            Manage your booking page, working hours, and upcoming appointments.
          </p>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
