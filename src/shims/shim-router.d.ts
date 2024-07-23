// src/shims/shim-router.d.ts

declare module "@browser-module/router" {
  import { Router } from "vue-router";
  export const router: Router;
}
