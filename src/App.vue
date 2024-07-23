<!-- /src/App.vue -->

<template>
 <v-app>
      <header-component/>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
</template>

<script setup lang="ts">
  import HeaderComponent from '@browser-module/ui/header';
</script>
