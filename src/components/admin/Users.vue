<!-- /src/components/admin/Users.vue -->

<template>
  <v-container fluid>
    Search:
    <v-text-field 
      v-model="searchQuery" 
      label="Input user name" 
      flat 
      clearable 
      prepend-inner-icon="mdi-magnify"
      @input="searchUsers"
    ></v-text-field>
    <template v-if="users.length">
      Found user{{ users.length > 1 ? 's' : '' }}
      <template v-if="users.length > 1 || !users.map(u => u.name).includes(searchQuery)">
        with name like *{{ searchQuery }}*
      </template>
      <v-list>
        <v-list-item 
          v-for="user in users" 
          :key="user.name" 
          @click="goToUserDetails(user.name)"
        >
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { navigateTo } from '@browser-module/api/nav';
import { searchUser, User } from './admin-api';

export default defineComponent({
  name: 'SearchUser',
  setup() {
    const searchQuery = ref('');
    const users = ref<User[]>([]);

    const searchUsers = async () => {
      if (searchQuery.value.length > 2) {
        users.value = await searchUser(searchQuery.value);
      } else {
        users.value = [];
      }
    };

    const goToUserDetails = (name: string) => {
      navigateTo({ path: `/admin/users/details/${name}` });
    };

    return {
      searchQuery,
      users,
      searchUsers,
      goToUserDetails
    };
  }
});
</script>

