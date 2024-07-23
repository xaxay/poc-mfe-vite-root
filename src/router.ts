// src/router.ts

import { createRouter, createWebHistory, RouteMeta, RouteRecordRaw, RouteRecordSingleView, RouteRecordSingleViewWithChildren } from 'vue-router';
import routesConfig, { RouteDef } from '@browser-module/config/routes';
import { isLogined } from '@browser-module/api/user';

const baseUrl = import.meta.env.BASE_URL;

// Use empty router to make possible to resolve circular imports
const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: []
});

const routeEntries: [string, RouteDef][] = Object.entries(routesConfig.routes);

// Store dynamically imported modules
const importedModules: Record<string, any> = {};

// Function to dynamically import modules
async function dynamicImportModule(path: string) {
    if (!importedModules[path]) {
        try {
            importedModules[path] = await import(/* @vite-ignore */ path);
        } catch (error) {
            console.error(`[dynamicImport] Failed: ${path}`, error);
            throw error;
        }
    }
    return importedModules[path];
}

// Define and register routes
async function registerRoutes() {
    console.log('[router.ts] initializing ...');
    const routes: RouteRecordRaw[] = await Promise.all(routeEntries.map(async ([path, routeDef]) => {
        const module = await dynamicImportModule(routeDef.module);
        
        const meta: RouteMeta = { 
            title: routeDef.title, 
            requiresAuth: routeDef.requiresAuth === undefined || routeDef.requiresAuth 
        };

        if (module.createRouteChildren) {
            const children: RouteRecordRaw[] = module.createRouteChildren(path);
            
            for (const child of children) {
                child.meta = {
                    ...meta,
                    ...child.meta
                };
            }

            console.log(`[router.ts] route module with children loaded: ${path}`, children);
            return {
                path,
                component: module.default,
                children
            } as RouteRecordSingleViewWithChildren;
        }

        console.log(`[router.ts] route module loaded: ${path}`);
        return {
            path,
            component: module.default,
            meta,
        } as RouteRecordSingleView;
    }));

    // Add the default redirect route
    const defaultRoutePath = routesConfig.defaultPath;
    if (defaultRoutePath) {
        const defaultRoute = { path: '/:pathMatch(.*)*', redirect: defaultRoutePath };
        router.addRoute(defaultRoute);
        console.log('[router.ts] default route:', defaultRoute);
    }

    routes.forEach(route => router.addRoute(route));

    router.beforeEach((to, from, next) => {
      if (to.matched.length === 0) {
        console.log('[router.ts] Unknown path:', to.path, 'redirecting to default path:', routesConfig.defaultPath || '/');
        next(routesConfig.defaultPath || '/');
      } else {
          if (to.meta.requiresAuth && !isLogined()) {
            console.log('[router.ts] Requires auth, redirecting to login, back-url:', to.fullPath);
            next({ path: '/login', query: { back: to.fullPath } });
          } else {
            console.log('[router.ts] Navigation from:', from.path, 'to:', to.path);
            next();
          }
      }
  });

    console.log('[router.ts] initialized', '\nroutes to add:', routes, '\nrouter state:', router.getRoutes());
}


await registerRoutes();



export { router };
