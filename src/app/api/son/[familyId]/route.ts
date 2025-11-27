import { NextResponse } from 'next/server';
import { getFamilyFb, updateFamilyFb } from '@/services/firebase';
import { CreateNodeSchema } from '@/schemas';
import { parseJsonBody } from '@/utils/api';
import type { FamilyNode } from '@/models';

type Params = { params: Promise<{ familyId: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { familyId } = await params;

    if (!familyId) {
      return NextResponse.json(
        { error: 'Parámetro familyId es requerido' },
        { status: 400 }
      );
    }

    const family = await getFamilyFb(familyId);

    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${familyId}` },
        { status: 404 }
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

    const updatedSons = [...family.sons, newNode];

    await updateFamilyFb(familyId, { sons: updatedSons });

    return NextResponse.json(
      { message: 'Nodo creado exitosamente', id: newNode.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json(
      { error: 'Error al crear el nodo' },
      { status: 500 }
    );
  }
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { familyId } = await params;

    if (!familyId) {
      return NextResponse.json(
        { error: 'Parámetro familyId es requerido' },
        { status: 400 }
      );
    }

    const family = await getFamilyFb(familyId);

    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${familyId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: family.sons }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sons:', error);
    return NextResponse.json(
      { error: 'Error al obtener los hijos' },
      { status: 500 }
    );
  }
}
