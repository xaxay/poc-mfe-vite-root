// src/stores/counterStore.ts
import { defineStore } from 'pinia';

console.log('counterStore created');

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0
  }),
  actions: {
    incrementCounter() {
      this.counter += 1;
    },
    multiplyCounter() {
      this.counter *= 2;
    },
    resetCounter() {
      this.counter = 0;
    }
  },
  persist: true
});
