"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { clientLogger } from "../../../lib/logger/client";
import {
  exerciseSchema,
  type ExerciseFormData,
} from "../../../lib/schemas/exercise.schema";
import {
  ExerciseType,
  DifficultyType,
  MuscleGroup,
  Equipment,
  MovementType,
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

  const muscleGroups = watch("muscleGroups");
  const difficulties = watch("difficulty");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
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

            <div className="space-y-2">
              <label htmlFor="muscleGroups" className="text-sm font-medium">
                Muscle Groups
              </label>
              <Select
                name="muscleGroups"
                onValueChange={(value) => {
                  const group = value as MuscleGroup;
                  if (!muscleGroups.includes(group)) {
                    setValue("muscleGroups", [...muscleGroups, group]);
                  }
                }}
              >
                <SelectTrigger id="muscleGroups">
                  <SelectValue placeholder="Add Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MuscleGroup).map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {muscleGroups.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {group}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "muscleGroups",
                          muscleGroups.filter((g) => g !== group),
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-primary/20"
                      aria-label={`Remove ${group} muscle group`}
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

            <div className="space-y-2">
              <label htmlFor="equipment" className="text-sm font-medium">
                Equipment
              </label>
              <Select
                name="equipment"
                onValueChange={(value) => {
                  const equip = value as Equipment;
                  const currentEquipment = watch("equipment");
                  if (!currentEquipment.includes(equip)) {
                    setValue("equipment", [...currentEquipment, equip]);
                  }
                }}
              >
                <SelectTrigger id="equipment">
                  <SelectValue placeholder="Add Equipment" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Equipment).map((equip) => (
                    <SelectItem key={equip} value={equip}>
                      {equip}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {watch("equipment").map((equip) => (
                  <span
                    key={equip}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {equip}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "equipment",
                          watch("equipment").filter((e) => e !== equip),
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-muted/80"
                      aria-label={`Remove ${equip} equipment`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="movements" className="text-sm font-medium">
                Movement Types
              </label>
              <Select
                name="movements"
                onValueChange={(value) => {
                  const movement = value as MovementType;
                  const currentMovements = watch("movements");
                  if (!currentMovements.includes(movement)) {
                    setValue("movements", [...currentMovements, movement]);
                  }
                }}
              >
                <SelectTrigger id="movements">
                  <SelectValue placeholder="Add Movement Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MovementType).map((movement) => (
                    <SelectItem key={movement} value={movement}>
                      {movement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {watch("movements").map((movement) => (
                  <span
                    key={movement}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {movement}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "movements",
                          watch("movements").filter((m) => m !== movement),
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-muted/80"
                      aria-label={`Remove ${movement} movement type`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

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
