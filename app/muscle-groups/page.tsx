import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { MuscleGroupList } from "@/components/muscle-groups/MuscleGroupList/index.";
import { Button } from "@/components/ui/button";
import { muscleGroupService } from "@/lib/services/muscle-group.service";

export default async function MuscleGroupsPage() {
  const muscleGroups = await muscleGroupService.findAll();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Muscle Groups</h1>
        <Link href="/muscle-groups/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Muscle Group
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <MuscleGroupList muscleGroups={muscleGroups} />
      </Suspense>
    </div>
  );
}
