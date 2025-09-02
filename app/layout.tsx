import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlxPolly - Create and Vote on Polls",
  description:
    "A modern polling application for creating, sharing, and voting on polls. Join the community and make your voice heard!",
  keywords: ["polls", "voting", "surveys", "community", "feedback"],
  authors: [{ name: "AlxPolly Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
