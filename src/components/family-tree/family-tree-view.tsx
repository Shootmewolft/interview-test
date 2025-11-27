'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TreeNode } from './tree-node';
import { CreateNodeDialog } from './create-node-dialog';
import { EditNodeDialog } from './edit-node-dialog';
import { DeleteNodeDialog } from './delete-node-dialog';
import type {
  Family,
  FamilyNode,
  CreateNodeInput,
  UpdateNodeInput,
} from '@/models';
import {
  createRootNode,
  createChildNode,
  updateNode,
  deleteNode,
} from '@/services/family';
import { Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FamilyTreeViewProps {
  family: Family;
}

// TODO: Implement drag-and-drop functionality for reordering nodes
export function FamilyTreeView({ family }: FamilyTreeViewProps) {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FamilyNode | null>(null);
  const [parentNode, setParentNode] = useState<FamilyNode | null>(null);

  const collectNodeIds = useCallback((nodes: FamilyNode[]): string[] => {
    return nodes.flatMap((node) => [node.id, ...collectNodeIds(node.sons)]);
  }, []);

  const allNodeIds = collectNodeIds(family.sons);

  const handleAddRoot = () => {
    setParentNode(null);
    setCreateDialogOpen(true);
  };

  const handleAddChild = (parent: FamilyNode) => {
    setParentNode(parent);
    setCreateDialogOpen(true);
  };

  const handleEdit = (node: FamilyNode) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  };

  const handleDelete = (node: FamilyNode) => {
    setSelectedNode(node);
    setDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateNodeInput) => {
    if (parentNode) {
      await createChildNode(family.id, parentNode.id, data);
    } else {
      await createRootNode(family.id, data);
    }
    router.refresh();
  };

  const handleEditSubmit = async (nodeId: string, data: UpdateNodeInput) => {
    await updateNode(family.id, nodeId, data);
    router.refresh();
  };

  const handleDeleteConfirm = async (nodeId: string) => {
    await deleteNode(family.id, nodeId);
    router.refresh();
  };

  const renderNodes = (nodes: FamilyNode[], depth: number) => {
    return nodes.map((node) => (
      <TreeNode
        key={node.id}
        node={node}
        depth={depth}
        familyId={family.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddChild={handleAddChild}
        renderChildren={renderNodes}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-500">
          <Users className="h-4 w-4" />
          <span className="text-sm">{allNodeIds.length} miembro(s)</span>
        </div>
        <Button onClick={handleAddRoot} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar miembro
        </Button>
      </div>

      {family.sons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800 mb-4">
            <Users className="h-8 w-8 text-zinc-400" />
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            No hay miembros en esta familia
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
            Agrega el primer miembro para comenzar el árbol
          </p>
          <Button onClick={handleAddRoot}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar primer miembro
          </Button>
        </div>
      ) : (
        <div className="space-y-2">{renderNodes(family.sons, 0)}</div>
      )}

      <CreateNodeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        parentName={parentNode?.name}
      />

      <EditNodeDialog
        node={selectedNode}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditSubmit}
      />

      <DeleteNodeDialog
        node={selectedNode}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
