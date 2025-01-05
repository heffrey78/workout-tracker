import type { PrismaClient } from "@prisma/client";

import type { Exercise, ExerciseType } from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface ExerciseSearchParams {
  name?: string;
  type?: ExerciseType;
  muscleGroups?: string[];
  equipment?: string[];
  difficulty?: string[];
  isArchived?: boolean;
}

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

      return exercises.map(this.mapToExercise);
    } catch (error) {
      this.handleError(error, "findAll", params);
    }
  }

  async create(
    exercise: Omit<Exercise, "id" | "createdAt" | "updatedAt">,
  ): Promise<Exercise> {
    try {
      this.logOperation("create", exercise);

      const created = await this.prisma.exercise.create({
        data: {
          name: exercise.name,
          description: exercise.description,
          category: exercise.type, // Map to existing schema
          isArchived: exercise.isArchived,
          lastUsedAt: exercise.lastUsedAt,
          videoUrl: exercise.videoUrl,
          imageUrls: exercise.imageUrls,
          // Store arrays as JSON in the database
          muscleGroups: JSON.stringify(exercise.muscleGroups),
          difficulty: JSON.stringify(exercise.difficulty),
          equipment: JSON.stringify(exercise.equipment),
          movements: JSON.stringify(exercise.movements),
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

      const data: any = { ...exercise };

      // Only stringify arrays if they are present in the update
      if (exercise.muscleGroups) {
        data.muscleGroups = JSON.stringify(exercise.muscleGroups);
      }
      if (exercise.difficulty) {
        data.difficulty = JSON.stringify(exercise.difficulty);
      }
      if (exercise.equipment) {
        data.equipment = JSON.stringify(exercise.equipment);
      }
      if (exercise.movements) {
        data.movements = JSON.stringify(exercise.movements);
      }
      if (exercise.type) {
        data.category = exercise.type;
        delete data.type;
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

  private buildSearchQuery(params?: ExerciseSearchParams) {
    if (!params) return {};

    const query: any = {};

    if (params.name) {
      query.name = { contains: params.name, mode: "insensitive" };
    }

    if (params.type) {
      query.category = params.type;
    }

    if (params.isArchived !== undefined) {
      query.isArchived = params.isArchived;
    }

    return query;
  }

  private getIncludeOptions() {
    return {
      workoutExercises: {
        include: {
          sets: true,
        },
      },
    };
  }

  private mapToExercise(data: any): Exercise {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.category as ExerciseType,
      muscleGroups: JSON.parse(data.muscleGroups || "[]"),
      difficulty: JSON.parse(data.difficulty || "[]"),
      equipment: JSON.parse(data.equipment || "[]"),
      movements: JSON.parse(data.movements || "[]"),
      videoUrl: data.videoUrl,
      imageUrls: data.imageUrls,
      isArchived: data.isArchived,
      lastUsedAt: data.lastUsedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
