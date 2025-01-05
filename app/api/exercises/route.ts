import { NextResponse } from "next/server";

import logger from "@/lib/logger";
import { exerciseService } from "@/lib/services/exercise.service";
import { ExerciseType, DifficultyType, MuscleGroup } from "@/types/models";

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
