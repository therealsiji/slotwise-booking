import { Trash2 } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwitchLikeCheckbox } from "@/components/dashboard/switch-like-checkbox";
import { Badge } from "@/components/ui/badge";
import { demoAvailabilityBlocks, demoAvailabilityRules } from "@/lib/demo-data";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import {
  createAvailabilityBlock,
  deleteAvailabilityBlock,
  updateAvailabilityRules,
} from "@/server/actions";
import { getCurrentSlotWiseUser } from "@/server/user";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type AvailabilityRuleRow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type AvailabilityBlockRow = {
  id: string;
  startDateTime: Date;
  endDateTime: Date;
  reason: string | null;
};

type AvailabilityData = {
  rules: AvailabilityRuleRow[];
  blocks: AvailabilityBlockRow[];
  isDemo?: true;
};

async function loadAvailabilityData(): Promise<AvailabilityData> {
  if (!hasDatabaseConfig()) {
    return {
      rules: demoAvailabilityRules,
      blocks: demoAvailabilityBlocks,
      isDemo: true,
    };
  }

  try {
    const user = await getCurrentSlotWiseUser();
    const [rules, blocks] = await Promise.all([
      getDb().availabilityRule.findMany({
        where: { userId: user.id },
        orderBy: { dayOfWeek: "asc" },
      }),
      getDb().availabilityBlock.findMany({
        where: { userId: user.id },
        orderBy: { startDateTime: "asc" },
      }),
    ]);
    return { rules, blocks };
  } catch (error) {
    unstable_rethrow(error);
    console.warn("Availability data unavailable, using demo data.", error);
    return {
      rules: demoAvailabilityRules,
      blocks: demoAvailabilityBlocks,
      isDemo: true,
    };
  }
}

export default async function AvailabilityPage() {
  const data = await loadAvailabilityData();

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-normal">Availability</h1>
          {"isDemo" in data ? <Badge variant="secondary">Local demo data</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Define weekly booking windows and one-off blocked times.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAvailabilityRules} className="grid gap-3">
            {days.map((day, dayOfWeek) => {
              const rule = data.rules.find(
                (item: AvailabilityRuleRow) => item.dayOfWeek === dayOfWeek,
              );
              const enabled = rule?.isActive ?? (dayOfWeek > 0 && dayOfWeek < 6);

              return (
                <div
                  key={day}
                  className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[150px_1fr_1fr] sm:items-center"
                >
                  <SwitchLikeCheckbox
                    name={`day-${dayOfWeek}-active`}
                    label={day}
                    defaultChecked={enabled}
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`day-${dayOfWeek}-start`}>Start</Label>
                    <Input
                      id={`day-${dayOfWeek}-start`}
                      name={`day-${dayOfWeek}-start`}
                      type="time"
                      defaultValue={rule?.startTime || "09:00"}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor={`day-${dayOfWeek}-end`}>End</Label>
                    <Input
                      id={`day-${dayOfWeek}-end`}
                      name={`day-${dayOfWeek}-end`}
                      type="time"
                      defaultValue={rule?.endTime || "17:00"}
                    />
                  </div>
                </div>
              );
            })}
            <Button type="submit" className="w-fit">
              Save weekly hours
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocked times</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <form action={createAvailabilityBlock} className="grid gap-3 md:grid-cols-4">
            <div className="grid gap-1">
              <Label htmlFor="startDateTime">Start</Label>
              <Input id="startDateTime" name="startDateTime" type="datetime-local" required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="endDateTime">End</Label>
              <Input id="endDateTime" name="endDateTime" type="datetime-local" required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" name="reason" placeholder="Travel, holiday, focus time" />
            </div>
            <Button type="submit" className="self-end">
              Add block
            </Button>
          </form>
          <div className="grid gap-2">
            {data.blocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blocked times yet.</p>
            ) : (
              data.blocks.map((block: AvailabilityBlockRow) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <span>
                    {block.startDateTime.toLocaleString()} -{" "}
                    {block.endDateTime.toLocaleString()}
                    {block.reason ? `, ${block.reason}` : ""}
                  </span>
                  <form action={deleteAvailabilityBlock}>
                    <input type="hidden" name="blockId" value={block.id} />
                    <Button type="submit" variant="ghost" size="icon" aria-label="Delete block">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
