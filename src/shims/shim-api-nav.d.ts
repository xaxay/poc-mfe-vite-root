// src/shims/shim-api-nav.d.ts

declare module "@browser-module/api/nav" {
  import { RouteLocationRaw, RouteLocationNormalizedLoaded } from 'vue-router';

  export function navigateTo(to: RouteLocationRaw): void;
  export function getCurrentRoute() : RouteLocationNormalizedLoaded;
  export function getDefaultPath() : string;
  export function join(...paths: string[]): string;
}
