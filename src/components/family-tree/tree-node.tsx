"use client";

import { ChevronRight, Eye, Pencil, Plus, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { APP_ROUTES } from "@/consts";
import type { FamilyNode } from "@/models";
import { cn } from "@/utils";

interface TreeNodeProps {
  node: FamilyNode;
  depth: number;
  familyId: string;
  onEdit: (node: FamilyNode) => void;
  onDelete: (node: FamilyNode) => void;
  onAddChild: (parentNode: FamilyNode) => void;
  renderChildren: (nodes: FamilyNode[], depth: number) => React.ReactNode;
}

export function TreeNode({
  node,
  depth,
  familyId,
  onEdit,
  onDelete,
  onAddChild,
  renderChildren,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.sons.length > 0;

  return (
    <div className="relative">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "group flex items-center gap-2 rounded-lg border bg-white p-3 dark:bg-zinc-900",
            "hover:border-zinc-300 dark:hover:border-zinc-700",
            "transition-colors",
          )}
          style={{ marginLeft: depth * 24 }}
        >
          {/* Expand/Collapse button */}
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          ) : (
            <div className="w-6" />
          )}

          {/* User icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <User className="h-4 w-4 text-zinc-500" />
          </div>

          {/* Node info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{node.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>DNI: {node.dni}</span>
              {node.description && (
                <>
                  <span>•</span>
                  <span className="truncate">{node.description}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              asChild
              title="Ver detalles"
            >
              <Link href={APP_ROUTES.SON(familyId, node.id)}>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onAddChild(node)}
              title="Agregar hijo"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(node)}
              title="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => onDelete(node)}
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && (
          <CollapsibleContent className="mt-2 space-y-2">
            {renderChildren(node.sons, depth + 1)}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
