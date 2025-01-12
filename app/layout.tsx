import type { Metadata } from "next";
import { Inter } from "next/font/google";

import {
  NavigationRoot,
  NavigationBrand,
  NavigationItem,
} from "../components/ui/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Track your workouts and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <NavigationRoot>
            <NavigationBrand>Workout Tracker</NavigationBrand>
            <div className="flex space-x-4 ml-8">
              <NavigationItem href="/">Home</NavigationItem>
              <NavigationItem href="/exercises">Exercises</NavigationItem>
              <NavigationItem href="/workouts">Workouts</NavigationItem>
              <NavigationItem href="/muscle-groups">
                Muscle Groups
              </NavigationItem>
            </div>
          </NavigationRoot>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
