import type { FamilyNode } from '@/models';

/**
 * Busca un nodo por su ID dentro de un árbol de nodos de forma recursiva.
 * @param nodes - Array de nodos donde buscar.
 * @param nodeId - ID del nodo a buscar.
 * @returns El nodo encontrado o null si no existe.
 * @example
 * const node = findNodeById(familyTree, 'abc123');
 * if (node) {
 *   console.log(node.name);
 * }
 */
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

/**
 * Actualiza un nodo específico por su ID con los datos proporcionados.
 * Realiza la actualización de forma inmutable, devolviendo un nuevo array.
 * @param nodes - Array de nodos donde buscar y actualizar.
 * @param nodeId - ID del nodo a actualizar.
 * @param updates - Objeto parcial con los campos a actualizar.
 * @returns Nuevo array de nodos con el nodo actualizado.
 * @example
 * const updatedNodes = updateNodeById(nodes, 'abc123', { name: 'Nuevo Nombre' });
 */
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

/**
 * Elimina un nodo por su ID del árbol de nodos de forma recursiva.
 * También busca y elimina el nodo en todos los niveles de anidación.
 * @param nodes - Array de nodos donde buscar y eliminar.
 * @param nodeId - ID del nodo a eliminar.
 * @returns Nuevo array de nodos sin el nodo eliminado.
 * @example
 * const nodesWithoutDeleted = deleteNodeById(nodes, 'abc123');
 */
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

/**
 * Añade un nuevo nodo hijo a un nodo padre específico.
 * Busca el padre de forma recursiva en todo el árbol.
 * @param nodes - Array de nodos donde buscar el padre.
 * @param parentId - ID del nodo padre donde añadir el hijo.
 * @param newChild - Nuevo nodo hijo a añadir.
 * @returns Nuevo array de nodos con el hijo añadido al padre.
 * @example
 * const newNode: FamilyNode = { id: 'new123', name: 'Hijo', sons: [] };
 * const updatedNodes = addChildToNode(nodes, 'parent123', newNode);
 */
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

/**
 * Cuenta el número total de nodos en un árbol de forma recursiva.
 * Incluye todos los nodos en todos los niveles de anidación.
 * @param nodes - Array de nodos a contar.
 * @returns Número total de nodos en el árbol.
 * @example
 * const totalNodes = countSons(familyTree);
 * console.log(`Total de miembros: ${totalNodes}`);
 */
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
