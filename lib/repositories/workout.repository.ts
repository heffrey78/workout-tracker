import type { PrismaClient, Prisma } from "@prisma/client";

import type {
  Workout,
  WorkoutExercise,
  Set,
  EffortType,
} from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface WorkoutSearchParams {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

type PrismaWorkout = Prisma.WorkoutGetPayload<{
  include: {
    user: true;
    exercises: {
      include: {
        exercise: true;
        sets: true;
      };
    };
  };
}>;

type PrismaWorkoutExercise = Prisma.WorkoutExerciseGetPayload<{
  include: {
    exercise: true;
    sets: true;
  };
}>;

type PrismaSet = Prisma.SetGetPayload<{
  include: Record<string, never>;
}>;

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

      return workouts.map((workout) => this.mapToWorkout(workout));
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
          name: workout.name,
          description: workout.description || null,
          notes: workout.notes || "",
          date: workout.startTime,
          endTime: workout.endTime || null,
          exercises: {
            create: workout.exercises.map((exercise, index) => ({
              exerciseId: exercise.exerciseId,
              order: exercise.order ?? index,
              restAfter: this.durationToSeconds(exercise.restAfter),
              notes: exercise.notes || null,
              sets: {
                create: exercise.sets.map((set, setIndex) => ({
                  reps: set.reps,
                  weight: set.weight || null,
                  duration: this.durationToSeconds(set.duration),
                  restDuration: this.durationToSeconds(set.restDuration),
                  actualRestTaken: this.durationToSeconds(set.actualRestTaken),
                  notes: set.notes || "",
                  isPersonalRecord: set.isPersonalRecord,
                  effort: set.effort,
                  order: set.order ?? setIndex,
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

      const data: Prisma.WorkoutUpdateInput = {};

      if (workout.name !== undefined) data.name = workout.name;
      if (workout.description !== undefined)
        data.description = workout.description || null;
      if (workout.notes !== undefined) data.notes = workout.notes || "";
      if (workout.startTime !== undefined) data.date = workout.startTime;
      if (workout.endTime !== undefined) data.endTime = workout.endTime || null;

      if (workout.exercises !== undefined) {
        data.exercises = {
          deleteMany: {},
          create: workout.exercises.map((exercise, index) => ({
            exerciseId: exercise.exerciseId,
            order: exercise.order ?? index,
            restAfter: this.durationToSeconds(exercise.restAfter),
            notes: exercise.notes || null,
            sets: {
              create: exercise.sets.map((set, setIndex) => ({
                reps: set.reps,
                weight: set.weight || null,
                duration: this.durationToSeconds(set.duration),
                restDuration: this.durationToSeconds(set.restDuration),
                actualRestTaken: this.durationToSeconds(set.actualRestTaken),
                notes: set.notes || "",
                isPersonalRecord: set.isPersonalRecord,
                effort: set.effort,
                order: set.order ?? setIndex,
              })),
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

  private buildSearchQuery(
    params?: WorkoutSearchParams,
  ): Prisma.WorkoutWhereInput {
    if (!params) return {};

    const query: Prisma.WorkoutWhereInput = {};

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
    } as const;
  }

  private durationToSeconds(duration?: string | undefined): number | null {
    if (!duration) return null;
    const [minutes = "0", seconds = "0"] = duration.split(":");
    return parseInt(minutes) * 60 + parseInt(seconds);
  }

  private secondsToDuration(seconds?: number | null): string | undefined {
    if (seconds === null || seconds === undefined) return undefined;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  private mapToSet(data: PrismaSet): Set {
    const duration = this.secondsToDuration(data.duration);
    const restDuration = this.secondsToDuration(data.restDuration);
    const actualRestTaken = this.secondsToDuration(data.actualRestTaken);

    return {
      id: data.id,
      workoutExerciseId: data.workoutExerciseId,
      reps: data.reps,
      weight: data.weight || undefined,
      duration: duration,
      restDuration: restDuration,
      actualRestTaken: actualRestTaken,
      notes: data.notes || "",
      isPersonalRecord: data.isPersonalRecord,
      effort: data.effort as EffortType,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToWorkoutExercise(data: PrismaWorkoutExercise): WorkoutExercise {
    const restAfter = this.secondsToDuration(data.restAfter);

    return {
      id: data.id,
      workoutId: data.workoutId,
      exerciseId: data.exerciseId,
      order: data.order,
      restAfter: restAfter,
      notes: data.notes || undefined,
      sets: data.sets.map((set) => this.mapToSet(set)),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToWorkout = (data: PrismaWorkout): Workout => {
    if (!data) throw new Error("Cannot map null workout");

    return {
      id: data.id,
      userId: data.userId,
      user: data.user,
      name: data.name,
      description: data.description || undefined,
      notes: data.notes || "",
      startTime: data.date,
      endTime: data.endTime || undefined,
      exercises: data.exercises.map((exercise) =>
        this.mapToWorkoutExercise(exercise),
      ),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  };
}
