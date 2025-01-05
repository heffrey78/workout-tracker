import type { PrismaClient, Prisma } from "@prisma/client";

import type { MuscleGroup, Body } from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface MuscleGroupSearchParams {
  name?: string;
  body?: Body;
}

type PrismaMuscleGroup = Prisma.MuscleGroupGetPayload<{
  include: {
    exercises: true;
  };
}>;

export class MuscleGroupRepository extends BaseRepository<MuscleGroup> {
  constructor(prisma: PrismaClient) {
    super(prisma, "MuscleGroup");
  }

  async findById(id: string): Promise<MuscleGroup> {
    try {
      this.validateId(id);
      this.logOperation("findById", { id });

      const muscleGroup = await this.prisma.muscleGroup.findUnique({
        where: { id },
        include: this.getIncludeOptions(),
      });

      if (!muscleGroup) {
        throw new RepositoryError(
          "Muscle group not found",
          "MUSCLE_GROUP_NOT_FOUND",
          {
            id,
          },
        );
      }

      return this.mapToMuscleGroup(muscleGroup);
    } catch (error) {
      this.handleError(error, "findById", { id });
    }
  }

  async findAll(params?: MuscleGroupSearchParams): Promise<MuscleGroup[]> {
    try {
      this.logOperation("findAll", params);

      const muscleGroups = await this.prisma.muscleGroup.findMany({
        where: this.buildSearchQuery(params),
        include: this.getIncludeOptions(),
        orderBy: { name: "asc" },
      });

      return muscleGroups.map((mg) => this.mapToMuscleGroup(mg));
    } catch (error) {
      this.handleError(error, "findAll", params);
    }
  }

  async create(
    muscleGroup: Omit<MuscleGroup, "id" | "createdAt" | "updatedAt">,
  ): Promise<MuscleGroup> {
    try {
      this.logOperation("create", muscleGroup);

      const created = await this.prisma.muscleGroup.create({
        data: {
          name: muscleGroup.name,
          description: muscleGroup.description,
          body: muscleGroup.body,
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToMuscleGroup(created);
    } catch (error) {
      this.handleError(error, "create", muscleGroup);
    }
  }

  async update(
    id: string,
    muscleGroup: Partial<MuscleGroup>,
  ): Promise<MuscleGroup> {
    try {
      this.validateId(id);
      this.logOperation("update", { id, muscleGroup });

      const updateData: Prisma.MuscleGroupUpdateInput = {};

      if (muscleGroup.name !== undefined) updateData.name = muscleGroup.name;
      if (muscleGroup.description !== undefined)
        updateData.description = muscleGroup.description;
      if (muscleGroup.body !== undefined) updateData.body = muscleGroup.body;

      const updated = await this.prisma.muscleGroup.update({
        where: { id },
        data: updateData,
        include: this.getIncludeOptions(),
      });

      return this.mapToMuscleGroup(updated);
    } catch (error) {
      this.handleError(error, "update", { id, muscleGroup });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.validateId(id);
      this.logOperation("delete", { id });

      await this.prisma.muscleGroup.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, "delete", { id });
    }
  }

  private buildSearchQuery(
    params?: MuscleGroupSearchParams,
  ): Prisma.MuscleGroupWhereInput {
    if (!params) return {};

    const query: Prisma.MuscleGroupWhereInput = {};

    if (params.name) {
      query.name = { contains: params.name, mode: "insensitive" };
    }

    if (params.body) {
      query.body = params.body;
    }

    return query;
  }

  private getIncludeOptions() {
    return {
      exercises: true,
    } as const;
  }

  private mapToMuscleGroup = (data: PrismaMuscleGroup): MuscleGroup => {
    if (!data) throw new Error("Cannot map null muscle group");

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      body: data.body as Body,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  };
}
