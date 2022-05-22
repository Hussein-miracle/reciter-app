import { createApp } from 'vue';

import App from './App.vue';

import router from './router';

import store from './store';
import VeeValidatePlugin from './includes/validation';
import firebaseFunctions from './includes/firebase';
import './assets/tailwind.css';

import './assets/main.css';

const { auth, onAuthStateChanged } = firebaseFunctions;

let app = null;

onAuthStateChanged(auth, () => {
  // console.log(user, 'user');
  if (app === null) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin, { foo: 5 });
    app.mount('#app');
  }
});
