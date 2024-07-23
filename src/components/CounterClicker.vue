<!-- /src/components/PortalPluginStub.vue -->

<template><v-container fluid>
    <h1>{{ appName }}</h1>
    <p>Content for {{ appName }}</p>

    <v-badge :content="counter" color="red" overlap class="badge" max="99">
        <v-btn icon @click="store.resetCounter" size="x-large" class="button">
            <v-icon size="x-large">mdi-bell-off</v-icon>
            0
            <v-tooltip activator="parent" location="bottom">
                Click to reset
            </v-tooltip>
        </v-btn>
    </v-badge>

    <v-badge :content="counter" color="red" overlap class="badge" max="99">
        <v-btn icon @click="store.incrementCounter" size="x-large" class="button">
            <v-icon size="x-large">mdi-bell-plus</v-icon>
            +1
            <v-tooltip activator="parent" location="bottom">
                Click to increment
            </v-tooltip>
        </v-btn>
    </v-badge>

    <v-badge :content="counter" color="red" overlap class="badge">
        <v-btn icon @click="store.multiplyCounter" size="x-large" class="button">
            <v-icon size="x-large">mdi-bell-remove</v-icon>
            x2
            <v-tooltip activator="parent" location="bottom">
                Click to multiply
            </v-tooltip>
        </v-btn>
    </v-badge>
</v-container></template>

<script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCounterStore } from '@browser-module/stores/counter';
  
  export default {
    setup() {
      const router = useRouter();
      const store = useCounterStore();
      const route = computed(() => router.currentRoute.value);
  
      const appName = computed(() => {
        if (route.value && route.value.path) {
          const pathSegments = route.value.path.split('/');
          return pathSegments[pathSegments.length - 1] || 'home';
        }
        return 'home';
      });
  
      const counter = computed(() => store.counter);
  
      return {
        appName,
        counter,
        store
      };
    }
  };
</script>

<style scoped></style>