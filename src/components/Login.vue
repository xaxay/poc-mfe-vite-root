<!-- /src/components/Login.vue -->

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="name"
                label="Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-3">Login</v-btn>
              <v-alert
                v-if="errorMessage"
                type="error"
                class="mt-3"
              >
                {{ errorMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import { navigateTo } from '@browser-module/api/nav';
  import { login } from '@browser-module/api/user';

  export default {
    props: {
      redirectTo: {
        type: String,
        default: '/dashboard'
      }
    },
    setup(props) {
      const name = ref<string>('');
      const password = ref<string>('');
      const errorMessage = ref<string>('');

      const handleLogin = async () : Promise<void> => {
        try {
          const success: boolean = await login(name.value, password.value);
          if (success) {
            navigateTo(props.redirectTo);
          } else {
            errorMessage.value = 'Wrong login and password';
          }
        } catch (error) {
          errorMessage.value = 'An error occurred. Please try again.';
        }
      };

      return {
        name,
        password,
        errorMessage,
        handleLogin
      };
    }
  };
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
