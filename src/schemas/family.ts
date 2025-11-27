import * as v from "valibot";
import type { FamilyNode } from "@/models";

export const CustomFieldSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty("El id del campo es requerido")),
  type: v.picklist(
    ["text", "color", "range", "date"],
    "El tipo debe ser 'text', 'color', 'range' o 'date'",
  ),
  label: v.pipe(v.string(), v.nonEmpty("El label es requerido")),
  value: v.string(),
});

export const FamilyNodeSchema: v.GenericSchema<FamilyNode> = v.object({
  id: v.pipe(v.string(), v.uuid("El id debe ser un UUID válido")),
  name: v.pipe(
    v.string(),
    v.nonEmpty("El nombre del nodo es requerido"),
    v.trim(),
  ),
  dni: v.pipe(
    v.number(),
    v.integer("El DNI debe ser un número entero"),
    v.minValue(1, "El DNI debe ser un número positivo"),
  ),
  description: v.optional(v.pipe(v.string(), v.trim())),
  customFields: v.optional(v.array(CustomFieldSchema)),
  sons: v.lazy(() => v.array(FamilyNodeSchema)),
  birthdate: v.optional(v.date()),
  createdAt: v.optional(v.date()),
}) as v.GenericSchema<FamilyNode>;

export const FamilySchema = v.object({
  name: v.pipe(
    v.string("El campo 'name' debe ser un texto"),
    v.nonEmpty("El campo 'name' es requerido"),
    v.trim(),
  ),
  description: v.optional(v.pipe(v.string(), v.trim()), ""),
  sons: v.array(FamilyNodeSchema, "El campo 'sons' debe ser un array"),
});

export const PutFamilySchema = v.pipe(
  v.object({
    name: v.optional(
      v.pipe(
        v.string("El campo 'name' debe ser un texto"),
        v.nonEmpty("El campo 'name' no puede estar vacío"),
        v.trim(),
      ),
    ),
    description: v.optional(v.pipe(v.string(), v.trim())),
    sons: v.optional(
      v.array(FamilyNodeSchema, "El campo 'sons' debe ser un array"),
    ),
  }),
  v.check(
    (input) =>
      Object.keys(input).some(
        (key) => input[key as keyof typeof input] !== undefined,
      ),
    "Debe proporcionar al menos un campo para actualizar",
  ),
);

export const IdParamSchema = v.object({
  id: v.pipe(
    v.string("El parámetro 'id' es requerido"),
    v.nonEmpty("El parámetro 'id' no puede estar vacío"),
  ),
});

export const UpdateNodeSchema = v.pipe(
  v.object({
    name: v.optional(
      v.pipe(
        v.string("El campo 'name' debe ser un texto"),
        v.nonEmpty("El campo 'name' no puede estar vacío"),
        v.trim(),
      ),
    ),
    dni: v.optional(
      v.pipe(
        v.number("El campo 'dni' debe ser un número"),
        v.integer("El DNI debe ser un número entero"),
        v.minValue(1, "El DNI debe ser un número positivo"),
      ),
    ),
    description: v.optional(v.pipe(v.string(), v.trim())),
    birthdate: v.optional(v.string()),
    customFields: v.optional(v.array(CustomFieldSchema)),
  }),
  v.check(
    (input) =>
      Object.keys(input).some(
        (key) => input[key as keyof typeof input] !== undefined,
      ),
    "Debe proporcionar al menos un campo para actualizar",
  ),
);

export const CreateNodeSchema = v.object({
  name: v.pipe(
    v.string("El campo 'name' debe ser un texto"),
    v.nonEmpty("El campo 'name' es requerido"),
    v.trim(),
  ),
  dni: v.pipe(
    v.number("El campo 'dni' debe ser un número"),
    v.integer("El DNI debe ser un número entero"),
    v.minValue(1, "El DNI debe ser un número positivo"),
  ),
  description: v.optional(v.pipe(v.string(), v.trim()), ""),
  birthdate: v.optional(v.string()),
  customFields: v.optional(v.array(CustomFieldSchema), []),
});

export type FamilyInput = v.InferOutput<typeof FamilySchema>;
export type PutFamilyInput = v.InferOutput<typeof PutFamilySchema>;
export type UpdateNodeInput = v.InferOutput<typeof UpdateNodeSchema>;
export type CreateNodeInput = v.InferOutput<typeof CreateNodeSchema>;
