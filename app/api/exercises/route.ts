import { NextResponse } from "next/server";
import { z } from "zod";

import logger from "../../../lib/logger";
import { exerciseSchema } from "../../../lib/schemas/exercise.schema";
import { exerciseService } from "../../../lib/services/exercise.service";
import {
  ExerciseType,
  DifficultyType,
  MuscleGroup,
} from "../../../types/models";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");
    const body = searchParams.get("body");
    const searchQuery = searchParams.get("search");

    const params: {
      type?: ExerciseType;
      difficulty?: DifficultyType;
      body?: MuscleGroup;
      searchQuery?: string;
    } = {};

    if (type && Object.values(ExerciseType).includes(type as ExerciseType)) {
      params.type = type as ExerciseType;
    }

    if (
      difficulty &&
      Object.values(DifficultyType).includes(difficulty as DifficultyType)
    ) {
      params.difficulty = difficulty as DifficultyType;
    }

    if (body && Object.values(MuscleGroup).includes(body as MuscleGroup)) {
      params.body = body as MuscleGroup;
    }

    if (searchQuery) {
      params.searchQuery = searchQuery;
    }

    logger.info("GET /api/exercises", { params });

    const exercises = await exerciseService.getExercises(params);

    return NextResponse.json(exercises);
  } catch (error) {
    logger.error("Error in GET /api/exercises", { error });

    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info("POST /api/exercises", { data });

    const validated = exerciseSchema.parse(data);
    const exercise = await exerciseService.createExercise(validated);

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Validation error in POST /api/exercises", { error });
      return NextResponse.json(
        { error: "Invalid exercise data", details: error.errors },
        { status: 400 },
      );
    }

    logger.error("Error in POST /api/exercises", { error });
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 },
    );
  }
}
