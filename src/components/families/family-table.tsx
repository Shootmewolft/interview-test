'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Family } from '@/models';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { countSons } from '@/utils';
import { APP_ROUTES } from '@/consts';

interface FamilyTableProps {
  families: Family[];
  onEdit: (family: Family) => void;
  onDelete: (family: Family) => void;
}

export function FamilyTable({ families, onEdit, onDelete }: FamilyTableProps) {
  if (families.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          No hay familias registradas
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Crea una nueva familia para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-center">Miembros</TableHead>
            <TableHead className="text-center">Creado</TableHead>
            <TableHead className="text-right w-[150px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {families.map((family) => (
            <TableRow key={family.id}>
              <TableCell className="font-medium">{family.name}</TableCell>
              <TableCell className="text-zinc-500 dark:text-zinc-400">
                {family.description || '—'}
              </TableCell>
              <TableCell className="text-center">
                {countSons(family.sons)}
              </TableCell>
              <TableCell className="text-center text-zinc-500 dark:text-zinc-400">
                {new Date(family.createdAt).toLocaleDateString('es-ES')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Ver detalles"
                  >
                    <Link href={APP_ROUTES.FAMILY(family.id)}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(family)}
                    title="Editar familia"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(family)}
                    title="Eliminar familia"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
