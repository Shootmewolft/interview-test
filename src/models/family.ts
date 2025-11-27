export interface Family {
  id: string;
  name: string;
  description?: string;
  sons: FamilyNode[];
  createdAt: Date;
}

export interface FamilyNode {
  id: string;
  dni: number;
  name: string;
  description?: string;
  customFields?: CustomField[];
  sons: FamilyNode[];
  birthdate: Date;
  createdAt: Date;
}

export interface CustomField {
  id: string;
  type: "text" | "color" | "range" | "date";
  label: string;
  value: string;
}

export type FamilyInput = Omit<Family, "id" | "createdAt">;
export type UpdateFamilyInput = Partial<FamilyInput>;

export type CreateFamily = Omit<Family, "id" | "sons" | "createdAt">;
export type UpdateFamily = Partial<CreateFamily>;
export type CreateNodeInput = Omit<FamilyNode, "id" | "sons" | "createdAt">;
export type UpdateNodeInput = Partial<CreateNodeInput>;
