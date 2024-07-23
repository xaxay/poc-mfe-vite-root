<!-- /src/components/Dashboard.vue -->

<template>
  <v-container fluid>
    <v-text-field v-model="searchQuery" label="Search Apps" flat clearable prepend-inner-icon="mdi-magnify"></v-text-field>
    <div class="app-grid">
      <v-hover v-for="(app, appIndex) in filteredApps" :key="app.name" v-slot:default="{ isHovering, props }">
        <v-card @click="openApp(app.path)" class="app-card" :elevation="isHovering ? 16 : 2" v-bind="props" :color="appIndex % 2 === 0 ? 'green' : 'blue'">
          <v-card-text class="text-center">
            <div class="icon-circle">
              <v-icon class="app-icon" size="5rem">{{ app.icon }}</v-icon>
            </div>
            <div class="app-name">{{ app.name }}</div>
          </v-card-text>
          <v-tooltip activator="parent" location="top" offset="-10">Click to open</v-tooltip>
        </v-card>
      </v-hover>
    </div>
  </v-container>
</template>

<script lang="ts">
import { ref, computed, Ref } from 'vue';
import { navigateTo } from '@browser-module/api/nav';
import routesConfig, { RouteDef } from '@browser-module/config/routes';
import { getUserPermissions } from '@browser-module/api/user';


export default {
  setup() {

    type App = {
      name: string;
      icon: string;
      path: string;
    }

    const apps : Ref<App[]> = ref<App[]>([]);
    const searchQuery = ref<string>('');

    const routeEntries: [string, RouteDef][] = Object.entries(routesConfig.routes);

    const permissions = getUserPermissions();

    function isAllowedApp(appName: string): boolean {
      return permissions.includes(appName);
    }

    routeEntries
      .filter(([path, data]) => (data.dashboard === true) && isAllowedApp(path.substring(1)))
      .forEach(([path, data]) => {
        apps.value.push({
          name: data.title,
          icon: data.icon || 'mdi-application',
          path
        } as App);
      });

    const openApp = (route: string) => {
      navigateTo(route);
    };

    const filteredApps = computed(() => {
      const search = searchQuery.value.toLowerCase();
      return apps.value.filter(app => !searchQuery.value || app.name.toLowerCase().includes(search));
    });

    return {
      searchQuery,
      filteredApps,
      openApp
    };
  }
};
</script>

<style scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1rem;
  justify-items: center;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  width: 10rem;
  height: 15rem;
  cursor: pointer;
  padding-top: 0rem;
}

.icon-circle {
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7rem;
  height: 7rem;
  margin: 0 auto 1rem auto;
}

.app-icon {
  color: black;
}

.app-name {
  font-size: 1.2rem;
  line-height: 1.3rem;
}
</style>
