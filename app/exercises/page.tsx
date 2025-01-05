import { Suspense } from "react";

import ExerciseList from "../../components/exercises/ExerciseList";

export default function ExercisesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExerciseList />
    </Suspense>
  );
}
