import prisma from "@/lib/prisma";
import { MuscleGroupRepository } from "@/lib/repositories/muscle-group.repository";
import type { MuscleGroup } from "@/types/models";

import logger from "../logger";
import type { MuscleGroupFormData } from "../schemas/muscle-group.schema";

export class MuscleGroupService {
  private repository: MuscleGroupRepository;

  constructor() {
    this.repository = new MuscleGroupRepository(prisma);
  }

  async create(formData: MuscleGroupFormData): Promise<MuscleGroup> {
    logger.info("Creating muscle group", { formData });

    try {
      const muscleGroup = await this.repository.create({
        name: formData.name,
        description: formData.description,
        body: formData.body,
      });
      return muscleGroup;
    } catch (error) {
      throw new Error("Failed to create muscle group");
    }
  }

  async findAll(): Promise<MuscleGroup[]> {
    return this.repository.findAll();
  }
}

export const muscleGroupService = new MuscleGroupService();
