# Exercise Tracker - Frontend Architecture and Component Implementation Guidelines

You are implementing the frontend components for an exercise tracking application. Follow these patterns and guidelines:

## Architecture Patterns

### 1. Server Components First
```typescript
// app/exercises/page.tsx
async function ExercisesPage() {
  const exercises = await fetchExercises();
  
  return (
    <div>
      <ExerciseList exercises={exercises} />
      <ClientExerciseSearch /> {/* Client component */}
    </div>
  );
}
```

### 2. State Management Pattern
```typescript
interface WorkoutState {
  status: 'idle' | 'active' | 'resting' | 'completed';
  currentExercise: Exercise | null;
  currentSet: number;
  timer: number;
}

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START_SET':
      return {
        ...state,
        status: 'active',
        timer: 0
      };
    // ... other cases
  }
}
```

## Component Patterns

### 1. Compound Components
```typescript
const Exercise = {
  Root: ({ children, exercise }: ExerciseProps) => (
    <ExerciseContext.Provider value={exercise}>
      <div className="exercise-container">{children}</div>
    </ExerciseContext.Provider>
  ),
  
  Details: () => {
    const exercise = useExerciseContext();
    return <ExerciseDetails exercise={exercise} />;
  },
  
  SetList: () => {
    const exercise = useExerciseContext();
    return <SetList exerciseId={exercise.id} />;
  }
};
```

### 2. Container/Presenter Pattern
```typescript
// Container
const ExerciseListContainer: React.FC = () => {
  const [state, dispatch] = useReducer(exerciseReducer, initialState);
  const filteredExercises = useFilteredExercises(state);
  
  return (
    <ExerciseList
      exercises={filteredExercises}
      onFilter={(filters) => dispatch({ type: 'SET_FILTERS', payload: filters })}
    />
  );
};

// Presenter
const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercises,
  onFilter 
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {exercises.map(exercise => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
};

## UI Patterns

### 1. Layout Components
```typescript
const ExerciseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-6">
        <Title>Exercises</Title>
        <Actions />
      </header>
      <main>{children}</main>
    </div>
  );
};
```

### 2. Tailwind Usage
- Use ONLY core utility classes
- NO arbitrary values (e.g., h-[500px])
- Follow consistent spacing scale
- Use semantic color values

```typescript
// Good
<div className="h-64 w-full p-4 text-lg bg-blue-500">
// Bad
<div className="h-[450px] w-[42rem] p-[15px] text-[17px] bg-[#3B82F6]">
```

### 3. Component Composition
```typescript
const ExerciseCard = {
  Root: ({ children }: PropsWithChildren) => (
    <Card className="h-full hover:border-blue-200">
      {children}
    </Card>
  ),
  
  Header: ({ title, type }: { title: string; type: string }) => (
    <CardHeader>
      <h3 className="font-semibold">{title}</h3>
      <div className="text-sm text-gray-500">{type}</div>
    </CardHeader>
  ),
  
  Content: ({ children }: PropsWithChildren) => (
    <CardContent>{children}</CardContent>
  )
};
```

## State Management Best Practices

### 1. Context Organization
```typescript
// contexts/WorkoutContext.tsx
interface WorkoutContextType {
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
};
```

### 2. Custom Hooks
```typescript
function useWorkoutTimer(workoutId: string) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    elapsed,
    formatted: formatTime(elapsed)
  };
}
```

### 3. Memoization
```typescript
const MemoizedExerciseList = memo(function ExerciseList({ 
  exercises,
  onSelect 
}: ExerciseListProps) {
  return exercises.map(exercise => (
    <ExerciseCard
      key={exercise.id}
      exercise={exercise}
      onSelect={onSelect}
    />
  ));
}, exerciseListPropsAreEqual);
```

## Form Handling

### 1. Form Validation
```typescript
const exerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["STRENGTH", "ENDURANCE", "MOBILITY"]),
  difficulty: z.array(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]))
});

function ExerciseForm() {
  const onSubmit = async (data: z.infer<typeof exerciseSchema>) => {
    try {
      exerciseSchema.parse(data);
      await saveExercise(data);
    } catch (error) {
      handleValidationError(error);
    }
  };
}
```

### 2. Dynamic Forms
```typescript
function SetForm({ exerciseId }: { exerciseId: string }) {
  const [sets, setSets] = useState<SetFormData[]>([]);
  
  const addSet = () => {
    setSets(prev => [...prev, createEmptySet()]);
  };
  
  return (
    <div>
      {sets.map((set, index) => (
        <SetFormFields
          key={index}
          set={set}
          onChange={(data) => updateSet(index, data)}
        />
      ))}
      <Button onClick={addSet}>Add Set</Button>
    </div>
  );
}
```

## Performance Optimization

### 1. Code Splitting
```typescript
const ExerciseAnalytics = dynamic(() => 
  import('./ExerciseAnalytics'), {
    loading: () => <AnalyticsLoader />
  }
);
```

### 2. Image Optimization
```typescript
<Image
  src="/api/placeholder/400/320"
  alt="Exercise demonstration"
  width={400}
  height={320}
  className="rounded-lg"
  loading="lazy"
/>
```

### 3. Virtualization
```typescript
function ExerciseHistoryList({ workouts }: { workouts: Workout[] }) {
  return (
    <VirtualizedList
      height={400}
      itemCount={workouts.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <WorkoutHistoryItem
          workout={workouts[index]}
          style={style}
        />
      )}
    </VirtualizedList>
  );
}
```

## Testing Guidelines

### 1. Component Testing
```typescript
describe('ExerciseCard', () => {
  it('renders exercise details correctly', () => {
    const exercise = {
      name: 'Bench Press',
      type: 'STRENGTH',
      difficulty: ['INTERMEDIATE']
    };
    
    render(<ExerciseCard exercise={exercise} />);
    
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('STRENGTH')).toBeInTheDocument();
  });
});
```

### 2. Hook Testing
```typescript
describe('useWorkoutTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  it('increments timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer('123'));
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.elapsed).toBe(1);
  });
});
```

Follow these patterns to ensure consistent, maintainable, and performant frontend implementations.