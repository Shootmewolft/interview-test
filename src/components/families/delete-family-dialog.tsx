'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Family } from '@/models';

interface DeleteFamilyDialogProps {
  family: Family | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (family: Family) => Promise<void>;
}

export function DeleteFamilyDialog({
  family,
  open,
  onOpenChange,
  onConfirm,
}: DeleteFamilyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!family) return;

    setIsLoading(true);
    try {
      await onConfirm(family);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar familia</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar la familia{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {family?.name}
            </span>
            ? Esta acción no se puede deshacer y se eliminarán todos los
            miembros asociados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
