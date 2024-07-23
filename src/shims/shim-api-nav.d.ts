// src/shims/shim-api-nav.d.ts

// WARNING: There is no guarantee that the router is loaded 
// when the module "@browser-module/api/nav" is imported.
// Therefore, use the onRouterLoaded callback or check the result of getRouter.

// This behavior is expected to address circular dependencies 
// with the module "@browser-module/router". 
// When the router dynamically imports component modules (in non-lazy mode),
// some components may also import the router.
// And this nav-api tries to break the circular dependecy.

declare module "@browser-module/api/nav" {
  import { RouteLocationRaw, RouteLocationNormalizedLoaded } from 'vue-router';

  export function onRouterLoaded(callback: (router : Router) => void): void;
  export function getRouter() : Router | null;

  export function navigateTo(to: RouteLocationRaw): void;
  export function getCurrentRoute() : RouteLocationNormalizedLoaded;
  export function getDefaultPath() : string;
  export function join(...paths: string[]): string;
}
