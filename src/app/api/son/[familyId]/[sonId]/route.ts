import { NextResponse } from "next/server";
import type { FamilyNode } from "@/models";
import { CreateNodeSchema, UpdateNodeSchema } from "@/schemas";
import { getFamilyFb, updateFamilyFb } from "@/services/firebase";
import {
  addChildToNode,
  deleteNodeById,
  findNodeById,
  updateNodeById,
} from "@/utils";
import { parseJsonBody } from "@/utils/api";

type Params = { params: Promise<{ familyId: string; sonId: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { familyId, sonId } = await params;

    if (!familyId || !sonId) {
      return NextResponse.json(
        { error: "Parámetros familyId y sonId son requeridos" },
        { status: 400 },
      );
    }

    const family = await getFamilyFb(familyId);

    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${familyId}` },
        { status: 404 },
      );
    }

    const parentNode = findNodeById(family.sons, sonId);

    if (!parentNode) {
      return NextResponse.json(
        {
          error: `No se encontró el nodo padre con id: ${sonId} en la familia ${familyId}`,
        },
        { status: 404 },
      );
    }

    const validation = await parseJsonBody(request, CreateNodeSchema);

    if (!validation.success) {
      return validation.response;
    }

    const { birthdate, ...rest } = validation.data;
    const newNode: FamilyNode = {
      ...rest,
      id: crypto.randomUUID(),
      sons: [],
      birthdate: birthdate ? new Date(birthdate) : new Date(),
      createdAt: new Date(),
    };

    const updatedSons = addChildToNode(family.sons, sonId, newNode);

    await updateFamilyFb(familyId, { sons: updatedSons });

    return NextResponse.json(
      { message: "Nodo creado exitosamente", id: newNode.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Error al crear el nodo" },
      { status: 500 },
    );
  }
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { familyId, sonId } = await params;
    if (!familyId || !sonId) {
      return NextResponse.json(
        { error: "Parámetros familyId y sonId son requeridos" },
        { status: 400 },
      );
    }
    const family = await getFamilyFb(familyId);
    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${familyId}` },
        { status: 404 },
      );
    }

    const node = findNodeById(family.sons, sonId);

    if (!node) {
      return NextResponse.json(
        {
          error: `No se encontró el hijo con id: ${sonId} en la familia ${familyId}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: node }, { status: 200 });
  } catch (error) {
    console.error("Error fetching family:", error);
    return NextResponse.json(
      { error: "Error al obtener la familia" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { familyId, sonId } = await params;

    if (!familyId || !sonId) {
      return NextResponse.json(
        { error: "Parámetros familyId y sonId son requeridos" },
        { status: 400 },
      );
    }

    const family = await getFamilyFb(familyId);

    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${familyId}` },
        { status: 404 },
      );
    }

    const existingNode = findNodeById(family.sons, sonId);

    if (!existingNode) {
      return NextResponse.json(
        {
          error: `No se encontró el hijo con id: ${sonId} en la familia ${familyId}`,
        },
        { status: 404 },
      );
    }

    const validation = await parseJsonBody(request, UpdateNodeSchema);

    if (!validation.success) {
      return validation.response;
    }

    const { birthdate, ...rest } = validation.data;
    const updates = {
      ...rest,
      ...(birthdate && { birthdate: new Date(birthdate) }),
    };

    const updatedSons = updateNodeById(family.sons, sonId, updates);

    await updateFamilyFb(familyId, { sons: updatedSons });

    return NextResponse.json(
      { message: "Nodo actualizado exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating node:", error);
    return NextResponse.json(
      { error: "Error al actualizar el nodo" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { familyId, sonId } = await params;

    if (!familyId || !sonId) {
      return NextResponse.json(
        { error: "Parámetros familyId y sonId son requeridos" },
        { status: 400 },
      );
    }

    const family = await getFamilyFb(familyId);

    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${familyId}` },
        { status: 404 },
      );
    }

    const existingNode = findNodeById(family.sons, sonId);

    if (!existingNode) {
      return NextResponse.json(
        {
          error: `No se encontró el hijo con id: ${sonId} en la familia ${familyId}`,
        },
        { status: 404 },
      );
    }

    const updatedSons = deleteNodeById(family.sons, sonId);

    await updateFamilyFb(familyId, { sons: updatedSons });

    return NextResponse.json(
      { message: "Nodo eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting node:", error);
    return NextResponse.json(
      { error: "Error al eliminar el nodo" },
      { status: 500 },
    );
  }
}
