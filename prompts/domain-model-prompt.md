# Exercise Tracker - Domain Models and Repository Pattern Guidelines

You are implementing the domain models and repositories for an exercise tracking application. Follow these patterns and guidelines:

## Domain Models

### Core Entities
Implement these with strict typing and validation:

```typescript
interface Exercise {
  id: number;
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
}

interface Set {
  id: number;
  workout: Workout;
  exercise: Exercise;
  effort: EffortType;
  notes: string;
  reps: number;
  duration?: string;  // Format: "mm:ss"
  weight?: number;    // in kg
  isPersonalRecord: boolean;
}

interface Workout {
  id: number;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  notes: string;
  startTime: Date;
  endTime?: Date;
}
```

### Value Objects
Use enums for fixed values:
```typescript
enum ExerciseType {
  Strength = 'STRENGTH',
  Endurance = 'ENDURANCE',
  Mobility = 'MOBILITY'
}

enum EffortType {
  Easy = 'EASY',
  Challenging = 'CHALLENGING',
  Maximum = 'MAXIMUM'
}
```

## Repository Pattern Implementation

### Base Repository Interface
```typescript
interface IRepository<T> {
  findById(id: string): Promise<T>;
  findAll(filters?: any): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### Exercise Repository Example
```typescript
class ExerciseRepository implements IRepository<Exercise> {
  constructor(
    private prisma: PrismaClient,
    private cache: CacheService
  ) {}

  async findById(id: string): Promise<Exercise> {
    const cacheKey = `exercise:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        muscleGroups: true,
        equipment: true
      }
    });

    await this.cache.set(cacheKey, exercise);
    return exercise;
  }

  async search(params: ExerciseSearchParams): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: this.buildSearchQuery(params),
      include: this.getIncludeOptions(),
      orderBy: this.getOrderByOptions(params)
    });
  }
}
```

## Best Practices

### 1. Repository Implementation
- Implement caching strategies
- Use proper transaction management
- Include comprehensive error handling
- Implement query builders for complex queries
- Support pagination and filtering

### 2. Domain Model Implementation
- Use strict typing
- Implement validation logic
- Include business rules
- Handle date/time properly
- Implement proper serialization

### 3. Query Optimization
- Use efficient include patterns
- Implement proper indexing
- Use query builders for complex queries
- Support efficient pagination

### 4. Caching Strategy
- Implement multi-level caching
- Use appropriate cache invalidation
- Handle cache misses gracefully
- Include cache warming strategies

### 5. Error Handling
```typescript
class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

// Usage
try {
  await repository.findById(id);
} catch (error) {
  throw new RepositoryError(
    'Failed to fetch exercise',
    'EXERCISE_NOT_FOUND',
    { id }
  );
}
```

## Validation Rules
1. All entities must have:
   - Proper ID generation
   - Audit fields (createdAt, updatedAt)
   - Type safety
   - Input validation

2. All repositories must:
   - Handle errors gracefully
   - Implement caching where appropriate
   - Support pagination
   - Include proper logging

Follow these patterns to ensure consistent, maintainable, and performant data access layers.