// src/utils/nav.ts

// WARNING: There is no guarantee that the router is loaded 
// when the module "@browser-module/api/nav" is imported.
// Therefore, use the onRouterLoaded callback or check the result of getRouter.

// This behavior is expected to address circular dependencies 
// with the module "@browser-module/router". 
// When the router dynamically imports component modules (in non-lazy mode),
// some components may also import the router.
// And this nav-api tries to break the circular dependecy.

console.log('[nav.ts]')

import { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router';
import routesConfig from '@browser-module/config/routes';

console.log('Started dynamic import of @browser-module/router')
let routerPromise : Promise<any> = import('@browser-module/router');

let routerInstance: Router | null = null;
let routerLoadCallbacks: Array<() => void> = [];

async function loadRouter(): Promise<void> {
  const { router } = await routerPromise;
  console.log('Finished dynamic import of @browser-module/router')
  routerInstance = router; 
  executeRouterLoadCallbacks();
}

loadRouter();

export function getRouter() : Router | null {
  return routerInstance;
}


function executeRouterLoadCallbacks() {
  console.log('[nav.ts/navigateTo] notify router loaded.', 'router:', routerInstance)
  routerLoadCallbacks.forEach(callback => callback());
  routerLoadCallbacks = [];
}

export function onRouterLoaded(callback: () => void) {
  if (routerInstance) {
    callback();
  } else {
    if (!routerLoadCallbacks.includes(callback)) {
      routerLoadCallbacks.push(callback);
    }
  }
}


export function navigateTo(to: RouteLocationRaw) : void {
  console.log('[nav.ts/navigateTo] to:', to, 'router:', routerInstance)
  if (!routerInstance) {
    routerPromise.then(router => router!.push(to));
    return;
  }
  routerInstance!.push(to);
}

export function getCurrentRoute() : RouteLocationNormalizedLoaded {
  if (!routerInstance) {
    return {
      path: '/',
      fullPath: '/',
      meta: {}
    } as RouteLocationNormalizedLoaded;
  }
  console.log('[nav.ts/getCurrentRoute] currentRoute:', 
    routerInstance!.currentRoute.value, 'router:', routerInstance)
  return routerInstance!.currentRoute.value;
}

export function getDefaultPath() : string {
  console.log('[nav.ts/getDefaultPath]', routesConfig.defaultPath, 'router:', routerInstance)
  return routesConfig.defaultPath;
}

export function join(...paths: string[]): string {
  return paths.map(path => path.replace(/\/+$/, '').replace(/^\/+/, '')).join('/');
}
