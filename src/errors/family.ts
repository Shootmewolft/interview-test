import { createFactoryError } from './errors';

export const GetAllFamilies = createFactoryError('GetAllFamilies');
export const GetFamily = createFactoryError('GetFamily');
export const CreateFamily = createFactoryError('CreateFamily');
export const UpdateFamily = createFactoryError('UpdateFamily');
export const DeleteFamily = createFactoryError('DeleteFamily');
export const GetFamilySons = createFactoryError('GetFamilySons');
export const GetNode = createFactoryError('GetNode');
export const CreateRootNode = createFactoryError('CreateRootNode');
export const CreateChildrenNode = createFactoryError('CreateChildrenNode');
export const UpdateNode = createFactoryError('UpdateNode');
export const DeleteNode = createFactoryError('DeleteNode');
