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

export enum MovementType {
  Isometric = "ISOMETRIC",
  Push = "PUSH",
  Pull = "PULL",
  Hinge = "HINGE",
  Squat = "SQUAT",
  Lunge = "LUNGE",
  Rotation = "ROTATION",
  Plyometric = "PLYOMETRIC",
}

export enum DifficultyType {
  Beginner = "BEGINNER",
  Intermediate = "INTERMEDIATE",
  Advanced = "ADVANCED",
}

export enum EffortType {
  Easy = "EASY",
  Challenging = "CHALLENGING",
  Maximum = "MAXIMUM",
}

export enum Body {
  Upper = "UPPER",
  Lower = "LOWER",
  Core = "CORE",
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MuscleGroup {
  id: string;
  name: string;
  body: Body;
  description: string;
  createdAt: Date;
  updatedAt: Date;
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
  videoUrl?: string | null;
  imageUrls?: string[] | null;
  isArchived: boolean;
  lastUsedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Set {
  id: string;
  workoutExerciseId: string;
  effort: EffortType;
  notes: string;
  reps: number;
  duration?: string | undefined; // Format: "mm:ss"
  weight?: number | undefined; // in kg
  isPersonalRecord: boolean;
  restDuration?: string | undefined; // Format: "mm:ss"
  actualRestTaken?: string | undefined; // Format: "mm:ss"
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  workoutId: string;
  setId: string;
  type: "WEIGHT" | "REPS" | "DURATION";
  value: number;
  achievedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: Set[];
  order: number;
  restAfter?: string | undefined; // Format: "mm:ss"
  notes?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  user: User;
  name: string;
  description?: string | undefined;
  exercises: WorkoutExercise[];
  notes: string;
  startTime: Date;
  endTime?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}
