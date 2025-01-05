# Exercise Tracker - Database Migration and Schema Guidelines

You are tasked with implementing database-related functionality for an exercise tracking application. Follow these guidelines and patterns:

## Database Technology
- Use PostgreSQL as the primary database
- Implement via Prisma ORM
- Enable full-text search capabilities

## Schema Requirements

### Core Tables
- Exercises (with full-text search on name/description)
- Workouts (with efficient date-range queries)
- Sets (with performance tracking capabilities)
- Equipment
- MuscleGroups
- Users (with authentication data)

### Key Indexes
1. Exercise queries:
   - Name lookup
   - Type filtering
   - Recently used
   - Full-text search (name + description)

2. Workout queries:
   - User-specific workout history
   - Date range lookups
   - Exercise composition

3. Set tracking:
   - Performance metrics
   - Personal records

### Migration Strategy
1. Version Control:
   - Use timestamped migration files
   - Implement up/down migrations
   - Track migration state

2. Data Integrity:
   - Implement foreign key constraints
   - Use cascading deletes where appropriate
   - Maintain audit fields (createdAt, updatedAt)

3. Performance:
   - Batch operations for large datasets
   - Implement appropriate indexes
   - Consider partitioning for historical data

## Example Migration Pattern
```typescript
export const up = async (prisma: Prisma.TransactionClient) => {
  // Create enums first
  await prisma.$executeRaw`CREATE TYPE "ExerciseType" AS ENUM (...);`;
  
  // Create base tables
  await prisma.$executeRaw`
    CREATE TABLE "Exercise" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      ...
    );
  `;
  
  // Add indexes
  await prisma.$executeRaw`
    CREATE INDEX "exercise_name_idx" ON "Exercise" ("name");
  `;
};
```

## Validation Rules
1. Every migration must:
   - Be reversible (include down migration)
   - Be idempotent
   - Include appropriate indexes
   - Handle enum types properly
   - Consider foreign key constraints

2. Schema must support:
   - Full audit trail
   - Soft deletes where appropriate
   - Performance optimization
   - Data integrity constraints

## Best Practices
1. Use transactions for complex migrations
2. Implement retry logic for long-running migrations
3. Include data validation steps
4. Maintain migration history
5. Consider impact on application performance
6. Test migrations with production-scale data
7. Implement rollback procedures

Follow these guidelines to ensure reliable, performant, and maintainable database operations.