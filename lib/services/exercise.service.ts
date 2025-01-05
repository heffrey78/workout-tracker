import type {
  Exercise,
  ExerciseType,
  DifficultyType,
  MuscleGroup,
} from "../../types/models";
import logger from "../logger";
import prisma from "../prisma";
import type { ExerciseSearchParams } from "../repositories/exercise.repository";
import { ExerciseRepository } from "../repositories/exercise.repository";
import type { ExerciseFormData } from "../schemas/exercise.schema";

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

  async createExercise(data: ExerciseFormData): Promise<Exercise> {
    logger.info("Creating exercise", { data });

    try {
      const exercise = await this.repository.create({
        name: data.name,
        description: data.description || "",
        type: data.type,
        muscleGroups: data.muscleGroups,
        difficulty: data.difficulty,
        equipment: data.equipment,
        movements: data.movements,
        videoUrl: data.videoUrl || "",
        imageUrls: data.imageUrls,
        isArchived: data.isArchived,
      });
      logger.info("Successfully created exercise", { id: exercise.id });

      return exercise;
    } catch (error) {
      logger.error("Error creating exercise", { error });
      throw error;
    }
  }
}

export const exerciseService = new ExerciseService();
