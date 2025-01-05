import { z } from "zod";

import {
  ExerciseType,
  DifficultyType,
  MuscleGroup,
  Equipment,
  MovementType,
} from "../../types/models";

export const exerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(ExerciseType),
  muscleGroups: z
    .array(z.nativeEnum(MuscleGroup))
    .min(1, "Select at least one muscle group"),
  difficulty: z
    .array(z.nativeEnum(DifficultyType))
    .min(1, "Select at least one difficulty level"),
  equipment: z.array(z.nativeEnum(Equipment)).default([]),
  movements: z.array(z.nativeEnum(MovementType)).default([]),
  videoUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).default([]),
  isArchived: z.boolean().default(false),
});

export type ExerciseFormData = z.infer<typeof exerciseSchema>;
