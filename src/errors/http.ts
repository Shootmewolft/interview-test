import { createFactoryError } from './errors';

export const GetError = createFactoryError('GetError');
export const PostError = createFactoryError('PostError');
export const PutError = createFactoryError('PutError');
export const PatchError = createFactoryError('PatchError');
export const DeleteError = createFactoryError('DeleteError');

export type GetErrorInstance = InstanceType<typeof GetError>;
export type PostErrorInstance = InstanceType<typeof PostError>;
export type PutErrorInstance = InstanceType<typeof PutError>;
export type PatchErrorInstance = InstanceType<typeof PatchError>;
export type DeleteErrorInstance = InstanceType<typeof DeleteError>;
