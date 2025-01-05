import type { PrismaClient, Prisma } from "@prisma/client";

import type {
  Exercise,
  ExerciseType,
  Equipment,
  MuscleGroup,
  DifficultyType,
  MovementType,
  Body,
} from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface ExerciseSearchParams {
  name?: string;
  type?: ExerciseType;
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  difficulty?: DifficultyType[];
  isArchived?: boolean;
}

type ExerciseCreateData = Omit<Exercise, "id" | "createdAt" | "updatedAt">;

type PrismaExercise = Prisma.ExerciseGetPayload<{
  include: {
    muscleGroups: true;
    equipment: true;
    workoutExercises: {
      include: {
        sets: true;
      };
    };
    personalRecords: true;
  };
}>;

export class ExerciseRepository extends BaseRepository<Exercise> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Exercise");
  }

  async findById(id: string): Promise<Exercise> {
    try {
      this.validateId(id);
      this.logOperation("findById", { id });

      const exercise = await this.prisma.exercise.findUnique({
        where: { id },
        include: this.getIncludeOptions(),
      });

      if (!exercise) {
        throw new RepositoryError("Exercise not found", "EXERCISE_NOT_FOUND", {
          id,
        });
      }

      return this.mapToExercise(exercise);
    } catch (error) {
      this.handleError(error, "findById", { id });
    }
  }

  async findAll(params?: ExerciseSearchParams): Promise<Exercise[]> {
    try {
      this.logOperation("findAll", params);

      const exercises = await this.prisma.exercise.findMany({
        where: this.buildSearchQuery(params),
        include: this.getIncludeOptions(),
        orderBy: { updatedAt: "desc" },
      });

      return exercises.map((exercise) => this.mapToExercise(exercise));
    } catch (error) {
      this.handleError(error, "findAll", params);
    }
  }

  async create(exercise: ExerciseCreateData): Promise<Exercise> {
    try {
      this.logOperation("create", exercise);

      const created = await this.prisma.exercise.create({
        data: {
          name: exercise.name,
          description: exercise.description || null,
          type: exercise.type,
          isArchived: exercise.isArchived,
          lastUsedAt: exercise.lastUsedAt || null,
          videoUrl: exercise.videoUrl || null,
          imageUrls: (exercise.imageUrls || []) as Prisma.InputJsonValue,
          difficulty: exercise.difficulty as Prisma.InputJsonValue,
          movements: exercise.movements as Prisma.InputJsonValue,
          muscleGroups: {
            connect: exercise.muscleGroups?.map((mg) => ({ id: mg.id })) || [],
          },
          equipment: {
            connect: exercise.equipment?.map((eq) => ({ id: eq.id })) || [],
          },
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToExercise(created);
    } catch (error) {
      this.handleError(error, "create", exercise);
    }
  }

  async update(id: string, exercise: Partial<Exercise>): Promise<Exercise> {
    try {
      this.validateId(id);
      this.logOperation("update", { id, exercise });

      const data: Prisma.ExerciseUpdateInput = {};

      if (exercise.name !== undefined) data.name = exercise.name;
      if (exercise.description !== undefined)
        data.description = exercise.description || null;
      if (exercise.type !== undefined) data.type = exercise.type;
      if (exercise.isArchived !== undefined)
        data.isArchived = exercise.isArchived;
      if (exercise.lastUsedAt !== undefined)
        data.lastUsedAt = exercise.lastUsedAt || null;
      if (exercise.videoUrl !== undefined)
        data.videoUrl = exercise.videoUrl || null;
      if (exercise.imageUrls !== undefined) {
        data.imageUrls = (exercise.imageUrls || []) as Prisma.InputJsonValue;
      }
      if (exercise.difficulty !== undefined) {
        data.difficulty = exercise.difficulty as Prisma.InputJsonValue;
      }
      if (exercise.movements !== undefined) {
        data.movements = exercise.movements as Prisma.InputJsonValue;
      }
      if (exercise.muscleGroups !== undefined) {
        data.muscleGroups = {
          set: [],
          connect: exercise.muscleGroups.map((mg) => ({ id: mg.id })),
        };
      }
      if (exercise.equipment !== undefined) {
        data.equipment = {
          set: [],
          connect: exercise.equipment.map((eq) => ({ id: eq.id })),
        };
      }

      const updated = await this.prisma.exercise.update({
        where: { id },
        data,
        include: this.getIncludeOptions(),
      });

      return this.mapToExercise(updated);
    } catch (error) {
      this.handleError(error, "update", { id, exercise });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.validateId(id);
      this.logOperation("delete", { id });

      await this.prisma.exercise.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, "delete", { id });
    }
  }

  private buildSearchQuery(
    params?: ExerciseSearchParams,
  ): Prisma.ExerciseWhereInput {
    if (!params) return {};

    const query: Prisma.ExerciseWhereInput = {};

    if (params.name) {
      query.name = { contains: params.name, mode: "insensitive" };
    }

    if (params.type) {
      query.type = params.type;
    }

    if (params.isArchived !== undefined) {
      query.isArchived = params.isArchived;
    }

    if (params.muscleGroups?.length) {
      query.muscleGroups = {
        some: {
          id: {
            in: params.muscleGroups.map((mg) => mg.id),
          },
        },
      };
    }

    if (params.equipment?.length) {
      query.equipment = {
        some: {
          id: {
            in: params.equipment.map((eq) => eq.id),
          },
        },
      };
    }

    if (params.difficulty?.length) {
      query.difficulty = {
        array_contains: params
          .difficulty[0] as unknown as Prisma.InputJsonValue,
      };
    }

    return query;
  }

  private getIncludeOptions() {
    return {
      muscleGroups: true,
      equipment: true,
      workoutExercises: {
        include: {
          sets: true,
        },
      },
      personalRecords: true,
    } as const;
  }

  private isMuscleGroup(mg: any): mg is MuscleGroup {
    return mg && typeof mg === "object" && "body" in mg;
  }

  private isEquipment(eq: any): eq is Equipment {
    return eq && typeof eq === "object" && "category" in eq;
  }

  private mapToExercise = (prismaExercise: PrismaExercise): Exercise => {
    if (!prismaExercise) throw new Error("Cannot map null exercise");

    const muscleGroups = prismaExercise.muscleGroups
      .filter(this.isMuscleGroup)
      .map((mg) => ({
        id: mg.id,
        name: mg.name,
        body: mg.body as Body,
        description: mg.description,
        createdAt: mg.createdAt,
        updatedAt: mg.updatedAt,
      }));

    const equipment = prismaExercise.equipment
      .filter(this.isEquipment)
      .map((eq) => ({
        id: eq.id,
        name: eq.name,
        description: eq.description,
        category: eq.category,
        createdAt: eq.createdAt,
        updatedAt: eq.updatedAt,
      }));

    const exercise: Exercise = {
      id: prismaExercise.id,
      name: prismaExercise.name,
      description: prismaExercise.description || "",
      type: prismaExercise.type as ExerciseType,
      muscleGroups,
      difficulty: prismaExercise.difficulty as DifficultyType[],
      equipment,
      movements: prismaExercise.movements as MovementType[],
      videoUrl: prismaExercise.videoUrl || null,
      imageUrls: (prismaExercise.imageUrls as string[]) || null,
      isArchived: prismaExercise.isArchived,
      lastUsedAt: prismaExercise.lastUsedAt || null,
      createdAt: prismaExercise.createdAt,
      updatedAt: prismaExercise.updatedAt,
    };

    return exercise;
  };
}
