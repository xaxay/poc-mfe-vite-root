import f from"@browser-module/config/routes";const v="modulepreload",P=function(e){return"/poc-mfe-vite-root/"+e},d={},R=function(u,c,w){let i=Promise.resolve();if(c&&c.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),n=s?.nonce||s?.getAttribute("nonce");i=Promise.all(c.map(o=>{if(o=P(o),o in d)return;d[o]=!0;const l=o.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${h}`))return;const r=document.createElement("link");if(r.rel=l?"stylesheet":v,l||(r.as="script",r.crossOrigin=""),r.href=o,n&&r.setAttribute("nonce",n),document.head.appendChild(r),l)return new Promise((p,g)=>{r.addEventListener("load",p),r.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${o}`)))})}))}return i.then(()=>u()).catch(s=>{const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=s,window.dispatchEvent(n),!n.defaultPrevented)throw s})};console.log("[nav.ts]");console.log("Started dynamic import of @browser-module/router");let m=R(()=>import("@browser-module/router"),[]),t=null,a=[];async function y(){const{router:e}=await m;console.log("Finished dynamic import of @browser-module/router"),t=e,E()}y();function L(){return t}function E(){console.log("[nav.ts/navigateTo] notify router loaded.","router:",t),a.forEach(e=>e()),a=[]}function _(e){t?e():a.includes(e)||a.push(e)}function b(e){if(console.log("[nav.ts/navigateTo] to:",e,"router:",t),!t){m.then(u=>u.push(e));return}t.push(e)}function S(){return t?(console.log("[nav.ts/getCurrentRoute] currentRoute:",t.currentRoute.value,"router:",t),t.currentRoute.value):{path:"/",fullPath:"/",meta:{}}}function T(){return console.log("[nav.ts/getDefaultPath]",f.defaultPath,"router:",t),f.defaultPath}function k(...e){return e.map(u=>u.replace(/\/+$/,"").replace(/^\/+/,"")).join("/")}export{S as getCurrentRoute,T as getDefaultPath,L as getRouter,k as join,b as navigateTo,_ as onRouterLoaded};
