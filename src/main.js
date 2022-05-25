import { createApp } from 'vue';
import GlobalComponents from '@/includes/_globals';
import App from './App.vue';

import router from './router';

import store from './store';
import VeeValidatePlugin from './includes/validation';
import firebaseFunctions from './includes/firebase';
import './assets/tailwind.css';
import Icon from './directives/icon';
import './assets/main.css';
import i18n from './includes/i18n';
// import './registerServiceWorker';
import ProgressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

ProgressBar(router);

const { auth, onAuthStateChanged } = firebaseFunctions;

let app = null;

onAuthStateChanged(auth, () => {
  // console.log(user, 'user');
  if (app === null) {
    app = createApp(App).use(i18n);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive('icon', Icon);
    app.mount('#app');
  }
});
