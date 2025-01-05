# Exercise Tracker - Service Layer and Controller Implementation Guidelines

You are implementing the service layer and controllers for an exercise tracking application. Follow these patterns and guidelines:

## Service Layer Pattern

### Base Service Structure
```typescript
class WorkoutService {
  constructor(
    private workoutRepo: WorkoutRepository,
    private exerciseService: ExerciseService,
    private analyticsService: AnalyticsService
  ) {}

  async startWorkout(data: StartWorkoutDTO): Promise<Workout> {
    return await this.unitOfWork.execute(async (tx) => {
      const workout = await this.workoutRepo.create({
        ...data,
        startTime: new Date()
      }, tx);

      if (data.routineId) {
        await this.loadRoutineExercises(workout.id, data.routineId, tx);
      }

      return workout;
    });
  }
}
```

### Service Layer Best Practices
1. Business Logic Encapsulation
   - Keep domain logic in services
   - Use DTOs for data transfer
   - Implement validation
   - Handle complex operations

2. Transaction Management
   - Use Unit of Work pattern
   - Ensure data consistency
   - Handle rollbacks properly

3. Error Handling
   - Use custom error types
   - Include proper error context
   - Implement retry logic where appropriate

## Controller Layer Pattern

### API Route Implementation
```typescript
// src/app/api/workouts/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  try {
    const validated = WorkoutSchema.parse(data);
    const workout = await workoutService.startWorkout(validated);
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Controller Best Practices
1. Input Validation
   - Use Zod schemas
   - Validate request parameters
   - Handle validation errors

2. Response Formatting
   - Consistent error responses
   - Proper HTTP status codes
   - Pagination support

3. Authentication/Authorization
   - Implement middleware
   - Check permissions
   - Handle token validation

## Error Handling Pattern

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { errors: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof ServiceError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## API Contract Testing

```typescript
describe('API Contract Tests', () => {
  describe('Workout Endpoints', () => {
    it('validates workout creation payload', () => {
      const payload = {
        name: 'Morning Workout',
        routineId: 1
      };

      const result = WorkoutSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
```

## Performance Optimization

### 1. Caching Strategy
```typescript
class CachedWorkoutService {
  private cache: CacheService;

  async getRecentWorkouts(userId: string): Promise<Workout[]> {
    const cacheKey = `recent-workouts:${userId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const workouts = await this.workoutRepo.findRecent(userId);
    await this.cache.set(cacheKey, workouts, { ttl: 300 });
    return workouts;
  }
}
```

### 2. Query Optimization
- Use proper indexes
- Implement pagination
- Optimize includes
- Use query builders

## Validation Rules

1. All Services Must:
   - Implement proper error handling
   - Use transactions where needed
   - Include input validation
   - Handle edge cases
   - Implement proper logging

2. All Controllers Must:
   - Validate input
   - Handle errors properly
   - Use proper HTTP status codes
   - Include proper documentation
   - Implement rate limiting

3. All API Endpoints Must:
   - Be properly authenticated
   - Include proper validation
   - Handle all error cases
   - Include proper documentation
   - Support proper content types

Follow these patterns to ensure robust, maintainable, and secure service implementations.