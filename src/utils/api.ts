import { NextResponse } from 'next/server';
import * as v from 'valibot';

/**
 * Resultado de una operación de validación.
 * @template T - Tipo de datos validados
 */
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

/**
 * Representa un problema de validación encontrado en los datos.
 */
interface ValidationIssue {
  /** Ruta del campo que falló la validación (ej: "sons.0.name") */
  path: string;
  /** Mensaje descriptivo del error */
  message: string;
}

/**
 * Valida datos contra un schema de Valibot y retorna una respuesta formateada para API.
 *
 * @template T - Tipo de datos que el schema espera producir
 * @param schema - Schema de Valibot para validar los datos
 * @param data - Datos a validar (típicamente del body o params de un request)
 * @returns Objeto con `success: true` y `data` si la validación pasa,
 *          o `success: false` y `response` con NextResponse de error 400
 *
 * @example
 * ```typescript
 * const validation = validateSchema(UserSchema, { name: "John", age: 25 });
 *
 * if (!validation.success) {
 *   return validation.response; // NextResponse con status 400
 * }
 *
 * // validation.data está tipado correctamente
 * console.log(validation.data.name);
 * ```
 */
export function validateSchema<T>(
  schema: v.GenericSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = v.safeParse(schema, data);

  if (!result.success) {
    const issues: ValidationIssue[] = result.issues.map((issue) => ({
      path: issue.path?.map((p) => p.key).join('.') ?? 'root',
      message: issue.message,
    }));

    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Error de validación',
          details: issues,
        },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.output };
}

/**
 * Parsea el cuerpo JSON de un request y lo valida contra un schema de Valibot.
 *
 * Combina el parseo de JSON y la validación en una sola operación,
 * manejando errores de sintaxis JSON de forma apropiada.
 *
 * @template T - Tipo de datos que el schema espera producir
 * @param request - Objeto Request de la API (Next.js/Web API)
 * @param schema - Schema de Valibot para validar el body parseado
 * @returns Promise con `success: true` y `data` si todo es válido,
 *          o `success: false` y `response` con error 400
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const validation = await parseJsonBody(request, CreateUserSchema);
 *
 *   if (!validation.success) {
 *     return validation.response;
 *   }
 *
 *   const { name, email } = validation.data;
 *   // Procesar datos validados...
 * }
 * ```
 *
 * @throws Re-lanza errores que no sean SyntaxError (errores inesperados)
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: v.GenericSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    return validateSchema(schema, body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'El cuerpo de la petición no es un JSON válido' },
          { status: 400 }
        ),
      };
    }
    throw error;
  }
}
