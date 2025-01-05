"use client";

import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useReducer, useEffect } from "react";

import { clientLogger } from "../../../lib/logger/client";
import type { Exercise } from "../../../types/models";
import {
  ExerciseType,
  DifficultyType,
  MuscleGroup,
} from "../../../types/models";
import { Alert, AlertDescription } from "../../ui/alert";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

// State Management
interface FilterState {
  type: ExerciseType | null;
  difficulty: DifficultyType | null;
  body: MuscleGroup | null;
}

interface State {
  exercises: Exercise[];
  filters: FilterState;
  searchQuery: string;
  view: "grid" | "list";
  loading: boolean;
  error: string | null;
}

type Action =
  | {
      type: "SET_FILTER";
      payload: {
        key: keyof FilterState;
        value: ExerciseType | DifficultyType | MuscleGroup | null;
      };
    }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_VIEW"; payload: "grid" | "list" }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_EXERCISES"; payload: Exercise[] };

const initialState: State = {
  exercises: [],
  filters: {
    type: null,
    difficulty: null,
    body: null,
  },
  searchQuery: "",
  view: "grid",
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    case "SET_SEARCH":
      return {
        ...state,
        searchQuery: action.payload,
      };
    case "SET_VIEW":
      return {
        ...state,
        view: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_EXERCISES":
      return {
        ...state,
        exercises: action.payload,
      };
    default:
      return state;
  }
}

// Components
const FilterSection = ({
  dispatch,
  filters,
}: {
  dispatch: React.Dispatch<Action>;
  filters: FilterState;
}) => (
  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Filter className="w-4 h-4" />
      <h3 className="font-medium">Filters</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select
        value={filters.type || "all"}
        onValueChange={(value: string) =>
          dispatch({
            type: "SET_FILTER",
            payload: {
              key: "type",
              value: value === "all" ? null : (value as ExerciseType),
            },
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Exercise Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.values(ExerciseType).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.difficulty || "all"}
        onValueChange={(value: string) =>
          dispatch({
            type: "SET_FILTER",
            payload: {
              key: "difficulty",
              value: value === "all" ? null : (value as DifficultyType),
            },
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {Object.values(DifficultyType).map((difficulty) => (
            <SelectItem key={difficulty} value={difficulty}>
              {difficulty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.body || "all"}
        onValueChange={(value: string) =>
          dispatch({
            type: "SET_FILTER",
            payload: {
              key: "body",
              value: value === "all" ? null : (value as MuscleGroup),
            },
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Body Part" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Body Parts</SelectItem>
          {Object.values(MuscleGroup).map((group) => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
  <Card className="h-full hover:border-blue-200 transition-colors">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex flex-col">
        <h3 className="font-semibold">{exercise.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Tag className="w-3 h-3" />
          <span>{exercise.type}</span>
          {exercise.lastUsedAt && (
            <span className="text-xs">
              Last used: {new Date(exercise.lastUsedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-500" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {exercise.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {exercise.difficulty.map((diff) => (
          <span
            key={diff}
            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
          >
            {diff}
          </span>
        ))}
        {exercise.muscleGroups.map((muscle) => (
          <span
            key={muscle}
            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
          >
            {muscle}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Component
export default function ExerciseList() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { exercises, filters, searchQuery, view, error, loading } = state;

  useEffect(() => {
    const fetchExercises = async () => {
      clientLogger.info("Fetching exercises", { filters, searchQuery });
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const params = new URLSearchParams();
        if (filters.type) params.append("type", filters.type);
        if (filters.difficulty) params.append("difficulty", filters.difficulty);
        if (filters.body) params.append("body", filters.body);
        if (searchQuery) params.append("search", searchQuery);

        const response = await fetch(`/api/exercises?${params}`);
        if (!response.ok) throw new Error("Failed to fetch exercises");

        const data = await response.json();
        dispatch({ type: "SET_EXERCISES", payload: data });
      } catch (error) {
        clientLogger.error("Error fetching exercises", { error });
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load exercises. Please try again.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchExercises();
  }, [filters, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Exercises</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push("/exercises/new")}
        >
          <Plus className="w-4 h-4" />
          New Exercise
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW", payload: "grid" })}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW", payload: "list" })}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FilterSection dispatch={dispatch} filters={filters} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading exercises...
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}

      {!loading && exercises.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No exercises found matching your criteria
        </div>
      )}
    </div>
  );
}
