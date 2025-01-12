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

  async findById(id: string): Promise<MuscleGroup | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      logger.error("Failed to find muscle group", { id, error });
      throw new Error("Failed to find muscle group");
    }
  }

  async delete(id: string): Promise<void> {
    logger.info("Deleting muscle group", { id });
    try {
      await this.repository.delete(id);
    } catch (error) {
      logger.error("Failed to delete muscle group", { id, error });
      throw new Error("Failed to delete muscle group");
    }
  }

  async update(
    id: string,
    formData: MuscleGroupFormData,
  ): Promise<MuscleGroup> {
    logger.info("Updating muscle group", { id, formData });

    try {
      const muscleGroup = await this.repository.update(id, {
        name: formData.name,
        description: formData.description,
        body: formData.body,
      });
      return muscleGroup;
    } catch (error) {
      logger.error("Failed to update muscle group", { id, error });
      throw new Error("Failed to update muscle group");
    }
  }
}

export const muscleGroupService = new MuscleGroupService();
