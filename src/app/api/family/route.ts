import { NextResponse } from 'next/server';
import { createFamilyFb, getAllFamiliesFb } from '@/services/firebase';
import { FamilySchema } from '@/schemas';
import { parseJsonBody } from '@/utils/api';

export async function GET() {
  try {
    const families = await getAllFamiliesFb();
    return NextResponse.json({ data: families }, { status: 200 });
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Error al obtener las familias' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const validation = await parseJsonBody(request, FamilySchema);

    if (!validation.success) {
      return validation.response;
    }

    const { name, sons, description } = validation.data;

    const id = await createFamilyFb({
      name,
      sons,
      description,
    });

    return NextResponse.json(
      { message: 'Familia creada exitosamente', id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Error al crear la familia' },
      { status: 500 }
    );
  }
}
