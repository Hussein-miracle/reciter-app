import { createStore } from 'vuex';
import { Howl } from 'howler';
import firebaseData from '@/includes/firebase';
import helper from '@/includes/helper';

// import router from '@/router';//this causes dependency cycle which is bad code;
// console.log(helper);
const {
  auth, createUserWithEmailAndPassword, usersCollection, addDoc, serverTimestamp, updateProfile, signInWithEmailAndPassword, signOut,
} = firebaseData;

// const { formatTime } = helper;

export default createStore({
  state: {
    authModalShow: false,
    currentUser: null,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    // must be sync always
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
      // console.log(state.authModalShow, 'store');
    },
    setCurrentUser: (state, payload) => {
      // console.log(payload, 'payload');
      state.currentUser = payload;
      // console.log(state.currentUser, 'store');
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  getters: {
    // modalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
  actions: {
    // can be async or synchronous
    register: async (context, payload) => {
      const { commit } = context;
      console.log(context, 'context data');
      // console.log(payload, 'patload data');
      const {
        email, password, name, age, country,
      } = payload;
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        email,
        name,
        age,
        country,
        time: serverTimestamp(),
      };

      // userCredentials.user.
      await updateProfile(userCredentials.user, {
        displayName: name,
      });

      // console.log(userData, 'userData');
      // Add a new document with a generated id.
      await addDoc(usersCollection, userData);
      commit('toggleAuth');
      // console .log('Document written with ID: ', docRef);
      commit('toggleAuthModal');
    },
    init_login({ commit }) {
      const user = auth.currentUser;
      // console.log(user, 'user');
      // console.log(auth, 'auth');

      if (user) {
        commit('toggleAuth');
      }
    },
    async login(context, payload) {
      const { commit } = context;
      const { email, password } = payload;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.log(err);
      }

      commit('toggleAuth');
      commit('toggleAuthModal');
    },
    signout: async ({ commit }) => {
      // const { route, router } = payload;
      try {
        await signOut(auth);
        commit('toggleAuth');
        // if (route.meta.requiresAuth) {
        //   router.push({ name: 'home' });
        // }
      } catch (err) {
        console.log(err);
      }
    },
    async newSong(context, payload) {
      const { commit, state, dispatch } = context;
      // console.log(commit, 'commit');
      // console.log(context, 'new song context in store');
      // console.log(payload, 'new song payload in store');
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit('newSong', payload);
      state.sound.play();
      console.log(state.sound, 'state.sound');

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      // eslint-disable-next-line no-useless-return
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state }, payload) {
      if (!state.sound.playing) return;

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      // const width = 560;

      const percentage = (clickX / width);
      // console.log(clickX, 'clickX');
      // console.log(x, 'x');
      this.playerProgress = `${percentage * 100}%`;

      const seconds = state.sound.duration() * percentage;
      state.sound.seek(seconds);
      state.sound.once('seek', () => {
        this.dispatch('progress');
      });
    },
  },
});
