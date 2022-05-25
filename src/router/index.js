import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/Home.vue';
// import Manage from '@/views/Manage.vue';
// import Song from '@/views/Song.vue';
import store from '@/store';
// chunking
const Home = () => (import('@/views/Home.vue'));
const Song = () => (import('@/views/Song.vue'));
const Manage = () => (import('@/views/Manage.vue'));
const About = () => (import('@/views/About.vue'));

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
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
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    path: '/song/:id',
    name: 'song',
    component: Song,
  },
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

router.beforeEach((to, _, next) => {
  // console.log(to.matched, 'to mstched in router beforeEach ');
  // console.log(from, 'from in router beforeEach ');
  // console.log('next() in router beforeEach ');
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
