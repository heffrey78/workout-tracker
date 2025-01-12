"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "./button";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md">
          <Dialog.Title className="font-semibold text-lg mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            {description}
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
