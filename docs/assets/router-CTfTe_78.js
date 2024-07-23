import{createRouter as d,createWebHistory as m}from"vue-router";import a from"@browser-module/config/routes";import{isLogined as f}from"@browser-module/api/user";const h="/poc-mfe-vite-root/",u=d({history:m(h),routes:[]}),g=Object.entries(a.routes),n={};async function p(e){if(!n[e])try{n[e]=await import(e)}catch(i){throw console.error(`[dynamicImport] Failed: ${e}`,i),i}return n[e]}async function R(){console.log("[router.ts] initializing ...");const e=await Promise.all(g.map(async([t,r])=>{const o=await p(r.module),s={title:r.title,requiresAuth:r.requiresAuth===void 0||r.requiresAuth};if(o.createRouteChildren){const l=o.createRouteChildren(t);for(const c of l)c.meta={...s,...c.meta};return console.log(`[router.ts] route module with children loaded: ${t}`,l),{path:t,component:o.default,children:l}}return console.log(`[router.ts] route module loaded: ${t}`),{path:t,component:o.default,meta:s}})),i=a.defaultPath;if(i){const t={path:"/:pathMatch(.*)*",redirect:i};u.addRoute(t),console.log("[router.ts] default route:",t)}e.forEach(t=>u.addRoute(t)),u.beforeEach((t,r,o)=>{t.matched.length===0?(console.log("[router.ts] Unknown path:",t.path,"redirecting to default path:",a.defaultPath||"/"),o(a.defaultPath||"/")):t.meta.requiresAuth&&!f()?(console.log("[router.ts] Requires auth, redirecting to login, back-url:",t.fullPath),o({path:"/login",query:{back:t.fullPath}})):(console.log("[router.ts] Navigation from:",r.path,"to:",t.path),o())}),console.log("[router.ts] initialized",`
routes to add:`,e,`
router state:`,u.getRoutes())}await R();export{u as router};