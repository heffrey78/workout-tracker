import { z } from "zod";

import { Body } from "../../types/models";

export const muscleGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  body: z.nativeEnum(Body),
});

export type MuscleGroupFormData = z.infer<typeof muscleGroupSchema>;
