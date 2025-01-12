"use client";

import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MuscleGroup } from "@/types/models";

export function MuscleGroupList({
  muscleGroups,
}: {
  muscleGroups: MuscleGroup[];
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/muscle-groups", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete muscle group:", error);
    }
  };

  return (
    <>
      <ConfirmationDialog
        title="Delete Muscle Group"
        description="Are you sure you want to delete this muscle group? This action cannot be undone."
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {muscleGroups.map((muscleGroup) => (
          <Card
            key={muscleGroup.id}
            className="h-full hover:border-blue-200 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col">
                <h3 className="font-semibold">{muscleGroup.name}</h3>
                <p className="text-sm text-gray-500">{muscleGroup.body}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-gray-100 rounded-full p-1">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/muscle-groups/${muscleGroup.id}/edit`)
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => setDeleteId(muscleGroup.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {muscleGroup.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {muscleGroup.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
