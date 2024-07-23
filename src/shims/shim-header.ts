// src/shims/shim-header.d.ts

declare module "@browser-module/ui/header" {
  import { DefineComponent } from "vue";
  const HeaderComponent: DefineComponent<{}, {}, any>;
  export default HeaderComponent;
}
