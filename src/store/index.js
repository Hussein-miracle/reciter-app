import { createStore } from 'vuex';

// import auth from './modules/auth';
// import player from './modules/player';
// import router from '@/router';//this causes dependency cycle which is bad code;
// console.log(helper);
import modules from './modules';
// const { formatTime } = helper;

export default createStore({
  modules,
});
