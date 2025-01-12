import { z } from "zod";

export const equipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;
