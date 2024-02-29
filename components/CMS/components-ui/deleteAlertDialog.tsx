import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/CMS/components-ui/shadcn/ui/alert-dialog";

function DeleteAlertDialog({
  openDeleteAlert,
  handleDeleteAlert,
  handleContinueDelete,
}: {
  openDeleteAlert: boolean;
  handleDeleteAlert: () => void;
  handleContinueDelete: () => void;
}) {
  return (
    <AlertDialog open={openDeleteAlert} onOpenChange={handleDeleteAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="!bg-cms-tertiary-color!dark:bg-gray-900">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="!dark:bg-gray-600 bg-cms-fourth-color"
            onClick={handleContinueDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlertDialog;
