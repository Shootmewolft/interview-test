import type { FamilyNode } from '@/models';

export function findNodeById(
  nodes: FamilyNode[],
  nodeId: string
): FamilyNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.sons.length > 0) {
      const found = findNodeById(node.sons, nodeId);
      if (found) return found;
    }
  }
  return null;
}

export function updateNodeById(
  nodes: FamilyNode[],
  nodeId: string,
  updates: Partial<FamilyNode>
): FamilyNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...updates };
    }
    if (node.sons.length > 0) {
      return {
        ...node,
        sons: updateNodeById(node.sons, nodeId, updates),
      };
    }
    return node;
  });
}

export function deleteNodeById(
  nodes: FamilyNode[],
  nodeId: string
): FamilyNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      sons: deleteNodeById(node.sons, nodeId),
    }));
}

export function addChildToNode(
  nodes: FamilyNode[],
  parentId: string,
  newChild: FamilyNode
): FamilyNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        sons: [...node.sons, newChild],
      };
    }
    if (node.sons.length > 0) {
      return {
        ...node,
        sons: addChildToNode(node.sons, parentId, newChild),
      };
    }
    return node;
  });
}

export function countSons(nodes: FamilyNode[]): number {
  let count = 0;
  for (const node of nodes) {
    count += 1;
    if (node.sons.length > 0) {
      count += countSons(node.sons);
    }
  }
  return count;
}
