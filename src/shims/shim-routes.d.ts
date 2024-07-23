// src/shims/shim-routes.d.ts

declare module "@browser-module/config/routes" {

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
  
  declare const routesConfig: RoutesConfig;
  export default routesConfig;

}
