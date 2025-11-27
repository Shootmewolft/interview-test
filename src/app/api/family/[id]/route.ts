import { NextResponse } from 'next/server';
import {
  getFamilyFb,
  updateFamilyFb,
  deleteFamilyFb,
} from '@/services/firebase';
import { IdParamSchema, PutFamilySchema } from '@/schemas';
import { validateSchema, parseJsonBody } from '@/utils';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const paramValidation = validateSchema(IdParamSchema, await params);

    if (!paramValidation.success) {
      return paramValidation.response;
    }

    const { id } = paramValidation.data;
    const family = await getFamilyFb(id);

    if (!family) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: family }, { status: 200 });
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json(
      { error: 'Error al obtener la familia' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const paramValidation = validateSchema(IdParamSchema, await params);

    if (!paramValidation.success) {
      return paramValidation.response;
    }

    const { id } = paramValidation.data;
    const existingFamily = await getFamilyFb(id);

    if (!existingFamily) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${id}` },
        { status: 404 }
      );
    }

    const bodyValidation = await parseJsonBody(request, PutFamilySchema);

    if (!bodyValidation.success) {
      return bodyValidation.response;
    }

    const { name, sons, description } = bodyValidation.data;

    await updateFamilyFb(id, {
      name,
      sons,
      description,
    });

    return NextResponse.json(
      { message: 'Familia actualizada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la familia' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const paramValidation = validateSchema(IdParamSchema, await params);

    if (!paramValidation.success) {
      return paramValidation.response;
    }

    const { id } = paramValidation.data;
    const existingFamily = await getFamilyFb(id);

    if (!existingFamily) {
      return NextResponse.json(
        { error: `No se encontró la familia con id: ${id}` },
        { status: 404 }
      );
    }

    await deleteFamilyFb(id);

    return NextResponse.json(
      { message: 'Familia eliminada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la familia' },
      { status: 500 }
    );
  }
}
