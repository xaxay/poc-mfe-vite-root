// src/main.ts

import * as _nav from '@browser-module/api/nav' // preload it first
import App from '@/App.vue'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { router } from '@/router'

const pinia = createPinia();
pinia.use(createPersistedState());

const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
    },
  }
);

const app = createApp(App)

app.use(vuetify);
app.use(pinia);
app.use(router);

app.mount('#app')
