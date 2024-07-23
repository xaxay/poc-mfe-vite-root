// src/components/admin/admin-routes.ts

import { RouteRecordRaw } from 'vue-router';
import Users from './Users.vue';
import UserDetails from './UserDetails.vue';


export function createRouteChildren(path: string): RouteRecordRaw[] {
  return [
    {
      path: 'users',
      component: Users,
      alias: ['', 'users']
    },
    {
      path: 'users/details/:name',
      component: UserDetails,
    },
    {
      path: ':pathMatch(.*)*',
      redirect: `${path}/users`
    }
  ];
}
