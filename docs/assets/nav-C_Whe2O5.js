import i from"./routes-CryGAF5U.js";const p="modulepreload",g=function(e){return"/poc-mfe-vite/"+e},d={},v=function(s,a,y){let l=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),n=c?.nonce||c?.getAttribute("nonce");l=Promise.all(a.map(o=>{if(o=g(o),o in d)return;d[o]=!0;const u=o.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${f}`))return;const r=document.createElement("link");if(r.rel=u?"stylesheet":p,u||(r.as="script",r.crossOrigin=""),r.href=o,n&&r.setAttribute("nonce",n),document.head.appendChild(r),u)return new Promise((m,h)=>{r.addEventListener("load",m),r.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${o}`)))})}))}return l.then(()=>s()).catch(c=>{const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=c,window.dispatchEvent(n),!n.defaultPrevented)throw c})};console.log("[nav.ts]");let t=null;async function w(){console.log("Started dynamic import of @browser-module/router");const{router:e}=await v(async()=>{const{router:s}=await import("@browser-module/router");return{router:s}},[]);t=e,console.log("Finished dynamic import of @browser-module/router")}w();function P(e){if(console.log("[nav.ts/navigateTo] to:",e,"router:",t),!t)throw new Error("router is not loaded yet");t.push(e)}function R(){if(!t)throw new Error("router is not loaded yet");return console.log("[nav.ts/getCurrentRoute] currentRoute:",t.currentRoute.value,"router:",t),t.currentRoute.value}function _(){return console.log("[nav.ts/getDefaultPath]",i.defaultPath,"router:",t),i.defaultPath}function b(...e){return e.map(s=>s.replace(/\/+$/,"").replace(/^\/+/,"")).join("/")}export{R as getCurrentRoute,_ as getDefaultPath,b as join,P as navigateTo};
