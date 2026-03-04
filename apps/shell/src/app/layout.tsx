import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Daily Reflection - Mental Health Tracker",
  description: "Track your mood, urges, and build mental health resilience through daily reflection",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Reflection",
  },
  openGraph: {
    type: "website",
    title: "Daily Reflection",
    description: "Mental health reflection and mood tracking",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
