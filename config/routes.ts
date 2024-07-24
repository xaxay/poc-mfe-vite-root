// config/routes.ts

import { RoutesConfig } from "@/types/routeTypes";


const routesConfig: RoutesConfig = {
  
  defaultPath: '/dashboard',

  routes: {
    "/login": { title: "Authorization", icon: "mdi-login", module: `@browser-module/ui/login`, requiresAuth: false},
    "/dashboard": { title: "Dashboard", icon: "mdi-view-dashboard", module: `@browser-module/ui/dashboard`},
  
    "/admin": { title: "Administration", icon: "mdi-cog", module: `@browser-module/ui/admin`, dashboard: true},
    "/account": { title: "My account", icon: "mdi-badge-account-horizontal-outline", module: `@browser-module/ui/account`, dashboard: true},
    "/rumors": { title: "The incredible and unbelievable news", icon: "mdi-newspaper", module: `@browser-module/ui/rumors`, dashboard: true},
    
    "/app4": { title: "app4", module: `@browser-module/ui/app4`, dashboard: true},
    "/app5": { title: "app5", module: `@browser-module/ui/app5`, dashboard: true},
    "/app6": { title: "app6", module: `@browser-module/ui/app6`, dashboard: true},
    "/app7": { title: "app7", module: `@browser-module/ui/app7`, dashboard: true},
    "/app8": { title: "app8", module: `@browser-module/ui/app8`, dashboard: true},
    "/app9": { title: "app9", module: `@browser-module/ui/app9`, dashboard: true},
    "/app10": { title: "app10", module: `@browser-module/ui/app10`, dashboard: true},
    "/app11": { title: "app11", module: `@browser-module/ui/app11`, dashboard: true},
    "/app12": { title: "app12", module: `@browser-module/ui/app12`, dashboard: true},
    "/app13": { title: "app13", module: `@browser-module/ui/app13`, dashboard: true},
    "/app14": { title: "app14", module: `@browser-module/ui/app14`, dashboard: true},
    "/app15": { title: "app15", module: `@browser-module/ui/app15`, dashboard: true},
    "/app16": { title: "app16", module: `@browser-module/ui/app16`, dashboard: true},
    "/app17": { title: "app17", module: `@browser-module/ui/app17`, dashboard: true},
    "/app18": { title: "app18", module: `@browser-module/ui/app18`, dashboard: true},
  }
}


export default routesConfig;