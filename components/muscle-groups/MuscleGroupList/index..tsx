import { Card } from "@/components/ui/card";
import type { MuscleGroup } from "@/types/models";

export function MuscleGroupList({
  muscleGroups,
}: {
  muscleGroups: MuscleGroup[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {muscleGroups.map((muscleGroup) => (
        <Card key={muscleGroup.id} className="p-4">
          <h3 className="font-semibold">{muscleGroup.name}</h3>
          <p className="text-sm text-gray-500">{muscleGroup.body}</p>
          {muscleGroup.description && (
            <p className="mt-2 text-sm">{muscleGroup.description}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
