// src/shims/shim-counter.d.ts

declare module "@browser-module/stores/counter" {
  export declare const useCounterStore: import('pinia').StoreDefinition<"counter", {
      counter: number;
  }, {}, {
      incrementCounter(): void;
      multiplyCounter(): void;
      resetCounter(): void;
  }>;
}
