import type { PrismaClient } from "@prisma/client";

import { EquipmentRepository } from "./equipment.repository";
import { ExerciseRepository } from "./exercise.repository";
import { MuscleGroupRepository } from "./muscle-group.repository";
import { PersonalRecordRepository } from "./personal-record.repository";
import { WorkoutRepository } from "./workout.repository";

export interface Repositories {
  exercises: ExerciseRepository;
  equipment: EquipmentRepository;
  muscleGroups: MuscleGroupRepository;
  personalRecords: PersonalRecordRepository;
  workouts: WorkoutRepository;
}

export function createRepositories(prisma: PrismaClient): Repositories {
  return {
    exercises: new ExerciseRepository(prisma),
    equipment: new EquipmentRepository(prisma),
    muscleGroups: new MuscleGroupRepository(prisma),
    personalRecords: new PersonalRecordRepository(prisma),
    workouts: new WorkoutRepository(prisma),
  };
}

export * from "./base.repository";
export * from "./equipment.repository";
export * from "./exercise.repository";
export * from "./muscle-group.repository";
export * from "./personal-record.repository";
export * from "./workout.repository";
