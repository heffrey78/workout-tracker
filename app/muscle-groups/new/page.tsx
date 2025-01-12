import { MuscleGroupForm } from "../../../components/muscle-groups/MuscleGroupForm";
import logger from "../../../lib/logger";

export default async function NewMuscleGroupPage() {
  logger.info("Rendering new muscle group page");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">New Muscle Group</h1>
      <MuscleGroupForm />
    </div>
  );
}
