import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SetupWarning({ message }: { message?: string }) {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-950">
      <AlertTitle>Connect your database to load live scheduling data</AlertTitle>
      <AlertDescription>
        {message ||
          "Copy .env.example to .env, set DATABASE_URL and Clerk keys, then run Prisma migrations."}
      </AlertDescription>
    </Alert>
  );
}
