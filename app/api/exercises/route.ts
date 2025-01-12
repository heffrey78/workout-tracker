import { NextResponse } from "next/server";
import { z } from "zod";

import logger from "../../../lib/logger";
import prisma from "../../../lib/prisma";
import { exerciseSchema } from "../../../lib/schemas/exercise.schema";
import { exerciseService } from "../../../lib/services/exercise.service";
import { ExerciseType, DifficultyType } from "../../../types/models";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");
    const bodyId = searchParams.get("body"); // Changed from body to bodyId
    const searchQuery = searchParams.get("search");

    const params: {
      type?: ExerciseType;
      difficulty?: DifficultyType;
      bodyId?: string; // Changed from body to bodyId with string type
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

    if (bodyId) {
      // Validate that the muscle group exists
      const muscleGroup = await prisma.muscleGroup.findUnique({
        where: { id: bodyId },
      });

      if (muscleGroup) {
        params.bodyId = bodyId;
      } else {
        return NextResponse.json(
          { error: "Invalid muscle group ID" },
          { status: 400 },
        );
      }
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

    // If the request contains a bodyId, validate it exists
    if (data.bodyId) {
      const muscleGroup = await prisma.muscleGroup.findUnique({
        where: { id: data.bodyId },
      });

      if (!muscleGroup) {
        return NextResponse.json(
          { error: "Invalid muscle group ID" },
          { status: 400 },
        );
      }
    }

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
