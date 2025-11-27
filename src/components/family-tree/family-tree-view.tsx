'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  updateFamily,
} from '@/services/family';
import { Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FamilyTreeViewProps {
  family: Family;
}

export function FamilyTreeView({ family }: FamilyTreeViewProps) {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FamilyNode | null>(null);
  const [parentNode, setParentNode] = useState<FamilyNode | null>(null);
  const [activeNode, setActiveNode] = useState<FamilyNode | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const collectNodeIds = useCallback((nodes: FamilyNode[]): string[] => {
    return nodes.flatMap((node) => [node.id, ...collectNodeIds(node.sons)]);
  }, []);

  const allNodeIds = collectNodeIds(family.sons);

  const findNodeById = useCallback(
    (nodes: FamilyNode[], id: string): FamilyNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        const found = findNodeById(node.sons, id);
        if (found) return found;
      }
      return null;
    },
    []
  );

  const findParentNode = useCallback(
    (
      nodes: FamilyNode[],
      childId: string,
      parent: FamilyNode | null = null
    ): FamilyNode | null => {
      for (const node of nodes) {
        if (node.id === childId) return parent;
        const found = findParentNode(node.sons, childId, node);
        if (found !== undefined) return found;
      }
      return null;
    },
    []
  );

  const moveNode = useCallback(
    (nodes: FamilyNode[], activeId: string, overId: string): FamilyNode[] => {
      let movedNode: FamilyNode | null = null;

      const removeNode = (nodes: FamilyNode[]): FamilyNode[] => {
        return nodes.filter((node) => {
          if (node.id === activeId) {
            movedNode = node;
            return false;
          }
          node.sons = removeNode(node.sons);
          return true;
        });
      };

      const newNodes = removeNode(JSON.parse(JSON.stringify(nodes)));

      if (!movedNode) return nodes;

      const insertAfter = (nodes: FamilyNode[]): FamilyNode[] => {
        const result: FamilyNode[] = [];
        for (const node of nodes) {
          result.push(node);
          if (node.id === overId && movedNode) {
            result.push(movedNode);
          }
          node.sons = insertAfter(node.sons);
        }
        return result;
      };

      const overIndex = newNodes.findIndex((n) => n.id === overId);
      if (overIndex !== -1 && movedNode) {
        newNodes.splice(overIndex + 1, 0, movedNode);
        return newNodes;
      }

      return insertAfter(newNodes);
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const node = findNodeById(family.sons, active.id as string);
    setActiveNode(node);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNode(null);

    if (!over || active.id === over.id) return;

    const newSons = moveNode(
      family.sons,
      active.id as string,
      over.id as string
    );

    try {
      await updateFamily(family.id, { sons: newSons });
      router.refresh();
    } catch (error) {
      console.error('Error moving node:', error);
    }
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allNodeIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">{renderNodes(family.sons, 0)}</div>
          </SortableContext>

          <DragOverlay>
            {activeNode && (
              <div className="rounded-lg border bg-white p-3 shadow-lg dark:bg-zinc-900 opacity-90">
                <span className="font-medium">{activeNode.name}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
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
