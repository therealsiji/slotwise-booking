import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { hasClerkConfig } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: "SlotWise | Appointment scheduling",
  description:
    "Calendar scheduling, availability management, and email confirmations for independent professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );

  if (!hasClerkConfig()) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
