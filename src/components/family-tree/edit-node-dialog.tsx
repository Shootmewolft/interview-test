'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FamilyNode, UpdateNodeInput } from '@/models';

interface EditNodeDialogProps {
  node: FamilyNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (nodeId: string, data: UpdateNodeInput) => Promise<void>;
}

export function EditNodeDialog({
  node,
  open,
  onOpenChange,
  onSubmit,
}: EditNodeDialogProps) {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [description, setDescription] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (node) {
      setName(node.name);
      setDni(String(node.dni));
      setDescription(node.description || '');
      const date = new Date(node.birthdate);
      setBirthdate(date.toISOString().split('T')[0]);
    }
  }, [node]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!node || !name.trim() || !dni || !birthdate) return;

    setIsLoading(true);
    try {
      await onSubmit(node.id, {
        name: name.trim(),
        dni: Number(dni),
        description: description.trim() || undefined,
        birthdate: new Date(birthdate),
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar miembro</DialogTitle>
            <DialogDescription>
              Modifica los datos del miembro de la familia
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-node-name">Nombre completo</Label>
              <Input
                id="edit-node-name"
                placeholder="Ej: Juan García López"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-node-dni">DNI</Label>
              <Input
                id="edit-node-dni"
                type="number"
                placeholder="12345678"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-node-birthdate">Fecha de nacimiento</Label>
              <Input
                id="edit-node-birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-node-description">
                Descripción (opcional)
              </Label>
              <Input
                id="edit-node-description"
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
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
