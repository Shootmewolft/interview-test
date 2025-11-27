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
import type { FamilyNode } from '@/models';

interface DeleteNodeDialogProps {
  node: FamilyNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (nodeId: string) => Promise<void>;
}

export function DeleteNodeDialog({
  node,
  open,
  onOpenChange,
  onConfirm,
}: DeleteNodeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!node) return;

    setIsLoading(true);
    try {
      await onConfirm(node.id);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChildren = node && node.sons.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar miembro</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {node?.name}
            </span>
            ?
            {hasChildren && (
              <span className="block mt-2 text-amber-600 dark:text-amber-400">
                ⚠️ Este miembro tiene {node.sons.length} hijo(s). También serán
                eliminados.
              </span>
            )}
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
