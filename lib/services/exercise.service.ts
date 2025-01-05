import type {
  Exercise,
  ExerciseType,
  DifficultyType,
  MuscleGroup,
} from "@/types/models";

import logger from "../logger";
import prisma from "../prisma";
import type { ExerciseSearchParams } from "../repositories/exercise.repository";
import { ExerciseRepository } from "../repositories/exercise.repository";

export class ExerciseService {
  private repository: ExerciseRepository;

  constructor() {
    this.repository = new ExerciseRepository(prisma);
  }

  async getExercises(params?: {
    type?: ExerciseType;
    difficulty?: DifficultyType;
    body?: MuscleGroup;
    searchQuery?: string;
  }): Promise<Exercise[]> {
    logger.info("Getting exercises", { params });

    try {
      const searchParams: ExerciseSearchParams = {
        isArchived: false,
      };

      if (params?.type) {
        searchParams.type = params.type;
      }
      if (params?.searchQuery) {
        searchParams.name = params.searchQuery;
      }
      if (params?.difficulty) {
        searchParams.difficulty = [params.difficulty];
      }
      if (params?.body) {
        searchParams.muscleGroups = [params.body];
      }

      const exercises = await this.repository.findAll(searchParams);
      logger.info("Successfully retrieved exercises", {
        count: exercises.length,
      });

      return exercises;
    } catch (error) {
      logger.error("Error getting exercises", { error });
      throw error;
    }
  }

  async getExerciseById(id: string): Promise<Exercise> {
    logger.info("Getting exercise by id", { id });

    try {
      const exercise = await this.repository.findById(id);
      logger.info("Successfully retrieved exercise", { id });

      return exercise;
    } catch (error) {
      logger.error("Error getting exercise by id", { error, id });
      throw error;
    }
  }
}

export const exerciseService = new ExerciseService();
