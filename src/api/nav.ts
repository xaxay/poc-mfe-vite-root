// src/utils/nav.ts

console.log('[nav.ts]')

import { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router';
import routesConfig from '@/config/routes';

let routerInstanse: Router | null = null;

async function loadRouter(): Promise<void> {
  console.log('Started dynamic import of @browser-module/router')
  const { router } = await import('@browser-module/router');
  routerInstanse = router; 
  console.log('Finished dynamic import of @browser-module/router')
}

loadRouter();


export function navigateTo(to: RouteLocationRaw) : void {
  console.log('[nav.ts/navigateTo] to:', to, 'router:', routerInstanse)
  if (!routerInstanse) {
    throw new Error("router is not loaded yet");
  }
  routerInstanse.push(to);
}

export function getCurrentRoute() : RouteLocationNormalizedLoaded {
  if (!routerInstanse) {
    throw new Error("router is not loaded yet");
  }
  console.log('[nav.ts/getCurrentRoute] currentRoute:', 
    routerInstanse.currentRoute.value, 'router:', routerInstanse)
  return routerInstanse.currentRoute.value;
}

export function getDefaultPath() : string {
  console.log('[nav.ts/getDefaultPath]', routesConfig.defaultPath, 'router:', routerInstanse)
  return routesConfig.defaultPath;
}

export function join(...paths: string[]): string {
  return paths.map(path => path.replace(/\/+$/, '').replace(/^\/+/, '')).join('/');
}
