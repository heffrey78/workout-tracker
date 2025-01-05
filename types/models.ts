export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExerciseType {
  Strength = "STRENGTH",
  Endurance = "ENDURANCE",
  Mobility = "MOBILITY",
}

export enum EffortType {
  Easy = "EASY",
  Challenging = "CHALLENGING",
  Maximum = "MAXIMUM",
}

export enum MuscleGroup {
  Chest = "CHEST",
  Back = "BACK",
  Shoulders = "SHOULDERS",
  Biceps = "BICEPS",
  Triceps = "TRICEPS",
  Core = "CORE",
  Legs = "LEGS",
  Glutes = "GLUTES",
  Calves = "CALVES",
}

export enum Equipment {
  Barbell = "BARBELL",
  Dumbbell = "DUMBBELL",
  Kettlebell = "KETTLEBELL",
  Machine = "MACHINE",
  Bodyweight = "BODYWEIGHT",
  Resistance = "RESISTANCE",
  Other = "OTHER",
}

export enum MovementType {
  Push = "PUSH",
  Pull = "PULL",
  Squat = "SQUAT",
  Hinge = "HINGE",
  Lunge = "LUNGE",
  Carry = "CARRY",
  Core = "CORE",
}

export enum DifficultyType {
  Beginner = "BEGINNER",
  Intermediate = "INTERMEDIATE",
  Advanced = "ADVANCED",
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  muscleGroups: MuscleGroup[];
  difficulty: DifficultyType[];
  equipment: Equipment[];
  movements: MovementType[];
  videoUrl?: string;
  imageUrls?: string[];
  isArchived: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Set {
  id: string;
  workoutExerciseId: string;
  effort: EffortType;
  notes?: string;
  reps: number;
  duration?: string | null; // Format: "mm:ss"
  weight?: number | null; // in kg
  isPersonalRecord: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: Set[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  user: User;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  notes?: string;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
