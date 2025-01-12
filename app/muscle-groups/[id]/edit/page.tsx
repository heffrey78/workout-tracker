"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MuscleGroupForm } from "@/components/muscle-groups/MuscleGroupForm";
import type { MuscleGroup } from "@/types/models";

export default function EditMuscleGroupPage() {
  const params = useParams();
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMuscleGroup = async () => {
      try {
        const response = await fetch(`/api/muscle-groups?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch muscle group");
        }
        const data = await response.json();
        setMuscleGroup(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMuscleGroup();
    }
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!muscleGroup) {
    return <div>Muscle group not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Muscle Group</h1>
      <MuscleGroupForm
        mode="edit"
        initialData={{
          id: muscleGroup.id,
          name: muscleGroup.name,
          description: muscleGroup.description,
          body: muscleGroup.body,
        }}
      />
    </div>
  );
}
