"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Family } from "@/models";
import { createFamily, deleteFamily, updateFamily } from "@/services/family";
import { CreateFamilyDialog } from "./create-family-dialog";
import { DeleteFamilyDialog } from "./delete-family-dialog";
import { EditFamilyDialog } from "./edit-family-dialog";
import { FamilyTable } from "./family-table";

interface FamiliesViewProps {
  initialFamilies: Family[];
}

export function FamiliesView({ initialFamilies }: FamiliesViewProps) {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const handleCreate = async (data: { name: string; description: string }) => {
    await createFamily({
      name: data.name,
      description: data.description,
      sons: [],
    });
    router.refresh();
  };

  const handleEdit = (family: Family) => {
    setSelectedFamily(family);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (
    family: Family,
    data: { name: string; description: string },
  ) => {
    await updateFamily(family.id, {
      name: data.name,
      description: data.description,
    });
    router.refresh();
  };

  const handleDelete = (family: Family) => {
    setSelectedFamily(family);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (family: Family) => {
    await deleteFamily(family.id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Familias</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Gestiona las familias y sus miembros
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva familia
        </Button>
      </div>

      <FamilyTable
        families={initialFamilies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateFamilyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />

      <EditFamilyDialog
        family={selectedFamily}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditSubmit}
      />

      <DeleteFamilyDialog
        family={selectedFamily}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
