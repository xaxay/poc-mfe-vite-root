<!-- /src/components/admin/Admin.vue -->

<template>
  <v-container fluid>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Admin Panel</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      :clipped="isLargeScreen"
      :permanent="isLargeScreen"
    >
      <v-list dense>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :to="item.pathClcik || item.path"
          router
          :active="isActive(item)"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ getTitle(item) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { createRouteChildren } from './admin-routes';
import { getUserLogin } from '@browser-module/api/user';
import { getCurrentRoute } from '@browser-module/api/nav';

export default defineComponent({
  name: 'Admin',
  setup() {
    const drawer = ref(false);
    const userLogin = getUserLogin();

    const isLargeScreen = ref(false);

    const updateIsLargeScreen = () => {
      const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
      isLargeScreen.value = window.innerWidth >= remInPixels * 32;
    };

    onMounted(() => {
      updateIsLargeScreen();
      window.addEventListener('resize', updateIsLargeScreen);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateIsLargeScreen);
    });

    type NavItemDef = {
      title: string,
      icon: string;
      exact: boolean;
      path: string;
      alias?: string;
      pathClcik?: string;
      altTitle?: string;
    };

    const items = computed(() => [
      { 
        title: 'Users', 
        icon: 'mdi-account-search-outline', 
        exact: true,
        path: '/admin/users',
        alias: '/admin',
      },
      { 
        title: 'User', 
        icon: 'mdi-account-outline', 
        exact: false,
        path: `/admin/users/details/`,
        pathClcik: `/admin/users/details/${userLogin}`,
        altTitle: 'User (Me)'
      },
    ] as NavItemDef[]);

    function isActive(item: NavItemDef): boolean {
      const path = getCurrentRoute().path;
      if (item.exact) {
        if (path === item.path) {
          return true;
        }
        if (!!item.alias && path === item.alias) {
          return true;
        }
        return false;
      }
      if (path.startsWith(item.path)) {
        return true;
      }
      return false;
    }

    function getTitle(item: NavItemDef): string {
      const currentPath = getCurrentRoute().path;
      if (item.pathClcik) {
        return currentPath === item.pathClcik ? item.altTitle || item.title : item.title;
      }
      return item.title;
    }

    function toggleDrawer() {
      drawer.value = !drawer.value;
    }

    return {
      drawer,
      items,
      isActive,
      getTitle,
      toggleDrawer,
      isLargeScreen,
    };
  },
});

export { createRouteChildren };
</script>

<style scoped>
</style>
