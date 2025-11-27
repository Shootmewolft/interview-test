'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Family, FamilyNode, CustomField } from '@/models';
import { updateNode } from '@/services/family';
import { ArrowLeft, Plus, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

interface NodeEditorProps {
  family: Family;
  node: FamilyNode;
}

export function NodeEditor({ family, node }: NodeEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [name, setName] = useState(node.name);
  const [dni, setDni] = useState(String(node.dni));
  const [description, setDescription] = useState(node.description || '');
  const [birthdate, setBirthdate] = useState(
    new Date(node.birthdate).toISOString().split('T')[0]
  );
  const [customFields, setCustomFields] = useState<CustomField[]>(
    node.customFields || []
  );
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateNode(family.id, node.id, {
        name,
        dni: Number(dni),
        description: description || undefined,
        birthdate: new Date(birthdate),
        customFields: customFields.length > 0 ? customFields : undefined,
      });
      toast.success('Cambios guardados correctamente');
      router.refresh();
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const newField: CustomField = {
      id: crypto.randomUUID(),
      label: newFieldLabel.trim(),
      type: newFieldType,
      value: newFieldType === 'color' ? '#000000' : '',
    };

    setCustomFields([...customFields, newField]);
    setNewFieldLabel('');
    setNewFieldType('text');
    setAddFieldDialogOpen(false);
  };

  const handleUpdateField = (fieldId: string, value: string) => {
    setCustomFields(
      customFields.map((f) => (f.id === fieldId ? { ...f, value } : f))
    );
  };

  const handleRemoveField = (fieldId: string) => {
    setCustomFields(customFields.filter((f) => f.id !== fieldId));
  };

  const renderFieldInput = (field: CustomField) => {
    switch (field.type) {
      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={field.value || '#000000'}
              onChange={(e) => handleUpdateField(field.id, e.target.value)}
              className="w-14 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={field.value}
              onChange={(e) => handleUpdateField(field.id, e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            value={field.value}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
          />
        );
      case 'range':
        return (
          <div className="flex items-center gap-3">
            <Input
              type="range"
              min="0"
              max="100"
              value={field.value || '50'}
              onChange={(e) => handleUpdateField(field.id, e.target.value)}
              className="flex-1"
            />
            <span className="text-sm font-medium w-10 text-center">
              {field.value || '50'}
            </span>
          </div>
        );
      default:
        return (
          <Input
            type="text"
            value={field.value}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
            placeholder={`Ingresa ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/${family.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {family.name}
                </p>
                <h1 className="text-2xl font-bold tracking-tight">
                  {node.name}
                </h1>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Info Card */}
            <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Información personal
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    type="number"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción opcional"
                  />
                </div>
              </div>
            </div>

            {/* Children Card */}
            <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold mb-4">
                Hijos ({node.sons.length})
              </h2>
              {node.sons.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400">
                  No tiene hijos registrados
                </p>
              ) : (
                <ul className="space-y-2">
                  {node.sons.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/${family.id}/${child.id}`}
                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <User className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="font-medium">{child.name}</p>
                          <p className="text-xs text-zinc-500">
                            DNI: {child.dni}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Custom Fields Card */}
            <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Campos personalizados</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddFieldDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar campo
                </Button>
              </div>

              {customFields.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                  No hay campos personalizados. Agrega uno para comenzar.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">{field.label}</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleRemoveField(field.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {renderFieldInput(field)}
                      <p className="text-xs text-zinc-400">
                        Tipo: {field.type}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Dialog */}
      <Dialog open={addFieldDialogOpen} onOpenChange={setAddFieldDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar campo personalizado</DialogTitle>
            <DialogDescription>
              Crea un nuevo campo para almacenar información adicional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-label">Nombre del campo</Label>
              <Input
                id="field-label"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Ej: Color favorito, Ocupación, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-type">Tipo de campo</Label>
              <Select
                value={newFieldType}
                onValueChange={(v) => setNewFieldType(v as CustomField['type'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="color">Color</SelectItem>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="range">Rango (0-100)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddFieldDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddField} disabled={!newFieldLabel.trim()}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
