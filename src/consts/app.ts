export const APP_ROUTES = {
  HOME: "/",
  FAMILY: (id: string) => `/${id}`,
  SON: (familyId: string, sonId: string) => `/${familyId}/${sonId}`,
};
