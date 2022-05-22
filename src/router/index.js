import { createRouter, createWebHistory } from 'vue-router';
import Manage from '@/views/Manage.vue';
import Home from '@/views/Home.vue';
import store from '@/store';

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'manage',
    // alias: '/manage',
    path: '/manage-music',
    component: Manage,
    // beforeEnter: (to, from, next) => {
    //   console.log('manage guard');
    //   console.log(to, from);
    //   next();
    // },
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/manage',
  //   redirect: { name: 'manage' },
  // },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  // console.log(to.matched, 'to mstched in router beforeEach ');
  console.log(from, 'from in router beforeEach ');
  // console.log('next() in router beforeEach ');
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
