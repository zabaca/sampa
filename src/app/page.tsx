import { Suspense } from "react";
import { SampaSchedule } from "@/components/SampaSchedule";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense>
        <SampaSchedule />
      </Suspense>
    </main>
  );
}
