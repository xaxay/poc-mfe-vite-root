// src/types/routeTypes.ts

export type RouteDefs = {
  [path: string]: RouteDef;
};
  
  
export type RouteDef = {
  title: string;
  module: string;
  icon?: string;
  dashboard?: boolean;
  requiresAuth?: boolean;
};

export type RoutesConfig = {
  defaultPath: string,
  routes: RouteDefs,
}