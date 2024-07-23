<!-- /src/components/admin/UserDetails.vue -->

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-2">
          <v-card-title>
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar>
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                {{ userDetails?.name }}
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                Permissions:
              </v-col>
            </v-row>
            <v-row>
              <v-col v-for="permission in userDetails?.permissions" :key="permission" cols="auto">
                <v-chip>{{ permission }}</v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserDetails, UserDetails } from './admin-api';

export default defineComponent({
  name: 'UserDetails',
  setup() {
    const route = useRoute();
    const userDetails = ref<UserDetails | null>(null);

    onMounted(async () => {
      const name = route.params.name as string;
      if (name) {
        userDetails.value = await getUserDetails(name);
      }
    });

    return {
      userDetails
    };
  }
});
</script>
