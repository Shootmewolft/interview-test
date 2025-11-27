"use client";

import { useState } from "react";
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
import type { CreateNodeInput } from "@/models";

interface CreateNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateNodeInput) => Promise<void>;
  parentName?: string;
}

export function CreateNodeDialog({
  open,
  onOpenChange,
  onSubmit,
  parentName,
}: CreateNodeDialogProps) {
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [description, setDescription] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dni || !birthdate) return;

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        dni: Number(dni),
        description: description.trim() || undefined,
        birthdate: new Date(birthdate),
      });
      resetForm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDni("");
    setDescription("");
    setBirthdate("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {parentName ? `Agregar hijo de ${parentName}` : "Agregar miembro"}
            </DialogTitle>
            <DialogDescription>
              {parentName
                ? `Este miembro será hijo de ${parentName}`
                : "Agrega el primer miembro de la familia"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="node-name">Nombre completo</Label>
              <Input
                id="node-name"
                placeholder="Ej: Juan García López"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-dni">DNI</Label>
              <Input
                id="node-dni"
                type="number"
                placeholder="12345678"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-birthdate">Fecha de nacimiento</Label>
              <Input
                id="node-birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-description">Descripción (opcional)</Label>
              <Input
                id="node-description"
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
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !dni || !birthdate}
            >
              {isLoading ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
