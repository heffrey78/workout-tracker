import { NextResponse } from "next/server";
import { z } from "zod";

import { muscleGroupSchema } from "@/lib/schemas/muscle-group.schema";
import { muscleGroupService } from "@/lib/services/muscle-group.service";

import logger from "../../../lib/logger";

/**
 * Handles GET requests to `/api/muscle-groups`.
 *
 * Returns a JSON response containing all muscle groups.
 *
 * @returns {NextResponse} A JSON response with the list of muscle groups.
 * @throws {Error} If there is a problem fetching the muscle groups.
 */
export async function GET() {
  try {
    const muscleGroups = await muscleGroupService.findAll();
    return NextResponse.json(muscleGroups);
  } catch (error) {
    logger.error("Error in GET /api/muscle-groups", { error });

    return NextResponse.json(
      { error: "Failed to fetch musclegroups" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info("POST /api/muscle-groups", { data });

    const validated = muscleGroupSchema.parse(data);

    const muscleGroup = await muscleGroupService.create(validated);

    return NextResponse.json(muscleGroup, { status: 201 });
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
