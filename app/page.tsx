import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Workout Tracker",
  description: "Track your workouts and monitor your progress",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Workout Tracker</h1>
      <p className="text-xl text-center max-w-2xl mb-8">
        Track your workouts, monitor your progress, and achieve your fitness
        goals.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Feature cards will go here */}
      </div>
    </main>
  );
}
