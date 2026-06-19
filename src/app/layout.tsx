import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { hasClerkConfig } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full`}
      >
        <body className="flex min-h-full flex-col antialiased">{children}</body>
      </html>
  );

  if (!hasClerkConfig()) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
