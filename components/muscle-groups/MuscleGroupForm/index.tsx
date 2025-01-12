"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientLogger } from "@/lib/logger/client";
import {
  muscleGroupSchema,
  type MuscleGroupFormData,
} from "@/lib/schemas/muscle-group.schema";
import { Body } from "@/types/models";

export function MuscleGroupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    // watch,
    formState: { errors, isSubmitting },
  } = useForm<MuscleGroupFormData>({
    resolver: zodResolver(muscleGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      body: Body.Full,
    },
  });

  const onSubmit = async (data: MuscleGroupFormData) => {
    clientLogger.info("Submitting new muscle group", { data });

    try {
      const response = await fetch("/api/muscle-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create exercise");
      }

      const muscleGroup = await response.json();
      clientLogger.info("Muscle group created successfully:", muscleGroup);
      router.push("/muscle-groups");
      router.refresh();
    } catch (error) {
      clientLogger.error("Error creating muscle group", { error });
      throw error;
    }
  };

  // const selectedBody = watch("body");
  // clientLogger.info("Watched body:", {selectedBody});

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Muscle Group Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Muscle Group Name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <span className="text-sm text-destructive">
                  {errors.name.message}
                </span>
              )}
            </div>
            {/* Description field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Description"
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <span className="text-sm text-destructive">
                  {errors.description.message}
                </span>
              )}
            </div>
            {/* Body field */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Body Part
              </label>
              <Select
                onValueChange={(value) => {
                  setValue("body", value as Body);
                  // clientLogger.info("Watched value", {selectedBody});
                  // clientLogger.info("Changed value", {value});
                }}
                name="body"
              >
                <SelectTrigger id="body">
                  <SelectValue placeholder="Select Body Part" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Body).map((body) => (
                    <SelectItem key={body} value={body}>
                      {body}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.body && (
                <span className="text-sm text-destructive">
                  {errors.body.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/muscle-groups")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Muscle Group"}
        </Button>
      </div>
    </form>
  );
}