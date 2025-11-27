"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Family } from "@/models";

interface EditFamilyDialogProps {
  family: Family | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    family: Family,
    data: { name: string; description: string },
  ) => Promise<void>;
}

export function EditFamilyDialog({
  family,
  open,
  onOpenChange,
  onSubmit,
}: EditFamilyDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (family) {
      setName(family.name);
      setDescription(family.description || "");
    }
  }, [family]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!family || !name.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(family, {
        name: name.trim(),
        description: description.trim(),
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      setDescription("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar familia</DialogTitle>
            <DialogDescription>
              Modifica los datos de la familia.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                placeholder="Ej: Familia García"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                placeholder="Descripción opcional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
