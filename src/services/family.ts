import { CONFIG_APP } from "@/config/environment.config";
import {
  CreateChildrenNode,
  CreateFamily,
  CreateRootNode,
  DeleteError,
  DeleteFamily,
  DeleteNode,
  GetAllFamilies,
  GetError,
  GetFamily,
  GetFamilySons,
  GetNode,
  PostError,
  PutError,
  UpdateFamily,
  UpdateNode,
} from "@/errors";
import type {
  ApiResponse,
  CreateNodeInput,
  CreateResponse,
  Family,
  FamilyInput,
  FamilyNode,
  MessageResponse,
  UpdateFamilyInput,
  UpdateNodeInput,
} from "@/models";
import { del, get, post, put } from "@/services/http";

export async function getAllFamilies(): Promise<Family[]> {
  const result = await get<ApiResponse<Family[]>>(
    `${CONFIG_APP.api.url}/family`,
  );
  if (result instanceof GetError) throw new GetAllFamilies(result.message);
  return result.data;
}

export async function getFamily(id: string): Promise<Family | null> {
  const result = await get<ApiResponse<Family>>(
    `${CONFIG_APP.api.url}/family/${id}`,
  );
  if (result instanceof GetError) throw new GetFamily(result.message);
  return result.data;
}

export async function createFamily(family: FamilyInput): Promise<string> {
  const result = await post<CreateResponse, FamilyInput>(
    `${CONFIG_APP.api.url}/family`,
    family,
  );
  if (result instanceof PostError) throw new CreateFamily(result.message);
  return result.id;
}

export async function updateFamily(
  id: string,
  data: UpdateFamilyInput,
): Promise<void> {
  const result = await put<MessageResponse, UpdateFamilyInput>(
    `${CONFIG_APP.api.url}/family/${id}`,
    data,
  );
  if (result instanceof PutError) throw new UpdateFamily(result.message);
}

export async function deleteFamily(id: string): Promise<void> {
  const result = await del<MessageResponse>(
    `${CONFIG_APP.api.url}/family/${id}`,
  );
  if (result instanceof DeleteError) throw new DeleteFamily(result.message);
}

export async function getFamilySons(familyId: string): Promise<FamilyNode[]> {
  const result = await get<ApiResponse<FamilyNode[]>>(
    `${CONFIG_APP.api.url}/son/${familyId}`,
  );
  if (result instanceof GetError) throw new GetFamilySons(result.message);
  return result.data;
}

export async function getNode(
  familyId: string,
  nodeId: string,
): Promise<FamilyNode | null> {
  const result = await get<ApiResponse<FamilyNode>>(
    `${CONFIG_APP.api.url}/son/${familyId}/${nodeId}`,
  );
  if (result instanceof GetError) throw new GetNode(result.message);
  return result.data;
}

export async function createRootNode(
  familyId: string,
  node: CreateNodeInput,
): Promise<string> {
  const result = await post<CreateResponse, CreateNodeInput>(
    `${CONFIG_APP.api.url}/son/${familyId}`,
    node,
  );
  if (result instanceof PostError) throw new CreateRootNode(result.message);
  return result.id;
}

export async function createChildNode(
  familyId: string,
  parentId: string,
  node: CreateNodeInput,
): Promise<string> {
  const result = await post<CreateResponse, CreateNodeInput>(
    `${CONFIG_APP.api.url}/son/${familyId}/${parentId}`,
    node,
  );
  if (result instanceof PostError) throw new CreateChildrenNode(result.message);
  return result.id;
}

export async function updateNode(
  familyId: string,
  nodeId: string,
  data: UpdateNodeInput,
): Promise<void> {
  const result = await put<MessageResponse, UpdateNodeInput>(
    `${CONFIG_APP.api.url}/son/${familyId}/${nodeId}`,
    data,
  );
  if (result instanceof PutError) throw new UpdateNode(result.message);
}

export async function deleteNode(
  familyId: string,
  nodeId: string,
): Promise<void> {
  const result = await del<MessageResponse>(
    `${CONFIG_APP.api.url}/son/${familyId}/${nodeId}`,
  );
  if (result instanceof DeleteError) throw new DeleteNode(result.message);
}
