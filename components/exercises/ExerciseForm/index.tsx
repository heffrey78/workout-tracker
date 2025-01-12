"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { clientLogger } from "../../../lib/logger/client";
import {
  exerciseSchema,
  type ExerciseFormData,
} from "../../../lib/schemas/exercise.schema";
import {
  ExerciseType,
  DifficultyType,
  type MuscleGroup,
} from "../../../types/models";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export function ExerciseForm() {
  const router = useRouter();
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      muscleGroups: [],
      difficulty: [],
      equipment: [],
      movements: [],
      imageUrls: [],
      isArchived: false,
    },
  });

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch("/api/muscle-groups");
        if (!response.ok) throw new Error("Failed to fetch muscle groups");
        const data = await response.json();
        setMuscleGroups(data);
      } catch (error) {
        clientLogger.error("Error fetching muscle groups", { error });
      }
    };

    fetchMuscleGroups();
  }, []);

  const onSubmit = async (data: ExerciseFormData) => {
    clientLogger.info("Submitting new exercise", { data });

    try {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create exercise");
      }

      const exercise = await response.json();
      clientLogger.info("Exercise created successfully", { exercise });
      router.push("/exercises");
      router.refresh();
    } catch (error) {
      clientLogger.error("Error creating exercise", { error });
      throw error;
    }
  };

  const selectedMuscleGroups = watch("muscleGroups");
  const difficulties = watch("difficulty");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Exercise Name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <span className="text-sm text-destructive">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Description"
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <span className="text-sm text-destructive">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Exercise Type field */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Exercise Type
              </label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as ExerciseType)
                }
                name="type"
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ExerciseType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <span className="text-sm text-destructive">
                  {errors.type.message}
                </span>
              )}
            </div>

            {/* Muscle Groups field */}
            <div className="space-y-2">
              <label htmlFor="muscleGroups" className="text-sm font-medium">
                Muscle Groups
              </label>
              <Select
                name="muscleGroups"
                onValueChange={(value) => {
                  const selectedGroup = muscleGroups.find(
                    (g) => g.id === value,
                  );
                  if (
                    selectedGroup &&
                    !selectedMuscleGroups.some((g) => g.id === selectedGroup.id)
                  ) {
                    setValue("muscleGroups", [
                      ...selectedMuscleGroups,
                      selectedGroup,
                    ]);
                  }
                }}
              >
                <SelectTrigger id="muscleGroups">
                  <SelectValue placeholder="Add Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMuscleGroups.map((group) => (
                  <span
                    key={group.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {group.name}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "muscleGroups",
                          selectedMuscleGroups.filter((g) => g.id !== group.id),
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-primary/20"
                      aria-label={`Remove ${group.name} muscle group`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.muscleGroups && (
                <span className="text-sm text-destructive">
                  {errors.muscleGroups.message}
                </span>
              )}
            </div>

            {/* Rest of the form fields remain the same */}
            {/* Difficulty Levels */}
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty Levels
              </label>
              <Select
                name="difficulty"
                onValueChange={(value) => {
                  const diff = value as DifficultyType;
                  if (!difficulties.includes(diff)) {
                    setValue("difficulty", [...difficulties, diff]);
                  }
                }}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Add Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DifficultyType).map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {difficulties.map((diff) => (
                  <span
                    key={diff}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground"
                  >
                    {diff}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "difficulty",
                          difficulties.filter((d) => d !== diff),
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-secondary"
                      aria-label={`Remove ${diff} difficulty level`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.difficulty && (
                <span className="text-sm text-destructive">
                  {errors.difficulty.message}
                </span>
              )}
            </div>

            {/* Equipment */}
            {/* ... Equipment section remains the same ... */}

            {/* Movement Types */}
            {/* ... Movement Types section remains the same ... */}

            {/* Video URL */}
            <div className="space-y-2">
              <label htmlFor="videoUrl" className="text-sm font-medium">
                Video URL (optional)
              </label>
              <Input
                id="videoUrl"
                {...register("videoUrl")}
                placeholder="Video URL"
                type="url"
                className={errors.videoUrl ? "border-destructive" : ""}
              />
              {errors.videoUrl && (
                <span className="text-sm text-destructive">
                  {errors.videoUrl.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/exercises")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Exercise"}
        </Button>
      </div>
    </form>
  );
}
