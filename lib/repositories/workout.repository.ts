import type { PrismaClient } from "@prisma/client";

import type { Workout, WorkoutExercise, Set } from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface WorkoutSearchParams {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class WorkoutRepository extends BaseRepository<Workout> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Workout");
  }

  async findById(id: string): Promise<Workout> {
    try {
      this.validateId(id);
      this.logOperation("findById", { id });

      const workout = await this.prisma.workout.findUnique({
        where: { id },
        include: this.getIncludeOptions(),
      });

      if (!workout) {
        throw new RepositoryError("Workout not found", "WORKOUT_NOT_FOUND", {
          id,
        });
      }

      return this.mapToWorkout(workout);
    } catch (error) {
      this.handleError(error, "findById", { id });
    }
  }

  async findAll(params?: WorkoutSearchParams): Promise<Workout[]> {
    try {
      this.logOperation("findAll", params);

      const workouts = await this.prisma.workout.findMany({
        where: this.buildSearchQuery(params),
        include: this.getIncludeOptions(),
        orderBy: { date: "desc" },
      });

      return workouts.map(this.mapToWorkout);
    } catch (error) {
      this.handleError(error, "findAll", params);
    }
  }

  async create(
    workout: Omit<Workout, "id" | "createdAt" | "updatedAt">,
  ): Promise<Workout> {
    try {
      this.logOperation("create", workout);

      const created = await this.prisma.workout.create({
        data: {
          userId: workout.userId,
          name: workout.name ?? "",
          description: workout.description ?? "",
          notes: workout.notes ?? "",
          date: workout.startTime ?? new Date(),
          exercises: {
            create: workout.exercises.map((exercise) => ({
              exerciseId: exercise.exerciseId,
              sets: {
                create: exercise.sets.map((set) => ({
                  reps: set.reps,
                  weight: set.weight,
                  duration: set.duration
                    ? parseInt(set.duration?.split(":")[0] ?? "0") * 60 +
                      parseInt(set.duration?.split(":")[1] ?? "0")
                    : null,
                  notes: set.notes ?? "",
                  isPersonalRecord: set.isPersonalRecord,
                  effort: set.effort,
                })),
              },
            })),
          },
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToWorkout(created);
    } catch (error) {
      this.handleError(error, "create", workout);
    }
  }

  async update(id: string, workout: Partial<Workout>): Promise<Workout> {
    try {
      this.validateId(id);
      this.logOperation("update", { id, workout });

      const data: any = {
        name: workout.name ?? "",
        description: workout.description ?? "",
        notes: workout.notes ?? "",
        date: workout.startTime ?? new Date(),
      };

      if (workout.exercises) {
        // Handle workout exercises update
        data.exercises = {
          upsert: workout.exercises.map((exercise) => ({
            where: { id: exercise.id },
            create: {
              exerciseId: exercise.exerciseId,
              sets: {
                create: exercise.sets.map((set) => ({
                  reps: set.reps,
                  weight: set.weight,
                  duration: set.duration
                    ? parseInt(set.duration?.split(":")[0] ?? "0") * 60 +
                      parseInt(set.duration?.split(":")[1] ?? "0")
                    : null,
                  notes: set.notes,
                  isPersonalRecord: set.isPersonalRecord,
                  effort: set.effort,
                })),
              },
            },
            update: {
              sets: {
                upsert: exercise.sets.map((set) => ({
                  where: { id: set.id },
                  create: {
                    reps: set.reps,
                    weight: set.weight,
                    duration: set.duration
                      ? parseInt(set.duration?.split(":")[0] ?? "0") * 60 +
                        parseInt(set.duration?.split(":")[1] ?? "0")
                      : null,
                    notes: set.notes ?? "",
                    isPersonalRecord: set.isPersonalRecord,
                    effort: set.effort,
                  },
                  update: {
                    reps: set.reps,
                    weight: set.weight,
                    duration: set.duration
                      ? parseInt(set.duration?.split(":")[0] ?? "0") * 60 +
                        parseInt(set.duration?.split(":")[1] ?? "0")
                      : null,
                    notes: set.notes ?? "",
                    isPersonalRecord: set.isPersonalRecord,
                    effort: set.effort,
                  },
                })),
              },
            },
          })),
        };
      }

      const updated = await this.prisma.workout.update({
        where: { id },
        data,
        include: this.getIncludeOptions(),
      });

      return this.mapToWorkout(updated);
    } catch (error) {
      this.handleError(error, "update", { id, workout });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.validateId(id);
      this.logOperation("delete", { id });

      await this.prisma.workout.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, "delete", { id });
    }
  }

  private buildSearchQuery(params?: WorkoutSearchParams) {
    if (!params) return {};

    const query: any = {};

    if (params.userId) {
      query.userId = params.userId;
    }

    if (params.startDate || params.endDate) {
      query.date = {};
      if (params.startDate) {
        query.date.gte = params.startDate;
      }
      if (params.endDate) {
        query.date.lte = params.endDate;
      }
    }

    return query;
  }

  private getIncludeOptions() {
    return {
      user: true,
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
      },
    };
  }

  private mapToWorkout(data: any): Workout {
    return {
      id: data.id,
      userId: data.userId,
      user: data.user,
      name: data.name ?? "",
      description: data.description ?? "",
      notes: data.notes ?? "",
      startTime: data.date,
      endTime: data.endTime,
      exercises: data.exercises.map(this.mapToWorkoutExercise),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToWorkoutExercise(data: any): WorkoutExercise {
    return {
      id: data.id,
      workoutId: data.workoutId,
      exerciseId: data.exerciseId,
      sets: data.sets.map(this.mapToSet),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToSet(data: any): Set {
    return {
      id: data.id,
      workoutExerciseId: data.workoutExerciseId,
      reps: data.reps,
      weight: data.weight,
      duration: data.duration
        ? `${Math.floor(data.duration / 60)
            .toString()
            .padStart(
              2,
              "0",
            )}:${(data.duration % 60).toString().padStart(2, "0")}`
        : null,
      notes: data.notes ?? "",
      isPersonalRecord: data.isPersonalRecord,
      effort: data.effort,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
