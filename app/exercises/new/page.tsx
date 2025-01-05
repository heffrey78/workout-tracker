import { ExerciseForm } from "../../../components/exercises/ExerciseForm";
import logger from "../../../lib/logger";

export default async function NewExercisePage() {
  logger.info("Rendering new exercise page");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">New Exercise</h1>
      <ExerciseForm />
    </div>
  );
}
